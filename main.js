String.prototype.endsWith = function( suffix ) {

    return this.indexOf( suffix, this.length - suffix.length ) !== -1;

};

var express = require( 'express' ),
    app = express();

app.set( 'views', 'jade' );
app.set( 'view engine', 'client' );
app.set( 'port', ( process.env.PORT || 5000 ) );

app.enable( 'strict routing' );
app.use( express.static( __dirname + '/public' ) );

app.get( '/*', function( request, response, next ) {

    // response.header('Access-Control-Allow-Origin', 'https://blockchain.info' );
    // response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    try {

        var template = request.params[ 0 ] || 'main';

        while ( template[ template.length - 1 ] === '/' ) {

            template = template.slice(0, -1);

        }

        response.render(template);

    } catch (exception) {

        console.error(exception);

        response.sendStatus(404);

    }

    next();

} );

app.listen( app.get( 'port' ), function() {

    console.log( 'server is running at :' + app.get( 'port' ) );

} );

if ( app.settings.env === 'development' && process.env.PWD.endsWith( "www,cryptocoin.life" ) ) {

    var websocket = require('ws'),
        bitcoin = require('bitcoin'),

        wss = new websocket.Server( { port: 4225 } ),

        btc = new bitcoin.Client( {
            host: 'localhost',
            port: 8332,
            user: 'bitcoinrpc',
            pass: 'Fpf2X94gf3Q2n6cPo4j2m3psoDnT5gcCoARe6MLiKqMd'
        } );

    wss.on( 'connection', function connection( socket ) {

        socket.on( 'message', function ( json ) {

            var rpc = JSON.parse( json ),
                answer = function ( e, r ) {

                    socket.send( JSON.stringify( {
                        result : r,
                        error : e,
                        id : rpc.id
                    } ) );

                };

            if ( ! rpc.method ) {

                answer();
                socket.close();

            } else {

                var method = rpc.method;

                // for ( var e = method.indexOf('_'); e !== -1; e = method.indexOf('_', e) ) {

                //     method = method.substr( 0,  e )
                //           + method.substr( e + 1, 1 ).toUpperCase()
                //           + method.substr( e + 2 );

                // }

                var proxy = btc[ method ];

                if ( typeof( proxy ) !== "function" ) {

                    answer( 'method not found', method );

                } else if ( rpc.params instanceof Array ) {

                    proxy.apply( btc, answer, rpc.params );

                } else if ( rpc.params ) {

                    proxy.call( btc, answer, rpc.params );

                } else {


                    proxy.call( btc, answer );

                }

            }

        });

    });

}

