/*
 *  Copyright 2015 (c) Stan Sage <me@stansage.com>
 *  Licensed under the GPLv2 License.
 *  https://github.com/stansage/cryptocoinlife
 */

var Rpc = require( "./rpc" );
var Session = require( "./session" );
var ResponseType = {
  BLOCK: {},
  TRANSACTION: {}
};

function Api( provider ) {
    this.sessions = [];
    this.rpc = new Rpc( provider );
    this.findSession = function( socket ) {
        for ( var i = 0; i < this.sessions.length; ++ i ) {
            var session = this.sessions[ i ];
            if ( this.sessions[ i ].hasClient( socket ) ) {
                return i;
            }
        }
        return -1;
    };
    this.onResponse = function( session, type, response ) {
        if ( ! session.isActive() ) {
            return;
        }

        switch ( type ) {
        case ResponseType.TRANSACTION:
            session.addTransaction( response );
            break;
        case ResponseType.BLOCK:
            for ( var i = 0; i < response.tx.length; ++ i ) {
                this.rpc.getTransaction( response.tx[ i ], this.onResponse.bind( this, session, ResponseType.TRANSACTION ) );
            }
            if ( response.nextblockhash ) {
                this.rpc.getBlock( response.nextblockhash, this.onResponse.bind( this, session, ResponseType.BLOCK ) );
            } else {
                console.warn( "All blocks exhausted", response );
            }

            break;
        default:
            console.warn( "Invalid response type:", type );
            break;
        }
    };
    this.onRequest = function( socket, event ) {
        console.log( "Api:onRequest:event.data:", event.data );

        var session = this.findSession( socket );
        if ( session === -1 ) {
            throw "Unknown session";
        }
        this.sessions[ session ].setLayout( JSON.parse( event.data ) );
        this.rpc.getBlock( 0, this.onResponse.bind( this, this.sessions[ session ], ResponseType.BLOCK ) );
    }
}

Api.prototype.subscribe = function( socket ) {
    socket.onmessage = this.onRequest.bind( this, socket );

    var session = new Session( socket );
    this.sessions.push( session );
};

Api.prototype.unsubscribe = function( socket ) {
    var session = this.findSession( socket );
    if ( session !== -1 ) {
        this.sessions[ session ].setActive( false );
        this.sessions.splice( session, 1 );
    }
};

module.exports = {
    createApi: function( provider ) {
        return new Api( provider );
    }
};
