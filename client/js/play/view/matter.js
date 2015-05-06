var Particle = {
    color : 0xffff00,
    bmp : [ 0x77cccccc, 0x77cccccc, 0x77cccccc, 0x77cccccc ],
    width : 2,
    height : 2
};

//var ParticleCount = 3000;
//var ParticleVelocity = 0.1

function Matter( count ) {
    var attributes = {
        size : {
            type : 'f',
            value : null
        }
//        color: { type: 'c', value: null }
    };
    var uniforms = {
//        viewport: { type: "v4", value: new THREE.Vector4( 0, 0, this.width, this.height )  }
        color : {
            type : "c",
            value : new THREE.Color( Particle.color )
        }
//        texture : {
//            type : "t",
//            value : new THREE.DataTexture( Coin.bmp, Coin.width, Coin.height )
//        }
    };
    var shader = new THREE.ShaderMaterial( {
        uniforms : uniforms,
        attributes : attributes,
        vertexShader : document.getElementById( "vertexShader" ).textContent,
        fragmentShader : document.getElementById( "fragmentShader" ).textContent,

        blending : THREE.AdditiveBlending,
        depthTest : false,
        transparent : true
    } );

    var positions = new Float32Array( count * 3 );
    var sizes = new Float32Array( count );
    var geometry = new THREE.BufferGeometry();
    for ( var i = 0; i < positions.length; ++ i ) {
        positions[ i ] = 1.0;
    }

    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );

    this.particles = new THREE.PointCloud( geometry, shader );
}

Matter.prototype.update = function( index, value, location ) {
    var size = this.particles.geometry.attributes.size;
    size.needsUpdate = true;

    if ( ( ! location ) ) {
        size.array[ index ] = Math.pow( Math.pow( size.array[ index ], 3 ) - Math.pow( value, 3 ), 1 / 3 );
    } else {
        size.array[ index ] = value;

        var position = this.particles.geometry.attributes.position;
        position.needsUpdate = true;

        for ( var i = 0; i < location.length; ++ i ) {
            position.array[ index ++ ] = location[ i ];
        }
    }
}
