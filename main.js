var express = require( 'express' );
//var WebSocket = require('ws');
//var WebSocketServer = require('ws').Server


var app = express();
//var ws = new WebSocket('wss://ws.blockchain.info/inv');
//var wss = new WebSocketServer({ port: 8080 });

//wss.on('connection', function connection(socket) {
//	socket.on('message', function incoming(message) {
//		console.log('received: %s', message);
//    });
//    socket.send('something');
//});
//ws.on('open', function open() {
//	ws.send('{"op": "ping_block"}');
//});
//ws.error('error', function(event) {
//	console.error(event);
//});
//ws.on('message', function(data, flags) {
//	console.log(data + ": " + flags);
//	  // flags.binary will be set if a binary data is received.
//	  //   // flags.masked will be set if the data was masked.
//});

app.set( 'views', __dirname + '/jade' );
app.set( 'view engine', 'jade' );
app.set( 'port', ( process.env.PORT || 5000 ) );

app.use( express.static( __dirname + '/public' ) );
app.enable( 'strict routing' );


app.get( '/*', function( request, response ) {
    try {
        
        var template = request.params[ 0 ] || 'index';
        while ( template[ template.length - 1 ] === '/' ) {

            template = template.slice(0, -1);

        }
        
        response.render(template);
        
    } catch (exception) {
        
        console.error(exception);
        
        response.sendStatus(404);
    }
} );

app.listen( app.get( 'port' ), function() {

	console.log( 'Server is running at :' + app.get( 'port' ) );
	
} );
