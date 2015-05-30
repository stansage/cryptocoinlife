var MatterGranularity = 3000;
var Depth = 1000;

function View( width, height ) {
    this.source = null;
    this.blockchain = null;
    this.width = width;
    this.height = height;
    this.stats = new Stats();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 80, width / height, 1, Depth );
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

    this.camera.position.z = Depth / 2;

    this.source = new Source( 0, 0, 0 );
    this.scene.add( this.source.mesh  );

    this.matters = [];
    this.dashes = [];
    this.last = 0;
};

View.prototype.getDomElements = function() {
    return [ this.renderer.domElement, this.stats.domElement ];
};

View.prototype.getMatterPosition = function( index ) {
    return this.matters[ parseInt( index / MatterGranularity ) ].getPosition( index % MatterGranularity );
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
    if ( ( z > 200 ) && ( z < Depth ) ) {
        this.camera.position.z = z;
    }
}

View.prototype.dump = function() {
//    console.log( "View.dump", this.matters.length );

    for ( var i = 0; i < this.matters.length; ++ i ) {
        var position = this.matters[ i ].particles.geometry.attributes.position;
        for ( var j = 0; j < 30; j += 3 ) {
            console.log( "View.look", i, j, position.array[ j + 0 ], position.array[ j + 1 ], position.array[ j + 2 ] );
        }
    }
}


View.prototype.render = function( model ) {
    this.stats.begin();

    if ( !! model.source ) {
        var quality = Math.max( model.source.radius / 2, 1 );
        var color = model.toColor( model.source.scale );

        this.source.update( model.source.radius, quality, color );
    }

    if ( model.scene.length !== 0 ) {
        var content = model.scene.pop();

        while ( content.particles.length !== 0 ) {
            var particle = content.particles.pop();
            var index = particle.index % MatterGranularity;
            var granularity = parseInt( particle.index / MatterGranularity );

            while ( granularity >= this.matters.length ) {
                var matter = new Matter( MatterGranularity );
                this.matters.push( matter );
                this.scene.add( matter.particles );
            }
            this.matters[ granularity ].update( index, particle.size, particle.position, model.toColor( particle.scale ) );
        }

        if ( content.lines.length !== 0 ) {
            for ( var i = 0, j = content.lines.length - this.dashes.length; i < j; ++ i ) {
                this.dashes.push( new Dash( 1, 1 ) );
                this.scene.add( this.dashes[ this.dashes.length - 1 ].line );
            }
            for ( i = content.lines.length; i < this.last; ++ i ) {
                this.dashes[ i ].update( [ 0, 0, 0 ], [ 0, 0, 0 ], 0 );
            }
            this.last = content.lines.length;
        }

        while ( content.lines.length !== 0 ) {
            var line = content.lines.pop();

            var left = [ 0, 0, 0 ];
            var right = this.getMatterPosition( line.right );;

            if ( line.left !== line.right ) {
                left = this.getMatterPosition( line.left );
            }

            this.dashes[ content.lines.length ].update( left, right, line.color );
        }
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
