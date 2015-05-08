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
    this.chain = {};
}

Api.prototype.subscribe = function( socket ) {
    var session = new Session( socket, this.rpc, this.chain );
    this.sessions.push( session );
    session.start();
};

Api.prototype.unsubscribe = function( socket ) {
    var index = this.find( socket );
    if ( index !== -1 ) {
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

module.exports = {
    createApi: function( provider ) {
        return new Api( provider );
    }
};
