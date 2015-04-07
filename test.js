/*
 *  Copyright 2015 (c) Stan Sage <me@stansage.com>
 *  Licensed under the GPLv2 License.
 *  https://github.com/stansage/cryptocoinlife
 */

var WebSocket = require( "ws" );
var server = require( "./server" );
server.start();

(function test() {
    if ( ! server.isReady() ) {
        setTimeout( test, 1 );
    } else {
        var wsc = new WebSocket( "ws://localhost:5100/api" );
        wsc.on( "open", function() {
            wsc.send( JSON.stringify( { treshold: 100 } ) );
        });
        wsc.on( "message", function( message ) {
            var packet = JSON.parse( message );
            if ( ! packet.source  ) {
                throw "test: Invalid packet " + message;
            }
            wsc.send( JSON.stringify( {} ) );
        });
    }
})();
