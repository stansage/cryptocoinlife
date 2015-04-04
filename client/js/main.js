require( [
        "//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js"
    ], function() {
        Modernizr.addTest( "ajax", function() {
            return ( typeof XMLHttpRequest !== "undefined" )
                && ( XMLHttpRequest.toString().indexOf( "[native code]" ) !== -1 );
        } );


        Modernizr.addTest( 'promise', function() {
            return ( typeof Promise !== "undefined" )
                && ( Promise.toString().indexOf( "[native code]" ) !== -1 );
        } );

        Modernizr.addTest( "opengl", function() {
            try {
                var canvas = document.createElement( "canvas" );
                return !! ( Modernizr.webgl && ( canvas.getContext( "webgl" ) || canvas.getContext( "experimental-webgl" ) ) );
            } catch ( exception ) {
                return false;
            }
        } );


        var support = [
            Modernizr.ajax,
            Modernizr.promise,
            Modernizr.websockets,
            Modernizr.webgl,
            Modernizr.opengl
        ];

        var good = support.reduce( function( p, c ) {
            return c && p;
        }, true );


        window.location = good ? "/play/" : "/support/#" + JSON.stringify( support );
    }

);
