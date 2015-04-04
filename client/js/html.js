if ( !Date.now ) {
    Date.now = function() {
        return new Date().getTime();
    }
}

function assert( condition, message ) {
    if ( ! condition ) {
        message = message || "Assertion failed";

        if ( typeof Error !== "undefined" )
            throw new Error( message );

        throw message;
    }
}

function defineExport( namespace, name, object ) {
    if ( typeof define === 'function' && define.amd ) {
        define( function() {
            return object;
        } );
    } else {
       namespace[ name ] = object;
    }
}

function getParameterByName( name ) {
    name = name.replace( /[\[]/, "\\[" ).replace( /[\]]/, "\\]" );

    var regex = new RegExp( "[\\?&]" + name + "=([^&#]*)" );
    var results = regex.exec( location.search );

    return results === null ? "" : decodeURIComponent( results[ 1 ].replace( /\+/g, " " ) );
}
