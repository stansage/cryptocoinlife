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
    this.onResponse = function( session, type, response ) {
//        console.log( "Api:onResponse:scene:", scene );
//        console.log( "Api:onResponse:type:", type );
        //console.log( "Api:onResponse:socket:", socket );
//        console.log( "Api:onResponse:response:", response );

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
        //console.log( "Api:onRequest:this:", this );
        console.log( "Api:onRequest:socket:", socket );
        console.log( "Api:onRequest:event:", event );
//        this.rpc.getTransaction( event.data, this.onResponse.bind( this, socket, ResponseType.TRANSACTION ) );
    }
}

Api.prototype.subscribe = function( socket ) {
    socket.onmessage = this.onRequest.bind( this, socket );

    var session = new Session( socket );

    this.sessions.push( session );
    this.rpc.getBlock( 0, this.onResponse.bind( this, session, ResponseType.BLOCK ) );
};

Api.prototype.unsubscribe = function( socket ) {
    for ( var i = 0; i < this.sessions.length; ++ i ) {
        var session = this.sessions[ i ];
        if ( session.hasClient( socket ) ) {
            session.setActive( false );
            this.sessions.slice( i, 1 );
            break;
        }
    }
};

module.exports = {
    createApi: function( provider ) {
        return new Api( provider );
    }
};
