function Model( host ) {
    this.source = null;
    this.scene = [];
    this.socket = new WebSocket( host );
 }

Model.prototype.load = function() {
    this.socket.onmessage = this.onMessage.bind( this );
}

Model.prototype.unload = function() {
    this.socket.close();
}

Model.prototype.accelerate = function() {
    this.socket.send( JSON.stringify( {
        action : "accelerate"
    } ) );
}

Model.prototype.pause = function() {
    console.log( "Model.pause" );
    this.socket.send( JSON.stringify( {
        action : "pause"
    } ) );
}

Model.prototype.toColor = function( scale ) {
    return 0xff0000 + ( parseInt( scale * 0xff ) << 8 )
}

Model.prototype.onMessage = function( message ) {
    if ( ! message.data ) {
        console.warn( "Model.onMessage No data" );
    } else {
        var packet = JSON.parse( message.data );
        this.source = packet.source;

        var content = {
            lines : [],
            particles : []
        };

        for ( var i = 0; i < packet.matter.length; ++ i ) {
            var particle = packet.matter[ i ];

            if ( i + 1 < packet.matter.length ) {
                content.lines.push( {
                    left : particle.index,
                    right : 0,
                    color : this.toColor( particle.scale ),
                } );
            } else {
                for ( var j = 0; j < content.lines.length; ++ j ) {
                    content.lines[ j ].right = particle.index;
                }
                content.lines.push( {
                    left : particle.index,
                    right : particle.index,
                    color : this.toColor( particle.scale )
                } );
            }

            content.particles.push( particle );
        }

        this.scene.push( content );

        if ( this.scene.length === 1000 ) {
            console.warn( "Too many items", this.scene.length );
            this.pause();
        }



    }
};
