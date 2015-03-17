/*
 *  Copyright 2015 (c) Stan Sage <me@stansage.com>
 *  Licensed under the GPLv2 License.
 *  https://github.com/stansage/cryptocoinlife
 */
 
(function(exports) {
    
    var socket = new io.connect('46.241.23.52:4225');

    var model = {

        request : function ( method, arg, callback ) {
            
            socket.on( '#' + method, callback );
            socket.emit( method, arg );
        }

    };

    if ( typeof define === 'function' && define.amd ) {
    
        /* AMD support */
        define( function() {
    
            return model;
    
        } );
    
    } else {
    
        exports.model = model;
    
    }

})(this);

// var api = function() {
    
//     var ws: new WebSocket('ws://46.241.23.52:4225'),
//     _subscribe: function( event ) {
    
//         console.log('activating feed');
    
//         getBlockHash( 0 );
    
//     },
//     _populate: function( event ) {
    
//         var response = JSON.parse( event.data );
        
//         if ( response.error )
//             return console.dir( response );
    
//         if ( ! response.result )
//             return blockchain.close();
            
//         // var request = 'https://blockchain.info/block-index/' + block.x.blockIndex + '?format=json&cors=true';
        
//         console.dir( response.result );
    
//         // $.getJSON( request, parseBlock );
    
//         // https://blockchain.info/block-index/$block_index?format=json
    
//         // var geometry = new THREE.SphereGeometry( block.reward );
//         // var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//         // var sphere = new THREE.Mesh( geometry, material );
    
//         // if ( scene.children.length === 0 ) {
    
//         //     camera.position.z = 1000;
    
//         // } else {
    
        //     camera.position.z += 1;
    
        // }
        
        // for ( var i = 0; i < scene.children.length; i ++ ) {
        
        //     var object = scene.children[ i ];
    
        //     if ( object instanceof THREE.Mesh ) {
    
        //         object.position.x += i * 100;
        //         object.position.y += i * 100;
        //         object.position.z += i * 100;
    
        //     }
        // }
    
        // scene.add( sphere );
    
//     },
    
//     getBlockHash: function( index ) {
    
//         blockchain.send( JSON.stringify( {
//             method : 'get_block_hash',
//             params: index.toString(),
//             id : Date.now()
//         } ) );
    
//     }

// };


// $.getJSON( request, parseBlock );
    
        // https://blockchain.info/block-index/$block_index?format=json
    
        // var geometry = new THREE.SphereGeometry( block.reward );
        // var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        // var sphere = new THREE.Mesh( geometry, material );
    
        // if ( scene.children.length === 0 ) {
    
        //     camera.position.z = 1000;
    
        // } else {
    
        //     camera.position.z += 1;
    
        // }
        
        // for ( var i = 0; i < scene.children.length; i ++ ) {
        
        //     var object = scene.children[ i ];
    
        //     if ( object instanceof THREE.Mesh ) {
    
        //         object.position.x += i * 100;
        //         object.position.y += i * 100;
        //         object.position.z += i * 100;
    
        //     }
        // }
    
        // scene.add( sphere );
        
        
    //     function subscribe( event ) {
    
    //     console.log('activating feed');

    //     getBlockHash( 0 );

    // }
    // function populate( event ) {

    //     var response = JSON.parse( event.data );
    
    //     if ( response.error )
    //         return console.dir( response );

    //     if ( ! response.result )
    //         return socket.close();
        
    //     // var request = 'https://blockchain.info/block-index/' + block.x.blockIndex + '?format=json&cors=true';
    
    //     console.dir( response.result );
    
    // }