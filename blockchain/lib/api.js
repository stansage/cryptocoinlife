/*
 *  Copyright 2015 (c) Stan Sage <me@stansage.com>
 *  Licensed under the GPLv2 License.
 *  https://github.com/stansage/cryptocoinlife
 */

var Rpc = require( "./rpc" );
var Session = require( "./session" );

function Api( bitcoin ) {
    this.sessions = [];
    this.rpc = new Rpc( bitcoin );
}

Api.prototype.subscribe = function( socket ) {
    socket.onmessage = this.onRequest.bind( this, socket );

    var session = new Session( socket, this.rpc );
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
        session.nextBlock();
    } else if ( active ) {
        console.info( "Api:onRequest: Closing session", index );
        socket.close();
    } else {
        console.warn( "Api:onRequest: Session still active", index );
    }
}


module.exports = {
    createApi: function( provider ) {
        return new Api( provider );
    }
};
