function View( level ) {
    this.last = undefined;
    this.threshold = level;
    this.mouseX = 0;
    this.mouseY = 0;
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 1, 10000 );
    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.animate = function() {
        if ( ! this.last ) {
            return;
        }

        window.requestAnimationFrame( this.animate.bind( this ) );

        var position = this.camera.position;
        position.x += ( - this.mouseX + 200 - position.x ) * .05;
        position.y += ( - this.mouseY + 200 - position.y ) * .05;

        this.camera.lookAt( position );
        this.renderer.render( this.scene, this.camera );


        var current = Date.now();
        console.log( "FPS:", 1000.0 / ( current - this.last ) );
        this.last = current;
    }

    this.renderer.setSize( window.innerWidth, window.innerHeight );
    if ( 'setPixelRatio' in this.renderer ) {
        this.renderer.setPixelRatio( window.devicePixelRatio );
    }

    document.body.appendChild( this.renderer.domElement );
};

View.prototype.onUpdate = function( objects ) {
    for ( var i = 0; i < objects.length; ++ i ) {
        var mesh = {};

        if ( i < this.scene.children.length ) {
            mesh = this.scene.children[ i ];

            assert( mesh instanceof THREE.Mesh, "Invalid mesh " + mesh );

            mesh.geometry.boundingSphere.radius = objects[ i ].radius;
            mesh.material.color = objects[ i ].color;
        } else {
            var geometry = new THREE.SphereGeometry( objects[ i ].radius );
            var material = new THREE.MeshBasicMaterial( { color: objects[ i ].color } );
            mesh = new THREE.Mesh( geometry, material );

            mesh.position.x = objects[ i ].position.x;
            mesh.position.y = objects[ i ].position.y;
            mesh.position.z = objects[ i ].position.z;

            this.scene.add( mesh );
        }

        assert( !! mesh );
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
    if ( this.last ) {
        this.last = undefined;
    } else {
        this.last = Date.now();
        this.animate.call( this );
    }
};
