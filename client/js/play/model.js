function Model( host ) {
    this.source = null;
    this.particles = [];
    this.lines = [];
    this.socket = new WebSocket( host );
 }

Model.prototype.load = function() {
    this.socket.onmessage = this.onMessage.bind( this );
}

Model.prototype.unload = function() {
    this.socket.close();
}

Model.prototype.pause = function() {
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

        for ( var i = 0, offset = this.lines.length; i < packet.matter.length; ++ i ) {
            var particle = packet.matter[ i ];

            if ( i + 1 < packet.matter.length ) {
                this.lines.push( {
                    left : particle.index,
                    right : 0,
                    color : this.toColor( particle.scale ),
                } );
            } else {
                for ( var j = offset; j < this.lines.length; ++ j ) {
                    this.lines[ j ].right = particle.index;
                }
                this.lines.push( {
                    left : particle.index,
                    right : particle.index,
                    color : this.toColor( particle.scale )
                } );
            }

            this.particles.push( particle );
        }
    }
};
