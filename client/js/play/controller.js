function Controller() {
}

Controller.prototype.attach = function( model, view ) {
    document.onmousemove = view.onDocumentMouseMove.bind( view );
    document.ontouchstart = view.onDocumentTouchStart.bind( view );
    document.ontouchmove = view.onDocumentTouchMove.bind( view );

    window.onclick = view.triggerAnimation.bind( view );
    window.onresize = view.onWindowResize.bind( view );
    window.onbeforeunload = model.unsubscribe.bind( model );

    model.subscribe( view.onUpdate.bind( view ) );
    model.load( view.getLayout() );
    view.triggerAnimation();
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
