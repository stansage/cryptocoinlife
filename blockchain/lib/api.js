/*
 *  Copyright 2015 (c) Stan Sage <me@stansage.com>
 *  Licensed under the GPLv2 License.
 *  https://github.com/stansage/cryptocoinlife
 */

function Api( provider ) {
    var Rpc = require( "./rpc" );

    this.clients = [];
    this.rpc = new Rpc( provider );
}

Api.prototype.subscribe = function( socket ) {
    this.clients.push( socket );

    socket.send( JSON.stringify( this.rpc.getBlock( 0 ) ) );
};

Api.prototype.unsubscribe = function( socket ) {
    var index =  this.clients.indexOf( socket );
    if ( index !== -1 ) {
        this.clients.slice( index, 1 );
    }
};

module.exports = {
    createApi: function( provider ) {
        return new Api( provider );
    }
};
