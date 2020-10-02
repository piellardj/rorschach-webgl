import * as GLCanvas from "./gl-utils/gl-canvas";
import { gl } from "./gl-utils/gl-canvas";
import { Viewport } from "./gl-utils/viewport";
import * as ShaderManager from "./gl-utils/shader-manager";
import { Shader } from "./gl-utils/shader";
import { VBO } from "./gl-utils/vbo";

import "./page-interface-generated";

function main(): void {
    let shader: Shader;

    function clearCanvas(): void {
        GLCanvas.adjustSize();
        Viewport.setFullCanvas(gl);

        shader.u["uAspectRatio"].value = Page.Canvas.getAspectRatio();
        shader.bindUniforms();

        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    function mainLoop(): void {
        clearCanvas();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        requestAnimationFrame(mainLoop);
    }

    if (!GLCanvas.initGL()) {
        return;
    }
    gl.clearColor(0, 1, 0, 1);

    Page.Canvas.showLoader(true);
    ShaderManager.buildShader(
        {
            fragmentFilename: "rorschach.frag",
            vertexFilename: "rorschach.vert",
            injected: {},
        },
        (builtShader: Shader | null) => {
            if (builtShader !== null) {
                shader = builtShader;
                shader.a["aCoords"].VBO = VBO.createQuad(gl, -1, -1, 1, 1);
                shader.use();
                shader.bindAttributes();

                Page.Canvas.showLoader(false);
                requestAnimationFrame(mainLoop);
            } else {
                Page.Demopage.setErrorMessage("shaders-loading", "Failed to load shaders.");
            }
        },
    );
}

main();