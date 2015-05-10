var Algebra = require( "./algebra" );
var GenesisTransaction = {
    blockhash : "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
    blocktime : 1231006505,
    confirmations : 352959,
    locktime : 0,
    time : 1231006505,
    txid : "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
    version : 1,
    vin: [
        {
            coinbase : "04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73",
            sequence : 4294967295
        }
    ],
    vout: [
        {
            value : 50.00000000,
            n : 0,
            scriptPubKey : {
                asm : "04678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5f OP_CHECKSIG",
                hex : "4104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac",
                reqSigs : 1,
                type : "pubkey",
                addresses : [
                    "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                ]
            }
        }
    ]
};
var SecondsPerDay = 24 * 60 * 60;
var MaxVolume = 21000000.0;
var MaxSource = 2 * Algebra.sphereRadius( MaxVolume );

function Block( id, chain ) {
    /// Global
    this.chain = chain;
    this.children = [];
    this.index = 0;
    this.total = 0;

    /// Commit
    this.content = [];
    this.id = id;
    this.time = 0;
    this.size = 0;
    this.spent = [];
    this.volume = 0;
    this.reward = 0;
}


Block.prototype.first = function() {
    if ( !! this.id ) {
        return false;
    }

    this.id = 1;
    this.index = 0;
    this.time = GenesisTransaction.blocktime;
    this.size = 1;
    this.total = MaxVolume;

    this.add( GenesisTransaction );

    return true;
};

Block.prototype.add = function( transaction ) {
    if ( transaction.vin.length === 0 ) {
        console.error( "No input", transaction );
        return;
    }
    if ( transaction.vout.length === 0 ) {
        console.error( "No outout", transaction );
        return;
    }

    var item = null;
    for ( var i = 0; i < transaction.vin.length; ++ i ) {
        var vin = transaction.vin[ i ];
        if ( ! vin.coinbase ) {
            this.content.push( vin );
        } else if ( transaction.vin.length !== 1 ) {
            console.error( "Invalid coinbase", transaction );
        }
    }

    var outgoing = [];
    for ( var j = 0; j < transaction.vout.length; ++ j ) {
        var value = transaction.vout[ j ].value;
        outgoing.push( value );
        this.volume += value;
    }

    if ( this.content.length === 0 ) {
        this.reward = this.volume;
    }

    if ( transaction.txid in this.chain ) {
        item = this.chain[ transaction.txid ];
        if ( item.block !== this.index ) {
            console.error( item.block, this.index );
            throw "Invalid block";
        }
        if ( item.outgoing.length !== outgoing.length ) {
            console.error( item.block, this.index );
            throw "Invalid outgoing";
        }
        for ( var i = 0; i < outgoing.length; ++ i ) {
            if ( item.outgoing[ i ] !== outgoing[ i ] ) {
                console.error( item.block, this.index );
                throw "Invalid value";
            }
        }
    } else {
        item = {
            block : this.index,
            outgoing : outgoing
        };
        this.chain[ transaction.txid ] = item;
    }
}

Block.prototype.commit = function() {
    if ( this.reward < 1 ) {
        console.warn( "Block.commit Low reward", this.reward );
    }
    if ( this.volume < 1 ) {
        console.warn( "Block.commit Low volume", this.volume );
    }

    if ( this.volume < Math.abs( Number.MIN_VALUE ) ) {
        console.error( this.volume );
        throw "Zero volume";
    }

    this.children.push( this.volume );
    this.total -= this.reward;

    var result = {
        block : this.index,
        matter : [],
        source : {
            radius : Algebra.sphereRadius( this.total ),
            scale : this.total / MaxVolume
        }
    };

    var distance = Math.max( 1, ( this.time - GenesisTransaction.time ) / SecondsPerDay );
    var half = 2 * Math.PI * distance * distance;
    var full = 2 * half;
    var radius = this.time % full > half ? distance + MaxSource : -distance - MaxSource;
    var angle = 2.0 * Math.PI * ( this.time % half ) / half;
    var coordinates = [ radius ].concat( [ angle, angle ] );

    for ( var i = 0; i < this.content.length; ++ i ) {
        var transaction = this.content[ i ];
        if ( transaction.txid in this.chain ) {
            var item = this.chain[ transaction.txid ]
            var value = item.outgoing[ transaction.vout ];

            if ( item.block >= this.children.length ) {
                console.error( item.block, this.children.length, i );
                throw "Invalid item";
            }

            this.children[ item.block ] -= value;

            if ( this.children[ item.block ] < 0 ) {
                console.error( item.block, this.children[ item.block ], value );
                throw "Invalid value";
            }

            result.matter.push( {
                index : item.block,
                size : Algebra.cubeSize( this.children[ item.block ] ),
                scale : value / this.volume
            } );
        } else {
            console.error( transaction );
            throw "Invalid transaction";
        }
    }

    result.matter.push( {
        index : this.index,
        size : Algebra.cubeSize( this.volume ),
        scale : this.reward / this.volume,
        position : Algebra.fromSpherical( coordinates )
    } );

    ++ this.index;
    this.content = [];
    this.volume = 0;

    if ( this.children.length !== this.index ) {
        console.error( this.children.length, this.index );
        throw "Invalid children";
    }

    return result;
};

module.exports = Block;
