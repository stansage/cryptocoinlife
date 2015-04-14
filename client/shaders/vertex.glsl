uniform vec4 viewport;

attribute float size;

varying float radius;
varying vec2 center;

void main() {
    gl_Position = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = size * min( viewport.z, viewport.w );

    center = gl_Position.xy;
    radius = size;
}
