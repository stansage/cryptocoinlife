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
    var assert = function( condition, arg ) {
        if ( ! condition ) {
            if ( typeof( key ) !== "string" ) {
                arg = JSON.stringify( arg );
            }

            throw new Error( "test " + state + ": " + arg );
        }
    }

    if ( ! server.isReady() ) {
        setTimeout( test, 1 );
    } else {
        var wsc = new WebSocket( "ws://localhost:5000/api" );
        wsc.on( "message", function( message ) {
            var packet = JSON.parse( message );

//            console.log( packet );

            assert( ( !! packet.source ) && ( !! packet.matter ), message );

            packet.source.radius *= Prescision;
            packet.source.scale *= Prescision;

            switch ( ++ state ) {
            case 1:
                packet.matter[ 0 ].size *= Prescision;
                packet.matter[ 0 ].scale *= Prescision;

                assert( parseInt( packet.source.radius ) === 171149860, packet.source.radius );
                assert( parseInt( packet.source.scale ) === 999997, packet.source.scale );
                assert( packet.matter.length === 1, packet.matter );
                assert( packet.matter[ 0 ].index === 0, packet.matter[ 0 ].index );
                assert( parseInt( packet.matter[ 0 ].size ) === 3684031, packet.matter[ 0 ].size );
                assert( parseInt( packet.matter[ 0 ].scale ) === 2, packet.matter[ 0 ].scale );
                break;
            case 171:
                packet.matter[ 0 ].size *= Prescision;
                packet.matter[ 0 ].scale *= Prescision;
                packet.matter[ 1 ].size *= Prescision;
                packet.matter[ 1 ].scale *= Prescision;

                assert( parseInt( packet.source.radius ) === 171126630, packet.source.radius );
                assert( parseInt( packet.source.scale ) === 999590, packet.source.scale );
                assert( packet.matter.length === 2, packet.matter );
                assert( packet.matter[ 0 ].index === 9, packet.matter[ 0 ].index );
                assert( parseInt( packet.matter[ 0 ].size ) === 3684031, packet.matter[ 0 ].size );
                assert( parseInt( packet.matter[ 0 ].scale ) === 2, packet.matter[ 0 ].scale );
                assert( packet.matter[ 1 ].index === 170, packet.matter[ 1 ].index );
                assert( parseInt( packet.matter[ 1 ].size ) === 4641588, packet.matter[ 1 ].size );
                assert( parseInt( packet.matter[ 1 ].scale ) === 4, packet.matter[ 1 ].scale );
                break;
            case 1000:
//                assert( packet.matter.length === 1, packet.matter );
                wsc.close();
                break;
            }
        });
    }
})();
