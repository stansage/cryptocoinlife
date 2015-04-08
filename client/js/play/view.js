function View( width, height ) {
    this.width = width;
    this.height = height;
    this.stats = new Stats();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 80, width / height, 1, 1000 );
    this.renderer = new THREE.WebGLRenderer();

    this.renderer.setSize( width, height );
    if ( 'setPixelRatio' in this.renderer ) {
        this.renderer.setPixelRatio( window.devicePixelRatio );
    }


    this.stats.domElement.style.position = "absolute";
    this.stats.domElement.style.bottom = "0px";
    this.stats.domElement.style.right = "0px";

    this.camera.position.z = 500;

    var sphere = new THREE.SphereGeometry( model.source.radius, model.source.quality, model.source.quality );
    var materical = new THREE.MeshBasicMaterial( { color: model.source.color } );
    var source = new THREE.Mesh( sphere, mesh );
    this.scene.add( source );

    var material = new THREE.ParticleBasicMaterial( { color: 0xFFFFFF, size: 1 } );
    var particles = new THREE.ParticleSystem( new THREE.Geometry(), material );
    this.scene.add( particles );
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

    var 
    if ( Math.abs( model.source.radius - source.geometry.boundingSphere.radius ) > 1 ) {
        source.geometry = new THREE.SphereGeometry( model.source.radius, model.source.quality, model.source.quality );
    }

    while ( model.particles.length !== 0 ) {
        var particle = model.particles.pop();
        var vertex = new THREE.Vertex( new THREE.Vector3( particle.position[ 0 ], particle.position[ 1 ], particle.position[ 2 ] ) );
        particle.velocity = new THREE.Vector3( particle.velocity[ 0 ], particle.velocity[ 1 ], particle.velocity[ 2 ] );
        particles.geometry.vertices.push( vertex );
    }


    this.renderer.render( this.scene, this.camera );
    this.stats.end();

    window.requestAnimationFrame( this.animate.bind( this, model ) );
};


