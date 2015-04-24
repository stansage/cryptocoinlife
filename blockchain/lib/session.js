/*
 *  Copyright 2015 (c) Stan Sage <me@stansage.com>
 *  Licensed under the GPLv2 License.
 *  https://github.com/stansage/cryptocoinlife
 */

var Algebra = require( "./algebra" );
var Speed = 10;
var ParticleVelocity = 0.5;
var BitcoinTotal = 21000000.0;
var Source = {
    limit : BitcoinTotal,
    bound : Algebra.sphereRadius( BitcoinTotal )
};
var Day = {
    half : 12 * 60 * 60,
    full : 24 * 60 * 60
};
var GenesisTransaction = {
    txid : "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
    version : 1,
    locktime : 0,
    vin: [
        {
            coinbase : "04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73",
            sequence : 4294967295
        }
    ],
    vout: [
        {
            value : 50.00000000,
            n : 0,
            scriptPubKey : {
                asm : "04678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5f OP_CHECKSIG",
                hex : "4104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac",
                reqSigs : 1,
                type : "pubkey",
                addresses : [
                    "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                ]
            }
        }
    ],
    blockhash : "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
    confirmations : 352959,
    time : 1231006505,
    blocktime : 1231006505
};


function Session( client, rpc ) {
    this.rpc = rpc;
    this.source = Source.limit;
    this.client = client;
    this.block = 0;
    this.packet = {
        time : GenesisTransaction.blocktime,
        radius : 0,
        scale : 0,
        particles : []
    };
}

Session.prototype.nextBlock = function() {
    if ( this.block === 0 ) {
        this.block = 1;
        this.onTransaction.call( this, GenesisTransaction.blocktime, GenesisTransaction );
    } else {
        this.rpc.getBlock( this.block, this.onBlock.bind( this ) );
    }
};

Session.prototype.commit = function() {
    this.packet.radius = Algebra.sphereRadius( this.source );
    this.packet.scale = this.source / Source.limit;

    this.client.send( JSON.stringify( this.packet ) );
    this.packet.particles = [];
    this.nextBlock();
};



Session.prototype.onBlock = function( block ) {
    if ( ! block ) {
        return;
    }

    for ( var i = 0; i < block.tx.length; ++ i ) {
        var last = i === block.tx.length - 1 ? block.time : 0;
        this.rpc.getTransaction( block.tx[ i ], this.onTransaction.bind( this, last ) );
    }

    this.block = block.nextblockhash;
};

Session.prototype.onTransaction = function( last, transaction ) {
    if ( !! transaction ) {
        for ( var i = 0; i < transaction.vin.length; ++ i ) {
            if ( 'coinbase' in transaction.vin[ i ] ) {
                if ( transaction.vin.length > 1 ) {
                    throw "Session:add: Invalid transaction" + JSON.stringify( transaction );
                }

                for ( var j = 0; j < transaction.vout.length; ++ j ) {
                    var vout = transaction.vout[ j ];
                    var radius = transaction.time % Day.full > Day.half ? Source.bound : -Source.bound;
                    var angle = 2.0 * Math.PI * ( transaction.time % Day.half ) / Day.half;
                    var coordinates = [ radius ].concat( [ angle, angle ] );

                    var position = Algebra.fromSpherical( coordinates );
                    if ( radius > 0 ) {
                        coordinates[ 0 ] += ParticleVelocity;
                    } else {
                        coordinates[ 0 ] -= ParticleVelocity;
                    }
                    var velocity = Algebra.fromSpherical( coordinates );

                    velocity[ 0 ] -= position[ 0 ];
                    velocity[ 1 ] -= position[ 1 ];
                    velocity[ 2 ] -= position[ 2 ];


                    this.source -= vout.value;
                    this.packet.particles.push( {
                        position : position,
                        velocity : velocity,
                        size : Algebra.cubeSize( vout.value )
                    } );
                }
            }
        }
    }

    if ( last ) {
        var duration = Math.min( last - this.packet.time, 1000 );
        console.log( "Session:onTransaction:", last, this.packet.time, parseInt( duration ) );
        if ( duration > 0 )  {
            this.packet.time = last;
            setTimeout( this.commit.bind( this ), duration );
        } else {
            this.commit();
        }
    }
};

module.exports = Session;

