/*
 *  Copyright 2015 (c) Stan Sage <me@stansage.com>
 *  Licensed under the GPLv2 License.
 *  https://github.com/stansage/cryptocoinlife
 */

function Rpc( provider ) {
    this.client = new provider.Client( {
        host: "localhost",
        port: 8332,
        user: "bitcoinrpc",
        pass: "Fpf2X94gf3Q2n6cPo4j2m3psoDnT5gcCoARe6MLiKqMd",
        timeout: 30000
    } );
}

Rpc.prototype.getBlock = function( index ) {
    return this.client.getBlock( index );
};

module.exports = Rpc;
