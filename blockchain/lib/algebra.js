module.exports = {
    toSpheric: function( coordinates ) {
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

    fromSpheric: function( coordinates ) {
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
    }
};

