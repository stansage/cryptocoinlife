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


//    var pMaterial = new THREE.PointCloudMaterial( { color: 0xFF00FF, size: 10 } );
    var attributes = {
        size: { type: 'f', value: null }
//        color: { type: 'c', value: null }
    };
    var uniforms = {
        viewport: { type: "v4", value: new THREE.Vector4( 0, 0, this.width, this.height )  }
//        color:     { type: "c", value: new THREE.Color( 0xffffff ) },
//        texture:   { type: "t", value: THREE.ImageUtils.loadTexture( "textures/sprites/spark1.png" ) }
    };
    var shader = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        attributes: attributes,
        vertexShader: document.getElementById( "vertexShader" ).textContent,
        fragmentShader: document.getElementById( "fragmentShader" ).textContent,

        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
    } );
    var geometry = new THREE.BufferGeometry();
    var positions = new Float32Array( 9000 );
    var sizes = new Float32Array( positions.length / 3 );
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes ) );
    var particles = new THREE.PointCloud( geometry, shader );
    this.scene.add( particles );

    this.counter = 0;
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

    while ( model.particles.length !== 0 ) {
        var particle = model.particles.pop();

        console.log( particle );

        size.array[ this.counter / 3 ] = particle.size;

        position.array[ this.counter++ ] = particle.x;
        position.array[ this.counter++ ] = particle.y;
        position.array[ this.counter++ ] = particle.z;

        if ( this.counter >= 6000 ) {
            this.counter = 0;
        }
    }


    this.renderer.render( this.scene, this.camera );

    this.stats.end();

    window.requestAnimationFrame( this.animate.bind( this, model ) );
};


