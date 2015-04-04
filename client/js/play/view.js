function View( level ) {

    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;

    this.threshold = level;

    this.mouseX = 0;
    this.mouseY = 0;

    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;



//    var tty = document.createElement( 'input' );
//    tty.setAttribute( 'type', 'text' );
//    tty.onkeypress = function ( event ) {
//        if ( event.key === 'Enter' ) {

//            blockchain.send( JSON.stringify( { method : tty.value, id : 1 } ) );

//        }
//    }
//    container.appendChild( tty );

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 80, this.screenWidth / this.screenHeight, 1, 10000 );
    this.renderer = new THREE.WebGLRenderer( { antialias: true } );

    //this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( this.screenWidth, this.screenHeight );

    document.getElementById( "viewport" ).appendChild( this.renderer.domElement );

//    window.addEventListener( 'beforeunload', destroy, false );

};

View.prototype.splash = function() {

    document.addEventListener( "mousemove", this.onDocumentMouseMove, false );
    document.addEventListener( "touchstart", this.onDocumentTouchStart, false );
    document.addEventListener( "touchmove", this.onDocumentTouchMove, false );
    window.addEventListener( "resize", this.onWindowResize, false );
//    window.addEventListener( 'onclick', stop, false );

}

View.prototype.update = function( data ) {

    console.log( "data = " + data );

}


// function parseBlock( block ) {

//     console.assert( block.n_tx === block.tx.length );

//     for ( var i = 0; i < block.n_tx; i ++) {

//         console.log( block.tx[ i ].tx_index );
//         var request = 'https://blockchain.info/tx-index/' + block.tx[ i ].tx_index + '?format=json&cors=true';

//         $.getJSON( request, parseTransaction );

//     }

// }

// function parseTransaction( transaction ) {

//     console.dir( transaction );
// }


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


View.prototype.animate = function() {

    this.requestAnimationFrame( this.animate );
    this.render();

};
    //     var geometry = new THREE.SphereGeometry();
        //     var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        //     var sphere = new THREE.Mesh( geometry, material );
        //     scene.add( sphere );

View.prototype.render = function() {

    var position = this.camera.position;

    position.x += ( - this.mouseX + 200 - position.x ) * .05;
    position.y += ( - this.mouseY + 200 - position.y ) * .05;

    this.camera.lookAt( position );

    this.renderer.render( this.scene, this.camera );

};

