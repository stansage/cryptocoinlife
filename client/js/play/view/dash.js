function Dash( width, scale ) {
    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial( {
        color : 0xffffff,
        opacity : 1,
        linewidth : width
    } );

    this.line = new THREE.Line( geometry, material, THREE.LinePieces );
    this.line.scale.x = scale;
    this.line.scale.y = scale;
    this.line.scale.z = scale;
    this.line.originalScale = scale;

    this.line.geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
    this.line.geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
}

Dash.prototype.update = function( left, right, color ) {
//    this.line.material.color.set( color );
//    this.line.material.color.set( 0xff7700 );
    this.line.geometry.vertices[ 0 ].set( left[ 0 ], left[ 1 ], left[ 2 ] );
    this.line.geometry.vertices[ 1 ].set( right[ 0 ], right[ 1 ], right[ 2 ] );
    this.line.geometry.verticesNeedUpdate = true;
};
