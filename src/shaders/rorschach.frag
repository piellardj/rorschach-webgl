precision lowp float;

uniform float uTime;
uniform float uSharpness; // expected to be in [0, 1]
uniform float uThreshold; // expected to be in [0, 1]

varying vec2 vUv;

// returns a value in [-0.5, 0.5]^3
vec3 random(vec3 i) {
    // the seeds are arbitrary values that look good
    const vec3 seed1 = vec3(31.06, 19.86, 30.19);
    const vec3 seed2 = vec3(6640, 5790.4, 10798.861);

    return fract(sin(dot(i, seed1)) * seed2) - 0.5;
}

// returns a value in [-0.5, 0.5]
float gradientNoise(vec3 coords, float scale)
{
    coords *= scale;

    vec3 floorCoords = floor(coords);
    vec3 ceilCoords = ceil(coords);
    vec3 fractCoords = fract(coords);
    vec3 coefficients = smoothstep(0.0, 1.0, fractCoords);

    vec3 coords000 = floorCoords;
    vec3 coords001 = vec3(floorCoords.xy, ceilCoords.z);
    vec3 coords010 = vec3(floorCoords.x, ceilCoords.y, floorCoords.z);
    vec3 coords011 = vec3(floorCoords.x, ceilCoords.yz);
    vec3 coords100 = vec3(ceilCoords.x, floorCoords.yz);
    vec3 coords101 = vec3(ceilCoords.x, floorCoords.y, ceilCoords.z);
    vec3 coords110 = vec3(ceilCoords.xy, floorCoords.z);
    vec3 coords111 = ceilCoords;

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

    float noiseX00 = mix(noise000, noise100, coefficients.x);
    float noiseX01 = mix(noise001, noise101, coefficients.x);
    float noiseX10 = mix(noise010, noise110, coefficients.x);
    float noiseX11 = mix(noise011, noise111, coefficients.x);

    float noiseXX0 = mix(noiseX00, noiseX10, coefficients.y);
    float noiseXX1 = mix(noiseX01, noiseX11, coefficients.y);

    float noiseXXX = mix(noiseXX0, noiseXX1, coefficients.z);

    return noiseXXX;
}

float layeredNoise(vec3 coords)
{
    float result = 0.0;

    float amplitude = 0.5;
    float scale = 5.0;

    for (int i = 0; i < 5; i++)
    {
        float noise = gradientNoise(coords, scale);
        result += amplitude * noise;

        amplitude *= 0.5;
        scale *= 2.0;
    }

    return result;
}

void main(void)
{
    const vec3 backgroundColor = vec3(1);
    const vec3 inkColor = vec3(0);

    // horizontal symmetry
    vec2 uv = vUv;
    uv.x = abs(uv.x - 0.5) + 0.5;
    vec3 coords = vec3(uv, 0.1 * uTime);

    float noise = layeredNoise(coords) + 0.5;
    float ink = smoothstep(uSharpness * uThreshold, uThreshold, noise);

    vec3 color = mix(backgroundColor, inkColor, ink);

    gl_FragColor = vec4(color, 1.0);
}