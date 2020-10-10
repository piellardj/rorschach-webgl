# rorschach-webgl

## Description
The Rorschach test is a projective test relying on the interpretation of symmetrical images made of random inkblots.

Rorschach is also the most horrifying and fascinating character of the Watchmen comics, hiding behind an ever-changing mask to pose as a moral judge instead of acknowledging his own issues with violence.

This is my attempt at recreating these patterns on GPU using WebGL, by computing a 3D multiscale gradient noise and thresholding it.

See it live [here](https://piellardj.github.io/rorschach-webgl?page%3Acanvas%3Afullscreen=true).

![Screenshot](src\readme\screenshot.png)

## Details

### Base idea

In this simulation Rorshach patterns are obtained by first computing a noise texture, and then changing the contrast and luminosity of this texture.

![Raw noise](src\readme\noise-raw.jpg)
*Noise raw*

![Thresholded noise](src\readme\noise-threshold.jpg)
*Noise with threshold*

To make the patterns roughly symmetrical, I centered the coordinates origin on the middle of the canvas and use the absolute value of the *x* component. I think that a perfect symmetry doesn't look too good because it creates a very sharp vertical "fold" on the center. To weaken this fold, I add another asymmetrical noise on top of the first one.

Since the patterns need to change continuously over time, I actually compute a 3D noise and slowly move the 2D screen through the third dimension.

### Noise computing

The noise is computed fully on GPU. It is the sum of several gradient noises of descending frequencies and amplitudes.

Generating randomness on the GPU is tricky because there is no native way or API. I chose to use a R<sup>3</sup> ↦ R<sup>3</sup> hash function: two inputs that are close will give very different results that look random. I give as inputs to this function the spacial position and time. The resulting randomness is of very poor quality but it is sufficient for the needs of this simulation.

The 3D noise is computed on a regular grid, so to evaluate it at a given coordinates, I need to interpolate between the 8 values from the corners of the englobing cube. Using a simplex grid is in theory cheaper, because it would only need to interpolate between 4 values (corners of the englobing tetrahedron). However I thought the performance gain was not worth decreasing the readability of the code.

The interpolation is performed using a Quintic Hermit curve *6x<sup>5</sup> - 15x<sup>4</sup> + 10x<sup>3</sup>* instead of the simple Hermit interpolation of glsl's smoothstep *3x<sup>2</sup> - 2x<sup>3</sup>* because it gives nicer results visually.

![Thresholded noise](src\readme\interpolation.png)
*Quintic Hermit (blue) and simple Hermit (red)*

### Watchmen mode

The Watchmen mode is only a cosmetic variation of the classic mode. Rorschach's face is an semi-transparent SVG displayed on top of the canvas.

A human face is a 3D object and since the patterns are on the mask, they need to fit the global geometry of the character's head. I thought that using real 3D was too complex for this because the geometry is static and because it would require creating a 3D model, projecting it etc. I found that just deforming the 2D space to create a pseudo-3D was enough to create a pleasing effect. Here is what the transformation looks like:

![Starting grid](src\readme\grid_01_flat.png)
*Starting grid*

![Deformed grid](src\readme\grid_02_deformed.png)
*Deformed grid*

![Final grid](src\readme\grid_03_face.png)
*Deformed grid + head*