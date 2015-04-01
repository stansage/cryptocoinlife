require( [

        '//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js'

    ], function() {

        Modernizr.addTest( 'ajax', function() {

            return ( typeof XMLHttpRequest !== "undefined" )
                && ( XMLHttpRequest.toString().indexOf( "[native code]" ) !== -1 );

        } );
        

        Modernizr.addTest( 'promise', function() {

            return ( typeof Promise !== "undefined" ) 
                && ( Promise.toString().indexOf( "[native code]" ) !== -1 );

        } );
        


        var support = [
            
            Modernizr.ajax,
            Modernizr.webgl,
            Modernizr.promise,
            WebglDetector.webgl

        ];
        var test = support.reduce( function( p, c ) { return  +( c[ 1 ] ) + p; }, 0 );

        window.location = test ? "/support/#" + JSON.stringfy( support ) : "/play/";

        // if ( support ) {

        //     console.log("starting support");
            
        //     require( [ '/support.js' ], function() {
            
        //         console.log("support started");
            
        //     } );

        // } else {
            
        //     require( [
        //         '//cdnjs.cloudflare.com/ajax/libs/stats.js/r11/Stats.min.js',
        //         '//cdnjs.cloudflare.com/ajax/libs/three.js/r70/three.min.js' 
        //         ], function() {

        //             console.log("starting application");

        //             require( [ '/main.js' ], function() {

        //                     console.log("application started"); 

        //             } );

        //         } );

        // }

    }

);

/**
 * @summary jQuery ajax wrapper
 * @author stansage / http://stansage.com/
 */

// var require = function( urls, callback ) {

//     var index = -1,
//         recurrent = function() {

//             if ( ++ index < urls.length) {
    
//                 $.getScript( urls[ index ], recurrent );
    
    
//             } else {
            
//                 index = -1;
    
//                 if ( typeof callback == "function" )
//                     callback();
    
//             }
//         };
    
//     if ( typeof( urls ) == "string" ) {

//         $.getScript( urls, callback );

//         return;
//     }
    
//     if ( ! ( urls instanceof Array ) || ( urls.length === 0 ) )
//         return;

//     recurrent();
// };

