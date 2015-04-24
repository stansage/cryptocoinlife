var ParticleCount = 3000;
var ParticleVelocity = 0.1
var Coin = {
    color : 0xffff00,
    bmp : [ 0x77cccccc, 0x77cccccc, 0x77cccccc, 0x77cccccc ],
    width : 2,
    height : 2
};

function View( width, height ) {
    this.width = width;
    this.height = height;
    this.stats = new Stats();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 80, width / height, 1, 1000 );
    this.renderer = new THREE.WebGLRenderer();
    this.rgb = function( color ) {
        return ( color.r << 16 ) | ( color.g << 8 ) | color.b;
    }

    this.renderer.setSize( width, height );
    if ( 'setPixelRatio' in this.renderer ) {
        this.renderer.setPixelRatio( window.devicePixelRatio );
    }

    this.stats.domElement.style.position = "absolute";
    this.stats.domElement.style.bottom = "0px";
    this.stats.domElement.style.right = "0px";

    this.camera.position.z = 500;

    var sphere = new THREE.SphereGeometry( 0, 0, 0 );
    var mesh = new THREE.MeshBasicMaterial( { color: 0 } );
    var source = new THREE.Mesh( sphere, mesh );
    this.scene.add( source );


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
            value : new THREE.Color( Coin.color )
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

//    var pMaterial = new THREE.PointCloudMaterial( { color: 0xFF00FF, size: 10 } );
    var geometry = new THREE.BufferGeometry();
    var positions = new Float32Array( ParticleCount * 3 );
    var sizes = new Float32Array( ParticleCount );

    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );

    var particles = new THREE.PointCloud( geometry, shader );
    this.scene.add( particles );

    this.counter = 0;
    this.velocities = new Array( ParticleCount );
    this.move = function( first, last, positions, velocities ) {
        for ( var i = first; i < last; ) {
            var velocity = velocities[ i / 3 ];
            if ( ! velocity ) {
                break;
            }
            for ( var j = 0; j < 3; ++ j, ++ i ) {
                positions[ i ] += velocity[ j ];
            }
        }
    }
};

View.prototype.getDomElements = function() {
    return [ this.renderer.domElement, this.stats.domElement ];
};

View.prototype.resize = function( width, height ) {
    this.width = width;
    this.height = height;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();


    this.renderer.setSize( this.width, this.height );
};

View.prototype.look = function( degrees ) {
    var z = this.camera.position.z - degrees / 15;
    if ( ( z > 200 ) && ( z < 1000 ) ) {
        this.camera.position.z = z;
    }
}

View.prototype.animate = function( model ) {
    this.stats.begin();

    var source = this.scene.children[ 0 ];
    var particles= this.scene.children[ 1 ];

    if ( Math.abs( model.source.radius - source.geometry.boundingSphere.radius ) > 1 ) {
        source.geometry = new THREE.SphereGeometry( model.source.radius, model.source.quality, model.source.quality );
    }

    if ( Math.abs( model.source.color - source.material.color.getHex() ) > 1 ) {
        source.material.color = new THREE.Color( model.source.color );
    }

    var size = particles.geometry.attributes.size;
    var position = particles.geometry.attributes.position;

    position.needsUpdate = model.particles.length !== 0;
    size.needsUpdate = model.particles.length !== 0;

    this.move( 0, this.counter, position.array, this.velocities );

    while ( model.particles.length !== 0 ) {
        var particle = model.particles.pop();
        var current = this.counter / 3;
//        console.log( particle );

        this.velocities[ current ] = particle.velocity;
        size.array[ current ] = particle.size;

        for ( var i = 0; i < particle.position.length; ++ i ) {
            position.array[ this.counter ++ ] = particle.position[ i ];
        }

        if ( this.counter >= position.array.length ) {
            this.counter = 0;
        }
    }

    this.move( this.counter, position.length, position.array, this.velocities );

//    this.camera.lookAt( this.scene.position );
    this.renderer.render( this.scene, this.camera );

    this.stats.end();

    window.requestAnimationFrame( this.animate.bind( this, model ) );
};


