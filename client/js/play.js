require( [
//        "//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js",
//        "//cdnjs.cloudflare.com/ajax/libs/stats.js/r11/Stats.min.js",
//        "//ajax.googleapis.com/ajax/libs/threejs/r69/three.min.js"
        "//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.js",
        "//cdnjs.cloudflare.com/ajax/libs/stats.js/r11/Stats.js",
        "//ajax.googleapis.com/ajax/libs/threejs/r69/three.js"
    ], function() {
        var model = new Model( window.location.origin.replace( /^http/, "ws" ) + "/api" );
        var view = new View( window.innerWidth, window.innerHeight );
        var controller = new Controller( model, view );

        model.load( { block: 0 } );
        controller.attach( document.body );
        view.animate( model );
    }
);

