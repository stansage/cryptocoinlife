/*
 *  Copyright 2015 (c) Stan Sage <me@stansage.com>
 *  Licensed under the GPLv2 License.
 *  https://github.com/stansage/cryptocoinlife
 */

var Algebra = require( "./algebra" );
var ParticleVelocity = 0.5;
var SourceLimit = 21000000.0;
var DayTime = 24 * 60 * 60;
var DoubleDayTime = 2 * DayTime;
var DoublePi = 2 * Math.PI;
var SourceBound = Algebra.sphereRadius( SourceLimit );
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
    this.source = SourceLimit;
    this.client = client;
    this.config = {};
    this.time = Date.now();
    this.packet = {
        next: null,
        radius: 0,
        scale: 0,
        particles: []
    };
}

Session.prototype.active = function() {
    return ( !! this.client )
        && ( this.rpc )
        && ( Object.keys( this.config ).length !== 0 )
        && ( 'block' in this.config );
};

//Session.prototype.whenReady = function() {
//    var timeout = Math.max( 1, this.config.delay || 1000 );
//    var elapsed = Date.now() - this.time;
//    return elapsed < timeout ? timeout - elapsed : 0;
//};

Session.prototype.nextBlock = function() {
    if ( ! this.active()  ) {
        return;
    }
    if ( this.config.block === 0 ) {
        this.onTransaction( { next : 1 }, GenesisTransaction );
    } else {
        this.rpc.getBlock( this.config.block, this.onBlock.bind( this ) );
    }
//    var duration = session.whenReady();

//    console.log( "Api:nextBlock:duration:", duration );
//    if ( duration !== 0 ) {
//        setTimeout( this.nextBlock.bind( this ), duration );
//    } else {
//        this.time = Date.now();
//    }
};

//Session.prototype.onResponse = function( type, response ) {
//    if ( ! this.active()  ) {
//        return;
//    }

//    switch ( type ) {
//    case ResponseType.TRANSACTION:
//        this.onTransaction( response );
//        break;
//    case ResponseType.BLOCK:
//        this.onBlock( response );
////        if ( response.nextblockhash ) {
////            this.nextBlock( session, response.nextblockhash );
////        } else {
////            console.warn( "Api:onRespose: All blocks exhausted", response );
////        }

//        break;
//    default:
//        throw "Api:onRespose: Invalid response type " + type;
//    }
//};

Session.prototype.onBlock = function( block ) {
    if ( ! this.active() ) {
        return;
    }

    if ( !! block ) {
        for ( var i = 0; i < block.tx.length; ++ i ) {
            var commit = ( i == block.tx.length - 1 ) ? { next : block.nextblockhash } : null;
            this.rpc.getTransaction( block.tx[ i ], this.onTransaction.bind( this, commit ) );
        }
    }
};

Session.prototype.onTransaction = function( commit, transaction ) {
    if ( ! this.active() ) {
        return;
    }
    if ( ! transaction ) {
        console.warn( "Session:onTransaction:", commit, time );
        return;
    }

    for ( var i = 0; i < transaction.vin.length; ++ i ) {
        if ( 'coinbase' in transaction.vin[ i ] ) {
            if ( transaction.vin.length > 1 ) {
                throw "Session:add: Invalid transaction" + JSON.stringify( transaction );
            }

            for ( var j = 0; j < transaction.vout.length; ++ j ) {
                var vout = transaction.vout[ j ];
//                var addresses = vout.scriptPubKey.addresses;

                this.source -= vout.value;

                var angle = DoublePi * ( transaction.time % DayTime ) / DayTime;
                var radius = transaction.time % DoubleDayTime > DayTime ? SourceBound : -SourceBound;
                var coordinates = [ radius ].concat( [ angle, DoublePi - angle ] );

//                var angle = 2.0 * Math.PI * daytime / DayTime;
//                var position = Algebra.fromSpherical( [ radius ].concat( [ angle, angle ] ) );
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

                console.log( "Session:onTransaction:", angle, coordinates, position, velocity );

                this.packet.particles.push( {
                    position : position,
                    velocity: velocity,
                    size : Algebra.cubeSize( vout.value )
                } );
            }
        }
    }

    if ( !! commit ) {
        this.packet.next = commit.next;
        this.packet.radius = Algebra.sphereRadius( this.source );
        this.packet.scale = this.source / SourceLimit;
        this.client.send( JSON.stringify( this.packet ) );
        this.packet.particles = [];
    }
}

module.exports = Session;

