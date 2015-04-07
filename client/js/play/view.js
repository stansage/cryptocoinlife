function View( width, height ) {
    this.animation = true;
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
};

View.prototype.animate = function() {
    if ( this.animation ) {
        this.stats.begin();
        this.renderer.render( this.scene, this.camera );
        this.stats.end();
        window.requestAnimationFrame( this.animate.bind( this ) );
    }
};

View.prototype.getDomElements = function() {
    return [ this.renderer.domElement, this.stats.domElement ];
};

View.prototype.getLayout = function() {
    return {
        width: this.width,
        heigth: this.height,
        deep: this.camera.position.z,
        bound: this.camera.far
    };
}

View.prototype.onUpdate = function( objects ) {
//    console.log( "View:onUpdate:", objects.length );
//    this.animation = false;

//    for ( var i = 0; i < objects.length; ++ i ) {
//        var object = objects[ i ];
//        var geometry = new THREE.SphereGeometry( object.radius, object.quality, object.quality );
//        var material = new THREE.MeshBasicMaterial( { color: object.color } );
//        var mesh = new THREE.Mesh( geometry, material );

//        if ( object.index !== -1 ) {
//            this.scene.children[ object.index ] = mesh;
//        } else {
//            this.scene.add( mesh );
//        }

//        if ( object.position ) {
//            assert( object.position.length === 3, "View:onUpdate - Invalid position " + object.position );

//            mesh.position.x = parseInt( object.position[ 0 ] );
//            mesh.position.y = parseInt( object.position[ 1 ] );
//            mesh.position.z = parseInt( object.position[ 2 ] );
//        }
//    }

//    this.animation = true;
    this.animate();
}

View.prototype.resize = function( width, height ) {
    this.width = width;
    this.height = height;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( this.width, this.height );
};
