/*
 *  Copyright 2015 (c) Stan Sage <me@stansage.com>
 *  Licensed under the GPLv2 License.
 *  https://github.com/stansage/cryptocoinlife
 */

var Bitcoin = require( "bitcoin" );
var Blockchain = require( "./blockchain" );
var Http = require( "http" );
var WebSocket = require( "ws" );
var express = require( "express" );
var ready = false;
var app = express();
var server = Http.createServer( app );
var api = Blockchain.createApi( new Bitcoin.Client( {
    host: "localhost",
    port: 8332,
    user: "bitcoinrpc",
    //pass: "Fpf2X94gf3Q2n6cPo4j2m3psoDnT5gcCoARe6MLiKqMd",
    pass: "EhvpRV98EsfrmXkZatVkG45f4rSTCvfh3Zz9ohai85rV",
    timeout: 30000
} ) );

app.set( "views", "client" );
app.set( "view engine", "jade" );
app.set( "port", ( process.env.PORT || 5000 ) );

app.enable( "strict routing" );
app.use( express.static( __dirname + "/public" ) );

app.get( "/*", function( request, response, next ) {
    try {
        var template = request.params[ 0 ] || "main";
        while ( template[ template.length - 1 ] === "/" ) {
            template = template.slice( 0, -1 );
        }
        response.render( template );
    } catch ( exception ) {
        console.error( exception );
        response.sendStatus( 404 );
    }
    next();
} );

module.exports = {
    isReady: function() {
       return ready;
    },
    start: function() {
        server.listen( app.get( "port" ), function() {
            ready = true;
            console.log( "server is running at :" + app.get( "port" ) );
        } );

        var wss = new WebSocket.Server( { server: server, path: "/api" } );
        wss.on( "connection", function( socket ) {
            api.subscribe( socket );
            socket.on( "close", api.unsubscribe.bind( api, socket ) );
        } );
    }
}
