/*
 *  Copyright 2015 (c) Stan Sage <me@stansage.com>
 *  Licensed under the GPLv2 License.
 *  https://github.com/stansage/cryptocoinlife
 */

function Rpc( client ) {
    this.client = client;
    this.makeResult = function( rpc, key, callback ) {
        return function( error, result, headers ) {
            if ( error ) {
                console.error( "Rpc:makeResult:", error, key );
            }
            callback( rpc, result );
        };
    };
}

Rpc.prototype.getBlock = function( key, callback ) {
    if ( typeof( key ) === "string" ) {
        this.client.getBlock( key, this.makeResult( this, key, function( rpc, block ) {
            callback( block );
        } ) );
    } else {
        this.client.getBlockHash( key, this.makeResult( this, key, function( rpc, hash ) {
            rpc.client.getBlock( hash,  rpc.makeResult( rpc, key, function( rpc, block ) {
                callback( block );
            } ) );
        } ) );
    }
};

Rpc.prototype.getTransaction = function( id, callback ) {
    this.client.getRawTransaction( id, 1, this.makeResult( this, id, function( rpc, transaction ) {
        callback( transaction );
    } ) );
};



module.exports = Rpc;
