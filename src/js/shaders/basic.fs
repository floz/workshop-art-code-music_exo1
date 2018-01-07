precision highp float;

uniform sampler2D tex;
uniform vec3 color;

varying vec2 vUv;

void main() {
	vec4 colorTex = texture2D( tex, vUv );
	gl_FragColor = vec4( colorTex.rgb, 1.0 );
}
