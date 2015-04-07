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
    var index = this.find( socket );
    if ( index !== -1 ) {
        this.sessions[ index ].client = null;
        this.sessions.splice( index, 1 );
    }
};

Api.prototype.find = function( socket ) {
    for ( var i = 0; i < this.sessions.length; ++ i ) {
        var session = this.sessions[ i ];
        if ( this.sessions[ i ].client === socket ) {
            return i;
        }
    }
    return -1;
};


Api.prototype.nextBlock = function( session, block ) {
    var duration = session.whenReady();

//    console.log( "Api:nextBlock:duration:", duration );

    if ( duration !== 0 ) {
        setTimeout( this.nextBlock.bind( this, session, block ), duration );
    } else {
        session.time = Date.now();
        this.rpc.getBlock( block, this.onResponse.bind( this, session, ResponseType.BLOCK ) );
    }
}

Api.prototype.onResponse = function( session, type, response ) {
    if ( ! session.active()  ) {
        return;
    }

    switch ( type ) {
    case ResponseType.TRANSACTION:
        session.onTransaction( response );
        break;
    case ResponseType.BLOCK:
        for ( var i = 0; i < response.tx.length; ++ i ) {
            this.rpc.getTransaction( response.tx[ i ], this.onResponse.bind( this, session, ResponseType.TRANSACTION ) );
        }
        if ( response.nextblockhash ) {
            this.nextBlock( session, response.nextblockhash );
        } else {
            console.warn( "Api:onRespose: All blocks exhausted", response );
        }

        break;
    default:
        throw "Api:onRespose: Invalid response type " + type;
    }
};

Api.prototype.onRequest = function( socket, event ) {
    var index = this.find( socket );
    if ( index === -1 ) {
        throw "Api:onRequest: Unknown session";
    }

    var session = this.sessions[ index ];
    if ( ! session.client ) {
        throw "Api:onRequest: Invalid session";
    }

    var active = session.active();
    session.config = JSON.parse( event.data );

    if ( session.active() ) {
        this.nextBlock( session, session.config.offset );
    } else if ( active ) {
        console.info( "Api:onRequest: Closing session", index );
        socket.close();
    }
}


module.exports = {
    createApi: function( provider ) {
        return new Api( provider );
    }
};
