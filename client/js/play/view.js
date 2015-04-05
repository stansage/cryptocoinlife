function View() {
    this.mouseX = 0;
    this.mouseY = 0;
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
    this.stats = new Stats();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.renderer = new THREE.WebGLRenderer();
    this.animate = function() {
        this.stats.begin();
        this.renderer.render( this.scene, this.camera );
        this.stats.end();
        window.requestAnimationFrame( this.animate.bind( this ) );
    }

    this.renderer.setSize( window.innerWidth, window.innerHeight );
    if ( 'setPixelRatio' in this.renderer ) {
        this.renderer.setPixelRatio( window.devicePixelRatio );
    }


    this.stats.domElement.style.position = "absolute";
    this.stats.domElement.style.bottom = "0px";
    this.stats.domElement.style.right = "0px";

    document.body.appendChild( this.renderer.domElement );
    document.body.appendChild( this.stats.domElement );

    this.camera.position.z = 500;
};

View.prototype.getLayout = function() {
    return {
        width: window.innerWidth,
        heigth: window.innerHeight,
        deep: this.camera.position.z
    };
}

View.prototype.onUpdate = function( objects ) {
    for ( var i = 0; i < objects.length; ++ i ) {
        var object = objects[ i ];
        var geometry = new THREE.SphereGeometry( object.radius, object.quality, object.quality );
        var material = new THREE.MeshBasicMaterial( { color: object.color } );
        var mesh = new THREE.Mesh( geometry, material );

        if ( object.index !== -1 ) {
            this.scene.children[ object.index ] = mesh;
        } else {
            this.scene.add( mesh );
        }

        if ( object.position ) {
            assert( object.position.length === 3, "View:onUpdate - Invalid position " + object.position );

            mesh.position.x = object.position[ 0 ];
            mesh.position.y = object.position[ 1 ];
            mesh.position.z = object.position[ 2 ];
        }
    }

}


View.prototype.onWindowResize = function() {
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );
};


View.prototype.onDocumentMouseMove = function( event ) {
    this.mouseX = event.clientX - this.windowHalfX;
    this.mouseY = event.clientY - this.windowHalfY;
}

View.prototype.onDocumentTouchStart = function( event ) {
    if ( event.touches.length > 1 ) {
        event.preventDefault();

        this.mouseX = event.touches[ 0 ].pageX - this.windowHalfX;
        this.mouseY = event.touches[ 0 ].pageY - this.windowHalfY;
    }
};

View.prototype.onDocumentTouchMove = function( event ) {
    if ( event.touches.length == 1 ) {
        event.preventDefault();

        this.mouseX = event.touches[ 0 ].pageX - this.windowHalfX;
        this.mouseY = event.touches[ 0 ].pageY - this.windowHalfY;
    }
};

View.prototype.triggerAnimation = function() {
    this.animate.call( this );
};
