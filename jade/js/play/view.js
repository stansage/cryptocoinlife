/*
 *  Copyright 2015 (c) Stan Sage <me@stansage.com>
 *  Licensed under the GPLv2 License.
 *  https://github.com/stansage/cryptocoinlife
 */
 
(function(exports) {

    var SCREEN_WIDTH = window.innerWidth,
        SCREEN_HEIGHT = window.innerHeight,
            
        threshold = 1000,
    
        mouseX = 0, mouseY = 0,
    
        windowHalfX = window.innerWidth / 2,
        windowHalfY = window.innerHeight / 2,
    
        camera, scene, renderer;

    function init() {
    
        var container = document.createElement( 'div' );
        document.body.appendChild( container );
        
        var tty = document.createElement( 'input' );
        tty.setAttribute( 'type', 'text' );
        tty.onkeypress = function ( event ) {
            if ( event.key === 'Enter' ) 
                blockchain.send( JSON.stringify( { method : tty.value, id : 1 } ) );
        }
        container.appendChild( tty );
        
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( 80, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
    
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    
        container.appendChild( renderer.domElement );
        
        document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        document.addEventListener( 'touchstart', onDocumentTouchStart, false );
        document.addEventListener( 'touchmove', onDocumentTouchMove, false );
    
        window.addEventListener( 'resize', onWindowResize, false );
        window.addEventListener( 'onclick', stop, false );
        window.addEventListener( 'beforeunload', destroy, false );
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
    
    
    function stop() {
    
        console.log('deactivating feed');
        
        api._();
    
    }
    
    function destroy() {
    
        stop();

    }
    
    function onWindowResize() {
    
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
    
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    
        renderer.setSize( window.innerWidth, window.innerHeight );
    
    }
    
    
    
    function onDocumentMouseMove( event ) {
    
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    
    }
    
    function onDocumentTouchStart( event ) {
    
    	if ( event.touches.length > 1 ) {
    
    		event.preventDefault();
    
    		mouseX = event.touches[ 0 ].pageX - windowHalfX;
    		mouseY = event.touches[ 0 ].pageY - windowHalfY;
    
    	}
    
    }
    
    function onDocumentTouchMove( event ) {
    
    	if ( event.touches.length == 1 ) {
    
    		event.preventDefault();
    
    		mouseX = event.touches[ 0 ].pageX - windowHalfX;
    		mouseY = event.touches[ 0 ].pageY - windowHalfY;
    
    	}
    
    }
    
    
    function animate() {
    
        requestAnimationFrame( animate );
    
        render();
    
    }
    //     var geometry = new THREE.SphereGeometry();
        //     var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        //     var sphere = new THREE.Mesh( geometry, material );
        //     scene.add( sphere );
    
    function render() {
    
        var position = camera.position;
        
        position.x += ( - mouseX + 200 - position.x ) * .05;
        position.y += ( - mouseY + 200 - position.y ) * .05;
        
        camera.lookAt( position );
    
        renderer.render( scene, camera );
    
    }

    var view = {

        show: function() {
            
            init();
            animate();
            
        }

    };
    
    if (typeof define === 'function' && define.amd) {
    
        /* AMD support */
        define( function() {
    
            return view;
    
        } );
    
    } else {
    
        exports.view = view;
    
    }


})(this);