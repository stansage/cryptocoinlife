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
        var color = 0xff0000 + ( parseInt( model.source.scale * 0xff ) << 8 );

        this.source.render( model.source.radius, quality, color );
    }

    while ( model.particles.length !== 0 ) {
        if ( this.scene.children === 0 ) {
            throw "source must be added";
        }

        var particle = model.particles.pop();
        var index = particle.index % MatterGranularity;
        var granularity = parseInt( particle.index / MatterGranularity );

        while ( granularity >= this.matters.length ) {
            this.matters.push( new Matter( MatterGranularity ) );
            this.scene.add( this.matters[ this.matters.length - 1 ].particles );
        }
        this.matters[ granularity ].update( index, particle.size, particle.position );
    }

    this.renderer.render( this.scene, this.camera );
    this.stats.end();

    window.requestAnimationFrame( this.render.bind( this, model ) );
};
