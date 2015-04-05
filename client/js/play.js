require( [
        "//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js",
        "//cdnjs.cloudflare.com/ajax/libs/stats.js/r11/Stats.min.js",
        "//ajax.googleapis.com/ajax/libs/threejs/r69/three.min.js"
    ], function() {
        var view = new View();
        var controller = new Controller();
        var model = new Model( window.location.origin.replace( /^http/, "ws" ) + "/api" );

        controller.attach( model, view );
    }
);

