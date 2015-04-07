require( [
        "//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js",
        "//cdnjs.cloudflare.com/ajax/libs/stats.js/r11/Stats.min.js",
        "//ajax.googleapis.com/ajax/libs/threejs/r69/three.min.js"
    ], function() {
        var model = new Model( window.location.origin.replace( /^http/, "ws" ) + "/api" );
        var view = new View( window.innerWidth, window.innerHeight );
        var controller = new Controller( model, view );

        model.load( { offset: 0, delay: 1 } );
        controller.attach( document.body );
        view.animate( model );
    }
);

