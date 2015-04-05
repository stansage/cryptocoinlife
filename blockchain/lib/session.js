/*
 *  Copyright 2015 (c) Stan Sage <me@stansage.com>
 *  Licensed under the GPLv2 License.
 *  https://github.com/stansage/cryptocoinlife
 */

function Session( client ) {
    this.client = client;
    this.items = [];
}

Session.prototype.hasClient = function( client ) {
    return this.isActive() && this.client === client;
};

Session.prototype.isActive = function() {
    return !! this.client;
};

Session.prototype.setActive = function( active ) {
    if ( this.client && ! active ) {
        this.client = undefined;
        this.items = [];
    }
};


Session.prototype.addTransaction = function( transaction ) {
//    console.log( "Session:update:this", this );
//    console.log( "Session:addTransaction:transaction", transaction );

    if ( ! this.isActive() ) {
        throw "Session must be in active state";
    }

    if ( this.items.length === 0 ) {
        this.items.push( { radius: 1000, color: 0x0000ff00, position: { x: 100, y: 100, z: 100 } } );
    }

    this.client.send( JSON.stringify( this.items ) );
}

module.exports = Session;

