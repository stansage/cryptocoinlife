/*
 *  Copyright 2015 (c) Stan Sage <me@stansage.com>
 *  Licensed under the GPLv2 License.
 *  https://github.com/stansage/cryptocoinlife
 */

var Algebra = require( "./algebra" );

function Session( client ) {
    this.SOURCE_LIMIT = 21000000.0;
    this.SOURCE_BOUND = Algebra.sphereRadius( this.SOURCE_LIMIT );
    this.source = this.SOURCE_LIMIT;
    this.client = client;
    this.config = {};
    this.time = Date.now();
}

Session.prototype.active = function() {
    return ( !! this.client ) && ( Object.keys( this.config ).length !== 0 );
}

Session.prototype.whenReady = function() {
    var timeout = Math.max( 1, this.config.delay || 1000 );
    var elapsed = Date.now() - this.time;
    return elapsed < timeout ? timeout - elapsed : 0;
}

Session.prototype.onTransaction = function( transaction ) {
    if ( ! this.active() ) {
        return;
    }

//    if ( ! this.hasClient() ) {
//        throw "Session:add Session must be in active state";
//    }

//    if ( this.objects.length === 0 ) {
//        this.objects.push( this.makeObject( -1, this.root, 1.0 ) );
//    } else {
//        for ( var i = 0; i < transaction.vin.length; ++ i ) {
//            if ( 'coinbase' in transaction.vin[ i ] ) {
//                for ( var j = 0; j < transaction.vout.length; ++ j ) {
//                    var index = -1;
//                    var volume = transaction.vout[ j ].value;
//                    this.source -= volume;
//                    this.objects[ 0 ] = this.makeObject( 0, this.source, this.source / this.LIMIT );
//                    for ( var k = 1; k < this.objects.length; ++ k ) {
//                        var object = this.objects[ k ];
//                        object.index = k;
//                        var spheric = Algebra.toSpheric( object.position );
//                        if ( ++ spheric[ 0 ] > this.layout.bound ) {
//                            if ( index !== -1 ) {
//                                throw "Session:addTranscation: Invalid index " +  JSON.stringify( object );
//                            }
//                            index = k;
//                        }
//                        object.position = Algebra.fromSpheric( spheric );
//                    }

//                    console.log( "Session:addTransaction:", index, this.layout.bound, this.objects.length, this.objects[ 1 ] );

//                    var distance = 1.5 * this.objects[ 0 ].radius;
//                    var position = Algebra.fromSpheric( [ distance, Math.random() * Math.PI, 2.0 * Math.random() * Math.PI ] );
//                    this.objects.push( this.makeObject( index, volume, volume / this.LIMIT, position ) );
//                }
//                if ( transaction.vin.length > 1 ) {
//                    throw "Session:addTransaction: Invalid transaction" + JSON.stringify( transaction );
//                }
//            }
//        }
//    }

    var particles = [];
    for ( var i = 0; i < transaction.vin.length; ++ i ) {
        if ( 'coinbase' in transaction.vin[ i ] ) {
            for ( var j = 0; j < transaction.vout.length; ++ j ) {
                var volume = transaction.vout[ j ].value;
//                for ( var addresses = transaction.vout[ j ].address;
                particles.push( { position: [ 0, 0, 0 ], velocity: [ 0, 1, 0 ] } );
                this.source -= volume;
            }
            if ( transaction.vin.length > 1 ) {
                throw "Session:add: Invalid transaction" + JSON.stringify( transaction );
            }
        }
    }


    //console.log( this.items );
//    var packet = { source: this.source };
    var packet = {
        radius: Algebra.sphereRadius( this.source ),
        scale: this.source / this.SOURCE_LIMIT,
        particles: particles
    };
    this.client.send( JSON.stringify( packet ) );
}

module.exports = Session;

