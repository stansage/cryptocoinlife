/*
 *  Copyright 2015 (c) Stan Sage <me@stansage.com>
 *  Licensed under the GPLv2 License.
 *  https://github.com/stansage/cryptocoinlife
 */

var WebSocket = require( "ws" );
var server = require( "./server" );
server.start();

(function test() {
    var state = 0;
    var time = Date.now();
    var assert = function( condition, message ) {
        if ( ! condition )
            throw "test:" + state + ": " + message;
    }

    if ( ! server.isReady() ) {
        setTimeout( test, 1 );
    } else {
        var wsc = new WebSocket( "ws://localhost:5000/api" );
        wsc.on( "open", function() {
            wsc.send( JSON.stringify( { offset: 0, delay: 1000 } ) );
        });
        wsc.on( "message", function( message ) {
            var packet = JSON.parse( message );

            if ( ! packet.radius || ! packet.scale || packet.radius < 1.0 || packet.scale > 1.0 ) {
                throw "test:0" + message;
            }

//            console.log("test:", time, message );

            packet.radius = parseInt( packet.radius * 1000000 );
            packet.scale = parseInt( packet.scale * 1000000 );

            switch ( ++ state ) {
            case 1:
                time = Date.now() - time;
                assert( time > 2000 && time < 2100, time );
                time = Date.now();
                assert( packet.radius === 171149860 && packet.scale === 999997, message );
                wsc.send( JSON.stringify( { offset: 100, delay: 200 } ) );
                break;
            case 100:
                time = Date.now() - time;
                assert( time > 19000 && time < 20000, time );
                assert( packet.radius === 171136412 && packet.scale === 999761, message );
                wsc.send( JSON.stringify( { offset: 1, delay: 100 } ) );
                time = Date.now();
                break;
            case 200:
                time = Date.now() - time;
                assert( time > 9000 && time < 10000, time );
                assert( packet.radius === 171123369 && packet.scale === 999533, message );
                time = Date.now();
                break;
            case 300:
                time = Date.now() - time;
                assert( time > 9000 && time < 10000, time );
                wsc.send( JSON.stringify( {} ) );
                time = Date.now();
                break;
            }
        });
    }
})();
