var Particle = {
    color : 0xffff00
//    bmp : [ 0x77cccccc, 0x77cccccc, 0x77cccccc, 0x77cccccc ],
//    width : 2,
//    height : 2
};

//var ParticleCount = 3000;
//var ParticleVelocity = 0.1

function Matter( count ) {
    var texture = THREE.ImageUtils.loadTexture( "particle.png" );

//     = THREE.ImageUtils.generateDataTexture( 1, 1, new THREE.Color( Particle.color ) )
    var attributes = {
        size : {
            type : 'f',
            value : null,
        },
        brush: {
            type: 'c',
            value: null
        }
//        color: { type: 'c', value: null }
    };
    var uniforms = {
//        viewport: { type: "v4", value: new THREE.Vector4( 0, 0, this.width, this.height )  }
        color : {
            type : "c",
            value : new THREE.Color( 0xffff00 )
        },
        texture : {
            type : "t",
            value : texture
        }
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
    var colors = new Float32Array( count * 3 );
    var sizes = new Float32Array( count );

    for ( var i = 0; i < positions.length; ++ i ) {
        positions[ i ] = 1.0;
    }

    var geometry = new THREE.BufferGeometry();

    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
    geometry.addAttribute( 'brush', new THREE.BufferAttribute( colors, 3 ) );

    this.particles = new THREE.PointCloud( geometry, shader );
};

Matter.prototype.getPosition = function( index ) {
    var result = [ 0, 0, 0 ];
    var position = this.particles.geometry.attributes.position;

    for ( var i = 0; i < result.length; ++ i ) {
        result[ i ] = position.array[ index ++ ];
    }

    return result;
};

Matter.prototype.update = function( index, value, location, color ) {
    color = new THREE.Color( color );

    var size = this.particles.geometry.attributes.size;
    size.needsUpdate = true;
    size.array[ index ] = value;

    var brush = this.particles.geometry.attributes.brush;
    brush.needsUpdate = true;
    brush.array[ index + 0 ] = color.r;
    brush.array[ index + 1 ] = color.g
    brush.array[ index + 2 ] = color.b;

    if ( ( !! location ) && !! ( location.length ) ) {
        var position = this.particles.geometry.attributes.position;
        position.needsUpdate = true;

        for ( var i = 0; i < location.length; ++ i ) {
            position.array[ index ++ ] = location[ i ];
        }
    }
};

