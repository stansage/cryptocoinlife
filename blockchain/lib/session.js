/*
 *  Copyright 2015 (c) Stan Sage <me@stansage.com>
 *  Licensed under the GPLv2 License.
 *  https://github.com/stansage/cryptocoinlife
 */

var Algebra = require( "./algebra" );
var Block = require( "./block" );

function Session( client, rpc ) {
    this.rpc = rpc;
    this.client = client;
    this.block = new Block();
}

Session.prototype.nextBlock = function() {
    if ( ! this.block.id ) {
        this.volume = this.block.total;
        this.block.begin();
        this.onTransaction();
    } else {
        this.rpc.getBlock( this.block.id, this.onBlock.bind( this ) );
    }
}

Session.prototype.onBlock = function( block ) {
    if ( !! block ) {
        this.block.id = block.nextblockhash;
        this.block.time = block.time;
        this.block.size = block.tx.length;
        for ( var i = 0; i < this.block.size; ++ i ) {
            this.rpc.getTransaction( block.tx[ i ], this.onTransaction.bind( this ) );
        }
    }
};

Session.prototype.onTransaction = function( transaction ) {
    if ( !! transaction ) {
        this.block.add( transaction );
    }
    if ( -- this.block.size === 0 ) {
        try {
            var packet = this.block.commit();
//            console.log( "Session:onTransaction:", packet );
            this.client.send( JSON.stringify( packet ) );
            this.nextBlock();
        } catch ( exception ) {
           console.log( "Session closed", exception );
        }
    }
};

module.exports = Session;

