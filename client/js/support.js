var url = document.createElement( 'a' );
url.href = document.URL; 

console.log( url.hash );


if ( ! Modernizr.promise ) {

    showError('Your browser does not seem to support <a href="https://www.websocket.org/" style="color:#000">WebSocket</a>.');

}

if ( ! WebglDetector.webgl ) {

    var message = window.WebGLRenderingContext ? 'graphics card' : 'browser';
    showError( [
        'Your ' + message + ' does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />',
        'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
    ].join( '\n' ));

}

if ( ! Modernizr.websockets ) {

    showError('Your browser does not seem to support <a href="https://www.websocket.org/" style="color:#000">WebSocket</a>.');

}

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
