/*
 *  Copyright 2015 (c) Stan Sage <me@stansage.com>
 *  Licensed under the GPLv2 License.
 *  https://github.com/stansage/cryptocoinlife
 */

var WebSocket = require( "ws" );
var Prescision = 1000000;
var server = require( "./server" );
server.start();

(function test() {
    var state = 0;
//    var time = Date.now();
    var assert = function( condition, message ) {
        if ( ! condition )
            throw new Error( "test:" + state + ": " + message );
    }

    if ( ! server.isReady() ) {
        setTimeout( test, 1 );
    } else {
        var wsc = new WebSocket( "ws://localhost:5100/api" );
        wsc.on( "open", function() {
            wsc.send( JSON.stringify( { block: 1 } ) );
        });
        wsc.on( "message", function( message ) {
            var packet = JSON.parse( message );

            console.log( packet );

            assert( packet.radius && packet.scale && packet.radius > 1.0 && packet.scale < 1.0 );

//            console.log("test:", time, message );

            packet.radius = parseInt( packet.radius * Prescision );
            packet.scale = parseInt( packet.scale * Prescision );

            switch ( ++ state ) {
            case 1:
//                time = Date.now() - time;
//                assert( time > 2000 && time < 2100, time );
//                time = Date.now();
                assert( packet.radius === 171149860 && packet.scale === 999997, message );
                assert( packet.particles.length === 1 );
                assert( parseInt( packet.particles[ 0 ].x * Prescision ) === 78294696 );
                assert( parseInt( packet.particles[ 0 ].y * Prescision ) === 121835952 );
                assert( parseInt( packet.particles[ 0 ].z * Prescision ) === 93067515 );
                assert( parseInt( packet.particles[ 0 ].size * Prescision ) === 2285390 );

                wsc.send( JSON.stringify( { block: 2 } ) );
                break;
            case 2:
//                time = Date.now() - time;
//                assert( time > 19000 && time < 20000, time );
                assert( packet.radius === 171149725 && packet.scale === 999995, message );
                assert( packet.particles.length === 1 );
                assert( parseInt( packet.particles[ 0 ].x * Prescision ) === -78294700 );
                assert( parseInt( packet.particles[ 0 ].y * Prescision ) === -121835942 );
                assert( parseInt( packet.particles[ 0 ].z * Prescision ) === -93067524 );
                assert( parseInt( packet.particles[ 0 ].size * Prescision ) === 2285390 );

                wsc.send( JSON.stringify( { block: 5 } ) );
//                time = Date.now();
                break;
            case 3:
//                time = Date.now() - time;
//                assert( time > 9000 && time < 10000, time );
                assert( packet.radius === 171149589 && packet.scale === 999992, message );
                assert( packet.particles.length === 1 );
                assert( parseInt( packet.particles[ 0 ].x * Prescision ) === -78294798 );
                assert( parseInt( packet.particles[ 0 ].y * Prescision ) === -121835728 );
                assert( parseInt( packet.particles[ 0 ].z * Prescision ) === -93067722 );
                assert( parseInt( packet.particles[ 0 ].size * Prescision ) === 2285390 );
                wsc.send( JSON.stringify( {} ) );
//                time = Date.now();
                break;
            }
        });
    }
})();
