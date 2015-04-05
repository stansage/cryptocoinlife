/*
 *  Copyright 2015 (c) Stan Sage <me@stansage.com>
 *  Licensed under the GPLv2 License.
 *  https://github.com/stansage/cryptocoinlife
 */

function Session( client ) {
    this.LIMIT = 21000000.0;
    this.client = client;
    this.objects = [];
    this.layout = {};
    this.root = this.LIMIT;
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

Session.prototype.hasClient = function( client ) {
    return this.isActive() && this.client === client;
};

Session.prototype.isActive = function() {
    return !! this.client;
};

Session.prototype.setActive = function( active ) {
    if ( this.client && ! active ) {
        this.client = undefined;
        this.objects = [];
    }
};

Session.prototype.setLayout = function( layout ) {
    this.layout = layout;
}

Session.prototype.addTransaction = function( transaction ) {
    if ( ! this.isActive() ) {
        throw "Session must be in active state";
    }

    if ( this.objects.length === 0 ) {
        this.objects.push( this.makeObject( -1, this.root, 1.0 ) );
    } else {
        for ( var i = 0; i < transaction.vin.length; ++ i ) {
            if ( 'coinbase' in transaction.vin[ i ] ) {
                for ( var j = 0; j < transaction.vout.length; ++ j ) {
                    var volume = transaction.vout[ j ].value;
                    this.root -= volume;
                    this.objects[ 0 ] = this.makeObject( 0, this.root, this.root / this.LIMIT );
                    for ( var k = 1; k < this.objects.length; ++ k ) {
                        var object = this.objects[ k ];
                        object.index = k;
                        for ( var l = 0; l < 3; ++ l ) {
                            if ( object.position[ l ] < 0 ) {
                                -- object.position[ l ];
                            } else {
                                ++ object.position[ l ];
                            }
                        }

                    }

                    var position = [];
                    var distance = 1.5 * this.objects[ 0 ].radius;
                    for ( k = 0; k < 3; ++ k ) {
                        var value = parseInt( Math.random() * distance );
                        position[ k ] = Math.round( Math.random() ) > 0 ? value : -value;
                    }
                    this.objects.push( this.makeObject( -1, volume, volume / this.LIMIT, position ) );

                }
                if ( transaction.vin.length > 1 ) {
                    console.warn( "Invalid transaction", transaction );
                }
            }
        }
    }

    //console.log( this.items );
    this.client.send( JSON.stringify( this.objects ) );
}

module.exports = Session;

