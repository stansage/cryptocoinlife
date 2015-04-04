require( [
            "//cdn.webix.com/edge/webix.js"
        ], function() {
            webix.ui( {
                id: "listview",
                view: "list",
                template: "<center><b>Your #device# does not seem to support <a href=\"#href#\">#title#</a>.</center></b>",
                data: [
                    { id: "listview_0", device: "browser", href: "https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest", title: "Ajax" },
                    { id: "listview_1", device: "browser", href: "https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise", title: "Promise" },
                    { id: "listview_2", device: "browser", href: "https://www.websocket.org", title: "WebSocket" },
                    { id: "listview_3", device: "browser", href: "http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation", title: "WebGL" },
                    { id: "listview_4", device: "graphics card", href: "http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation", title: "WebGL" }
                ]
            } );

            var support = JSON.parse( window.location.hash.slice( 1 ) );
            for ( var i = 0; i < support.length; ++ i ) {
                if ( support[ i ] ) {
                    $$( "listview" ).remove( "listview_" + i );
                }
            }
        }
);

//var url = document.createElement( 'a' );
//url.href = document.URL;

////console.log( url.hash );

//if ( ! WebglDetector.webgl ) {

//    var message = window.WebGLRenderingContext ? 'graphics card' : 'browser';
//    showError( [
//        'Your ' + message + ' does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />',
//        'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
//    ].join( '\n' ));

//}

//if ( ! Modernizr.websockets ) {

//    showError('Your browser does not seem to support <a href="https://www.websocket.org/" style="color:#000">WebSocket</a>.');

//}

function showError(error) {

    var div = document.createElement( 'div' );

    div.id = 'webgl-error-message';
    div.style.fontFamily = 'monospace';
    div.style.fontSize = '13px';
    div.style.fontWeight = 'normal';
    div.style.textAlign = 'center';
    div.style.background = '#fff';
    div.style.color = '#000';
    div.style.padding = '1.5em';
    div.style.width = '400px';
    div.style.margin = '5em auto 0';
    div.innerHTML = error;

    document.body.appendChild( div );

}
