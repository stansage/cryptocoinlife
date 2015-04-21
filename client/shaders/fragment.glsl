//uniform vec4 viewport;

//varying float radius;
//varying vec2 center;

//void main() {
//    vec2 ndc_current_pixel = ( ( 2.0 * gl_FragCoord.xy ) - ( 2.0 * viewport.xy ) ) / ( viewport.zw ) - 1;
//    vec2 diff = ndc_current_pixel - center;
//    float d2 = dot( diff, diff );
//    float r2 = radius * radius;

//    if ( d2 > r2 ) {
//        discard;
//    } else {
//        vec3 l = normalize( gl_LightSource[ 0 ].position.xyz );
//        float dr = sqrt( r2 - d2 );
//        vec3 n = vec3( ndc_current_pixel - center, dr );
//        float intensity = .2;// + max( normalize( n ), 0.1 ); //.2 + max( dot( l, normalize( n ) ), 0.0 );

//        gl_FragColor = gl_FragColor * intensity;
//        gl_FragColor = vec4( color * vColor, 1.0 );

//        gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );

//        gl_FragDepth = gl_FragCoord.z + dr * gl_DepthRange.diff / 2.0 * gl_ProjectionMatrix[ 2 ].z;
//    }
//}

uniform vec3 color;
//uniform sampler2D texture;

void main() {
    gl_FragColor = vec4( color, 1.0 );
//    gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );
}
