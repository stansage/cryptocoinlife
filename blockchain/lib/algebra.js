var CRC = require( "crc" );

module.exports = {
    toSpherical: function( coordinates ) {
        var x2 = coordinates[ 0 ] * coordinates[ 0 ];
        var y2 = coordinates[ 1 ] * coordinates[ 1 ];
        var z2 = coordinates[ 2 ] * coordinates[ 2 ];
        var r = Math.sqrt( x2 + y2 + z2 );

        return [
            r,
            Math.acos( coordinates[ 2 ] / r ),
            Math.atan( coordinates[ 1 ] / coordinates[ 0 ] )
        ];
    },

    fromSpherical: function( coordinates ) {
//        console.log( "Algebra:fromSpheric: ", r, z , a,  r * Math.sin( z ) * Math.cos( a ), r * Math.sin( z ) * Math.sin( a ), r * Math.cos( z ) );
        return [
            coordinates[ 0 ] * Math.sin( coordinates[ 1 ] ) * Math.cos( coordinates[ 2 ] ),
            coordinates[ 0 ] * Math.sin( coordinates[ 1 ] ) * Math.sin( coordinates[ 2 ] ),
            coordinates[ 0 ] * Math.cos( coordinates[ 1 ] )
        ];
    },

    sphereRadius : function( volume ) {
        var x = Math.PI * 4.0 / 3.0;
        return Math.pow( volume / x , 1 / 3 );
    },

    makePosition: function( address, offset ) {
        var tail = address.length - 20;
        var angle = [ 0, 0 ];

        for ( var i = 0; i < 2; ++ i ) {
            var buffer = new Buffer( 16 );
            var crc = CRC.crc32( address.slice( ( i * 10 ) + tail, ( ( i + 1 ) * 10 ) + tail ) );

            buffer.fill( 0 );
            buffer[ 0 ] = 0x3f;
            buffer[ 1 ] = ( 0xe << 4 ) | ( address[ address.length / 2 - i ] >> 4 );
            buffer.writeUInt32BE( crc, 2 );

            angle[ i ] = 2.0 * buffer.readDoubleBE( 0 ) * Math.PI;
        }

        if ( CRC.crc8( address.slice( 0, tail ) ) < 127 ) {
            offset = -offset;
        }

        return module.exports.fromSpherical( [ offset ].concat( angle ) );
    }
};

