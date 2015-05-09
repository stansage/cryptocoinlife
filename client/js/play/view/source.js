function Source( radius, quality, color ) {
    var sphere = new THREE.SphereGeometry( radius, quality, quality );
    var material = new THREE.MeshBasicMaterial( {
        color : new THREE.Color( color )
    } );
    this.mesh = new THREE.Mesh( sphere, material );
}

Source.prototype.update = function( radius, quality, color ) {
    if ( Math.abs( radius - this.mesh.geometry.boundingSphere.radius ) > 1 ) {
        this.mesh.geometry = new THREE.SphereGeometry( radius, quality, quality );
    }
    if ( Math.abs( color - this.mesh.material.color.getHex() ) > 1 ) {
        this.mesh.material.color.setHex( color );
    }
}
