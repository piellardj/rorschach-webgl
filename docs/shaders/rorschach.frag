precision lowp float;

varying vec2 uv;

void main(void)
{
    gl_FragColor = vec4(uv, 0.0, 1.0);
}