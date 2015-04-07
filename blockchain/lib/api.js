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

function Api( bitcoin ) {
    this.sessions = [];
    this.rpc = new Rpc( bitcoin );
}

Api.prototype.subscribe = function( socket ) {
    socket.onmessage = this.onRequest.bind( this, socket );

    var session = new Session( socket );
    this.sessions.push( session );
};

Api.prototype.unsubscribe = function( socket ) {
    var index = this.findSession( socket );
    if ( index !== -1 ) {
        this.sessions[ session ].close( undefined );
        this.sessions.splice( session, 1 );
    }
};

Api.prototype.findSession = function( socket ) {
    for ( var i = 0; i < this.sessions.length; ++ i ) {
        var session = this.sessions[ i ];
        if ( this.sessions[ i ].hasClient( socket ) ) {
            return i;
        }
    }
    return -1;
};

Api.prototype.onResponse = function( session, type, response ) {
    if ( ! session.isActive() ) {
        return;
    }

    switch ( type ) {
    case ResponseType.TRANSACTION:
        session.add( response );
        break;
    case ResponseType.BLOCK:
        for ( var i = 0; i < response.tx.length; ++ i ) {
            this.rpc.getTransaction( response.tx[ i ], this.onResponse.bind( this, session, ResponseType.TRANSACTION ) );
        }
        if ( response.nextblockhash ) {
            this.rpc.getBlock( response.nextblockhash, this.onResponse.bind( this, session, ResponseType.BLOCK ) );
        } else {
            console.warn( "Ap:onRespose: All blocks exhausted", response );
        }

        break;
    default:
        console.warn( "Ap:onRespose: Invalid response type:", type );
        break;
    }
};

Api.prototype.onRequest = function( socket, event ) {
    console.log( "Api:onRequest:event.data:", event.data );

    var index = this.findSession( socket );
    if ( index === -1 ) {
        throw "Ap:onRequest: Unknown session";
    }
    var session = this.sessions[ index ];
    var argument = JSON.parse( event.data );

    if ( session.isActive() ) {
        session.stop( argument );
    } else {
        session.start( argument );
        this.rpc.getBlock( 0, this.onResponse.bind( this, session, ResponseType.BLOCK ) );
    }
}

module.exports = {
    createApi: function( provider ) {
        return new Api( provider );
    }
};
