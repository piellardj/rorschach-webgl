attribute vec2 aCoords; // {-1,1}x{-1,1}

uniform vec2 uCoordsAdjustment; // computed on CPU to handle different aspect ratios

varying vec2 vUv;

void main(void)
{
    gl_Position = vec4(aCoords, 0, 1);
    vUv = aCoords * uCoordsAdjustment;
}
