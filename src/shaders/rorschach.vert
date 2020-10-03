attribute vec2 aCoords; // {-1,1}x{-1,1}

uniform float uAspectRatio;

varying vec2 vUv;

void main(void)
{
    gl_Position = vec4(aCoords, 0, 1);
    vUv = 0.5 * aCoords * vec2(uAspectRatio, 1.0);
}
