require( [
        "//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js",
        "//cdnjs.cloudflare.com/ajax/libs/stats.js/r11/Stats.min.js",
        "//ajax.googleapis.com/ajax/libs/threejs/r69/three.min.js"
    ], function() {
        var model = new Model( window.location.origin.replace( /^http/, "ws" ) + "/api" );
        var view = new View( 1000 );
        var controller = new Controller();

        controller.attach( model, view );
    }
);

