/*
 *  Copyright 2015 (c) Stan Sage <me@stansage.com>
 *  Licensed under the GPLv2 License.
 *  https://github.com/stansage/cryptocoinlife
 */

var Algebra = require( "./algebra" );

function Session( client ) {
    this.LIMIT = 21000000.0;
    this.client = client;
    this.config = undefined;
    this.source = this.LIMIT;
    this.makeObject = function( index, volume, scale, position ) {
        var result = { index: index };

        if ( volume !== undefined ) {
            var x = Math.PI * 4.0 / 3.0;
            result.radius = parseInt( Math.pow( volume / x , 1 / 3 ) );
            result.quality = Math.log( result.radius );
        }
        if ( scale !== undefined ) {
            result.color = 0xff0000 + ( parseInt( scale * 0xff ) << 8 );
        }
        if ( position !== undefined ) {
            result.position = position;
        }

        return result;
    }
}

Session.prototype.isActive = function() {
    return !! this.config;
};

Session.prototype.hasClient = function( client ) {
    return ( !! this.client ) && ( ! client || this.client === client );
};

Session.prototype.close = function( client ) {
    stop();
    this.client = undefined;
};

Session.prototype.start = function( config ) {
    this.config = config;
}

Session.prototype.stop = function( stats ) {
    this.config = undefined;
}

Session.prototype.add = function( transaction ) {
    if ( ! this.isActive() ) {
        return;
    }
    if ( ! this.hasClient() ) {
        throw "Session:add Session must be in active state";
    }

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

    for ( var i = 0; i < transaction.vin.length; ++ i ) {
        if ( 'coinbase' in transaction.vin[ i ] ) {
            for ( var j = 0; j < transaction.vout.length; ++ j ) {
                var volume = transaction.vout[ j ].value;
                this.source -= volume;
            }
            if ( transaction.vin.length > 1 ) {
                throw "Session:add: Invalid transaction" + JSON.stringify( transaction );
            }
        }
    }


    //console.log( this.items );
    var packet = { source: this.source };
    this.client.send( JSON.stringify( packet ) );
}

module.exports = Session;

