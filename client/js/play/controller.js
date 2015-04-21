function Controller( model, view ) {
    this.model = model;
    this.view = view;
    this.mouseX = 0;
    this.mouseY = 0;
    this.halfX = window.innerWidth / 2;
    this.halfY = window.innerHeight / 2;
}

Controller.prototype.attach = function( dom ) {
    this.view.getDomElements().forEach( dom.appendChild, dom );

    document.addEventListener( "mousemove", this.onMouseMove.bind( this ), false );
    document.addEventListener( "touchstart", this.onTouchStart.bind( this ), false );
    document.addEventListener( "touchmove", this.onTouchMove.bind( this ), false );

//    window.addEventListener( "click", view.triggerAnimation.bind( view ) );
    window.addEventListener( "resize", this.onResize.bind( this ), false );
    window.addEventListener( "beforeunload", this.model.unload.bind( this.model ), false );

    // FF doesn't recognize mousewheel as of FF3.x
    var mousewheelevt = ( /Firefox/i.test(navigator.userAgent) )? "DOMMouseScroll" : "mousewheel"
    if ( document.attachEvent ) {
        // if IE (and Opera depending on user setting)
        document.attachEvent( "on" + mousewheelevt, this.onMouseWheel.bind( this ) );
    } else {
        // WC3 browsers
        document.addEventListener( mousewheelevt, this.onMouseWheel.bind( this ), false );
    }
};

Controller.prototype.onResize = function() {
    this.halfX = window.innerWidth / 2;
    this.halfY = window.innerHeight / 2;

    this.view.resize( window.innerWidth, window.innerHeight );
};

Controller.prototype.onMouseWheel = function( event ) {
    // equalize event object
    event = window.event || event;
    // check for detail first so Opera uses that instead of wheelDelta
    var delta = event.detail ? event.detail * ( -120 ) : event.wheelDelta;
    // delta returns +120 when wheel is scrolled up, -120 when down
    console.log( "Contreoller:onMouseWheel:", delta );
    this.view.look( delta );
};

Controller.prototype.onMouseMove = function( event ) {
//    console.log( "Conreoller:onMouseMove:", this.halfX );
    this.mouseX = event.clientX - this.halfX;
    this.mouseY = event.clientY - this.halfY;
};

Controller.prototype.onTouchStart = function( event ) {
    if ( event.touches.length > 1 ) {
        event.preventDefault();

        this.mouseX = event.touches[ 0 ].pageX - this.halfX;
        this.mouseY = event.touches[ 0 ].pageY - this.halfY;
    }
};

Controller.prototype.onTouchMove = function( event ) {
    if ( event.touches.length == 1 ) {
        event.preventDefault();

        this.mouseX = event.touches[ 0 ].pageX - this.halfX;
        this.mouseY = event.touches[ 0 ].pageY - this.halfY;

//        this.view.scene.position.x += this.mouseX / 100;
//        this.view.scene.position.y += this.mouseY / 100;
    }
};

//( function( exports ) {

//    defineExport( exports, 'Controller', function() {

//        this.prototype.attach = function () {


//        };

//    } );

//} )( this );

//    defineExport( exports, 'Controller', function() {

//        var model = new Model( location.origin.replace( /^http/, 'ws' ) );
//        var view = new View( 1000 );

//        this.prototype.attach = function () {

//            view.splash();
//            model.subscribe( view.update );

//        };

//    } );


// function subscribe( event ) {

//         console.log('activating feed');

//         getBlockHash( 0 );

//     }
//     function populate( event ) {

//         var response = JSON.parse( event.data );

//         if ( response.error )
//             return console.dir( response );

//         if ( ! response.result )
//             return socket.close();

//         // var request = 'https://blockchain.info/block-index/' + block.x.blockIndex + '?format=json&cors=true';

//         console.dir( response.result );

//     }

// for ( var i = 0, count = api.getInfo().
//     api.getBlockHash()
// var composer = function() {

//     var _ws = new WebSocket('ws://46.241.23.52:4225'),
//         _subscribe = function( event ) {

//             console.log('activating feed');

//             getBlockHash( 0 );

//         },
//         _populate = function( event ) {

//             var response = JSON.parse( event.data );

//             if ( response.error )
//                 return console.dir( response );

//             if ( ! response.result )
//                 return _ws.close();

//             // var request = 'https://blockchain.info/block-index/' + block.x.blockIndex + '?format=json&cors=true';

//             console.dir( response.result );

//         },

//         // $.getJSON( request, parseBlock );

//         // https://blockchain.info/block-index/$block_index?format=json

//         // var geometry = new THREE.SphereGeometry( block.reward );
//         // var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//         // var sphere = new THREE.Mesh( geometry, material );

//         // if ( scene.children.length === 0 ) {

//         //     camera.position.z = 1000;

//         // } else {

//         //     camera.position.z += 1;

//         // }

//         // for ( var i = 0; i < scene.children.length; i ++ ) {

//         //     var object = scene.children[ i ];

//         //     if ( object instanceof THREE.Mesh ) {

//         //         object.position.x += i * 100;
//         //         object.position.y += i * 100;
//         //         object.position.z += i * 100;

//         //     }
//         // }

//         // scene.add( sphere );
//         getBlockHash = function( index ) {

//             _ws.send( JSON.stringify( {

//                 method : 'get_block_hash',
//                 params: index.toString(),
//                 id : Date.now()

//             } ) );

//         };

// };
