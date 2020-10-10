attribute vec2 aCoords; // in [-1,1]x[-1,1] to cover the whole canvas

uniform vec2 uCoordsAdjustment; // computed on CPU to handle different aspect ratios

varying vec2 vUv;

void main(void)
{
    gl_Position = vec4(aCoords / uCoordsAdjustment, 0, 1);
    vUv = aCoords;
}
