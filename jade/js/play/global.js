/*
 *  Copyright 2015 (c) Stan Sage <me@stansage.com>
 *  Licensed under the GPLv2 License.
 *  https://github.com/stansage/cryptocoinlife
 */
 

if ( !Date.now ) {

    Date.now = function() { 

        return new Date().getTime(); 

    }

}

function assert(condition, message) {

    if ( ! condition ) {

        message = message || "Assertion failed";

        if ( typeof Error !== "undefined" )
            throw new Error(message);

        throw message; // Fallback

    }

}
