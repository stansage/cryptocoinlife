var MatterGranularity = 3000;

function View( width, height ) {
    this.source = null;
    this.blockchain = null;
    this.width = width;
    this.height = height;
    this.stats = new Stats();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 80, width / height, 1, 1000 );
    this.renderer = new THREE.WebGLRenderer();
    this.rgb = function( color ) {
        return ( color.r << 16 ) | ( color.g << 8 ) | color.b;
    }

    this.renderer.setSize( width, height );
    if ( 'setPixelRatio' in this.renderer ) {
        this.renderer.setPixelRatio( window.devicePixelRatio );
    }

    this.stats.domElement.style.position = "absolute";
    this.stats.domElement.style.bottom = "0px";
    this.stats.domElement.style.right = "0px";

    this.camera.position.z = 500;

    this.source = new Source( 0, 0, 0 );
    this.scene.add( this.source.mesh  );

    this.matters = [];
    this.dashes = [];
    this.last = 0;
};

View.prototype.getDomElements = function() {
    return [ this.renderer.domElement, this.stats.domElement ];
};

View.prototype.resize = function( width, height ) {
    this.width = width;
    this.height = height;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();


    this.renderer.setSize( this.width, this.height );
};

View.prototype.look = function( degrees ) {
    var z = this.camera.position.z - degrees / 15;
    if ( ( z > 200 ) && ( z < 1000 ) ) {
        this.camera.position.z = z;
    }
}

View.prototype.render = function( model ) {
    this.stats.begin();

    if ( !! model.source ) {
        var quality = Math.max( model.source.radius / 2, 1 );
        var color = model.toColor( model.source.scale );

        this.source.update( model.source.radius, quality, color );
    }

    while ( model.particles.length !== 0 ) {
        if ( this.scene.children === 0 ) {
            throw "source must be added";
        }

        var particle = model.particles.pop();
        var index = particle.index % MatterGranularity;
        var granularity = parseInt( particle.index / MatterGranularity );

        while ( granularity >= this.matters.length ) {
            var matter = new Matter( MatterGranularity );
            this.matters.push( matter );
            this.scene.add( matter.particles );
        }
        this.matters[ granularity ].update( index, particle.size, particle.position );
    }

    if ( model.lines.length !== 0 ) {
        for ( var i = 0, j = model.lines.length - this.dashes.length; i < j; ++ i ) {
            this.dashes.push( new Dash( 1, 1 ) );
            this.scene.add( this.dashes[ this.dashes.length - 1 ].line );
        }
        for ( i = model.lines.length; i < this.last; ++ i ) {
            this.dashes[ i ].update( [ 0, 0, 0 ], [ 0, 0, 0 ], 0 );
        }
        this.last = model.lines.length;
    }

    while ( model.lines.length !== 0 ) {
        var line = model.lines.pop();

        var left = [ 0, 0, 0 ];
        if ( line.first !== line.last ) {
            index = line.first % MatterGranularity;
            granularity = parseInt( line.first / MatterGranularity );

            left = this.matters[ granularity ].getPosition( index );
        }

        index = line.last % MatterGranularity;
        granularity = parseInt( line.last / MatterGranularity );

        var right = this.matters[ granularity ].getPosition( index );
        var dash = this.dashes[ model.lines.length ];

        dash.update( left, right, line.color );
    }


//    } else {
//          console.log( "View.render dashes 0", this.dashes[ 0 ] );
////        for ( i = 0; i < this.dashes.length; ++ i ) {
////            console.log( "View.render dashes", this.dashes[ i ] );
////        }
//    }

//        this.scene.add( this.matters[ this.matters.length - 1 ].particles );

    this.renderer.render( this.scene, this.camera );
    this.stats.end();

    window.requestAnimationFrame( this.render.bind( this, model ) );
};
