#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif

#define WATCHMEN_MODE #INJECT(WATCHMEN_MODE_ID)

uniform float uTime;
uniform float uSharpness; // expected to be in [0, 1]
uniform float uThreshold; // expected to be in [0, 1]
uniform float uScale;
uniform float uSymetry; // expected to be in [0, 1]
uniform float uMaxDetails; 

// [0,0] should be the center of the canvas
// [-1,1]^2 should be the biggest square that fits the canvas
varying vec2 vUv;
#if WATCHMEN_MODE==0
varying vec2 vCanvasUV; // in [-1,1]^2
#endif //WATCHMEN_MODE==0

// returns a random in [-0.5, 0.5]^3, centered on {0}^3
vec3 random(vec3 i) {
    // the seeds are arbitrary values that look good
    const vec3 seed1 = vec3(31.06, 19.86, 30.19);
    const vec3 seed2 = vec3(6640, 5790.4, 10798.861);

    return fract(sin(dot(i, seed1)) * seed2) - 0.5;
}

// returns a value in [-0.5, 0.5]
float gradientNoise(const vec3 coords)
{
    vec3 floorCoords = floor(coords);
    vec3 fractCoords = fract(coords);

    vec3 coords000 = floorCoords + vec3(0,0,0);
    vec3 coords001 = floorCoords + vec3(0,0,1);
    vec3 coords010 = floorCoords + vec3(0,1,0);
    vec3 coords011 = floorCoords + vec3(0,1,1);
    vec3 coords100 = floorCoords + vec3(1,0,0);
    vec3 coords101 = floorCoords + vec3(1,0,1);
    vec3 coords110 = floorCoords + vec3(1,1,0);
    vec3 coords111 = floorCoords + vec3(1,1,1);

    vec3 gradient000 = random(coords000);
    vec3 gradient001 = random(coords001);
    vec3 gradient010 = random(coords010);
    vec3 gradient011 = random(coords011);
    vec3 gradient100 = random(coords100);
    vec3 gradient101 = random(coords101);
    vec3 gradient110 = random(coords110);
    vec3 gradient111 = random(coords111);

    float noise000 = dot(gradient000, coords - coords000);
    float noise001 = dot(gradient001, coords - coords001);
    float noise010 = dot(gradient010, coords - coords010);
    float noise011 = dot(gradient011, coords - coords011);
    float noise100 = dot(gradient100, coords - coords100);
    float noise101 = dot(gradient101, coords - coords101);
    float noise110 = dot(gradient110, coords - coords110);
    float noise111 = dot(gradient111, coords - coords111);

    // Quintic Hermite interpolation
    vec3 coefficients = fractCoords*fractCoords*fractCoords*(fractCoords*(6.0 * fractCoords - 15.0) + 10.0);

    float noiseX00 = mix(noise000, noise100, coefficients.x);
    float noiseX01 = mix(noise001, noise101, coefficients.x);
    float noiseX10 = mix(noise010, noise110, coefficients.x);
    float noiseX11 = mix(noise011, noise111, coefficients.x);

    float noiseXX0 = mix(noiseX00, noiseX10, coefficients.y);
    float noiseXX1 = mix(noiseX01, noiseX11, coefficients.y);

    float noiseXXX = mix(noiseXX0, noiseXX1, coefficients.z);

    return noiseXXX;
}

// returns a random value centered on 0
float layeredNoise(const vec3 coords)
{
    float result = 0.0;

    float amplitude = 0.5;
    float scale = 2.5;

    
    for (int i = 0; i < 5; i++)
    {
        float noise = gradientNoise(coords * scale);
        result += amplitude * noise * smoothstep(0.0, 1.0, uMaxDetails - float(i));

        amplitude *= 0.5;
        scale *= 2.3;
    }

    return result;
}

float computeInkIntensity(vec2 uv, float noiseMask)
{
    uv *= uScale;

    const float SEED = #INJECT(SEED); // injected at compile time

    vec3 coordsRorschach = vec3(uv.x, uv.y + SEED, 0.02 * uTime);
    coordsRorschach.x = abs(coordsRorschach.x); // horizontal symetry
    float noiseRorschach = layeredNoise(coordsRorschach) + 0.5;

    // weaker additional noise to break the symetry
    vec3 coordsSupport = vec3(uv, 0.001 * uTime);
    float noiseSupport = gradientNoise(coordsSupport * 25.0);
    float noiseSupportFactor = 0.03 + 0.08 * (1.0 - smoothstep(0.0, 0.08, abs(uv.x)));
    noiseSupportFactor *= 1.0 - uSymetry;

    float inkNoise = noiseRorschach + noiseSupportFactor * noiseSupport - noiseMask;
    return smoothstep(-uSharpness, 0.0, inkNoise - uThreshold);
}

void main(void)
{
#if WATCHMEN_MODE==1
    const vec3 backgroundColor = vec3(1);
    const vec3 inkColor = vec3(0.1);

    // adjust UV grid to the face of Rorschach, so that [-1,1]^2 fits the whole head
    vec2 inkUV = 2.0 * (vUv - 0.0);
    inkUV.x *= 1.0 + 0.2 * smoothstep(0.0, 0.2, inkUV.x); // the head is slightly looking to its left, so offset the grid
    inkUV /= 1.0 + (1.0 - 3.0 * vUv.x * vUv.x); // the head is a 3D object, so bend the grid to fit its shape

    float noiseMask = smoothstep(0.4, 2.0, abs(inkUV.x)) + smoothstep(0.7, 1.5, -inkUV.y) + smoothstep(-0.05, 1.0, inkUV.y); // less noise on the ears, jaw and forehead

#else // WATCHMEN_MODE!=1
    const vec3 backgroundColor = vec3(.996, 0.985, 0.97);
    const vec3 inkColor = vec3(.1, .1, .2);

    float noiseMask = smoothstep(0.6, 2.0, max(abs(vCanvasUV.x), abs(vCanvasUV.y))); // less noise near the canvas border
    vec2 inkUV = vUv;

#endif // WATCHMEN_MODE

    float inkIntensity = computeInkIntensity(inkUV, noiseMask);
    vec3 color = mix(backgroundColor, inkColor, inkIntensity);

    gl_FragColor = vec4(color, 1.0);
}
