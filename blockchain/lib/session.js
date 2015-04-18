/*
 *  Copyright 2015 (c) Stan Sage <me@stansage.com>
 *  Licensed under the GPLv2 License.
 *  https://github.com/stansage/cryptocoinlife
 */

var Algebra = require( "./algebra" );
var ResponseType = {
  BLOCK: {},
  TRANSACTION: {}
};
var FirstBlockTime = 1231006505;

function Session( client, rpc ) {
    this.rpc = rpc;
    this.SOURCE_LIMIT = 21000000.0;
    this.SOURCE_BOUND = Algebra.sphereRadius( this.SOURCE_LIMIT );
    this.source = this.SOURCE_LIMIT;
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
    return ( !! this.client ) && ( this.rpc ) && ( Object.keys( this.config ).length !== 0 );
};

Session.prototype.whenReady = function() {
    var timeout = Math.max( 1, this.config.delay || 1000 );
    var elapsed = Date.now() - this.time;
    return elapsed < timeout ? timeout - elapsed : 0;
};

Session.prototype.nextBlock = function() {
    if ( ! this.active()  ) {
        return;
    }

    this.rpc.getBlock( this.config.block, this.onBlock.bind( this ) );
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
            var commit = ( i == block.tx.length - 1 ) ? { next: block.nextblockhash } : null;
            this.rpc.getTransaction( block.tx[ i ], this.onTransaction.bind( this, commit, block.time ) );
        }
    }
};

Session.prototype.onTransaction = function( commit, time, transaction ) {
    if ( ! this.active() ) {
        return;
    }
    //console.log( "Session:onTransaction:", commit, time, transaction );

    if ( !! transaction ) {
        for ( var i = 0; i < transaction.vin.length; ++ i ) {
            if ( 'coinbase' in transaction.vin[ i ] ) {
                if ( transaction.vin.length > 1 ) {
                    throw "Session:add: Invalid transaction" + JSON.stringify( transaction );
                }

                for ( var j = 0; j < transaction.vout.length; ++ j ) {
                    var vout = transaction.vout[ j ];
    //                var addresses = vout.scriptPubKey.addresses;

                    this.source -= vout.value;

                    var radius = this.SOURCE_BOUND + 1;
                    var angle = [ FirstBlockTime / time, FirstBlockTime / time ];


                    if ( time % 2 === 0 ) {
                        radius = -radius;
                    }

                    var position = Algebra.fromSpherical( [ radius ].concat( angle ) );;

                    this.packet.particles.push( {
                        x: position[ 0 ],
                        y: position[ 1 ],
                        z: position[ 2 ],
                        size: Algebra.sphereRadius( vout.value )
                    } );
                }
            }
        }
    }

    if ( !! commit ) {
        this.packet.next = commit.next;
        this.packet.radius = Algebra.sphereRadius( this.source );
        this.packet.scale = this.source / this.SOURCE_LIMIT;
        this.client.send( JSON.stringify( this.packet ) );
        this.packet.particles = [];
    }
}

module.exports = Session;

