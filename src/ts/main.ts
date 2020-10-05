import * as GLCanvas from "./gl-utils/gl-canvas";
import { gl } from "./gl-utils/gl-canvas";
import { Viewport } from "./gl-utils/viewport";
import { Shader } from "./gl-utils/shader";

import { Parameters } from "./parameters";
import { getTime } from "./time";
import * as RorschachFace from "./rorschach-face";
import * as ShaderPicker from "./shader-picker";

import "./page-interface-generated";

function main(): void {
    if (!GLCanvas.initGL()) {
        return;
    }

    function adjustToCanvasSize(shader: Shader): void {
        GLCanvas.adjustSize();
        Viewport.setFullCanvas(gl);

        const aspectRatio = Page.Canvas.getAspectRatio();
        if (aspectRatio >= 1) {
            shader.u["uCoordsAdjustment"].value = [aspectRatio, 1];
        } else if (aspectRatio < 1) {
            shader.u["uCoordsAdjustment"].value = [1, 1 / aspectRatio];
        }
    }

    let canvasSizeChanged = true;
    Page.Canvas.Observers.canvasResize.push(() => canvasSizeChanged = true);

    function mainLoop(): void {
        const currentMode = Parameters.watchmenMode ? ShaderPicker.EMode.WATCHMEN : ShaderPicker.EMode.CLASSIC;
        const shaderChanged = ShaderPicker.enableShader(currentMode);

        const currentShader = ShaderPicker.getCurrentShader();

        if (canvasSizeChanged || shaderChanged) {
            adjustToCanvasSize(currentShader);
            canvasSizeChanged = false;
        }

        currentShader.u["uTime"].value = Parameters.time ? getTime() : 0;
        currentShader.u["uSharpness"].value = Parameters.sharpness;
        currentShader.u["uThreshold"].value = 1 - Parameters.density;
        currentShader.bindUniforms();

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        requestAnimationFrame(mainLoop);
    }

    function enableWatchmenMode(enabled: boolean): void {
        RorschachFace.setVisibility(enabled);
    }
    Parameters.addWatchmenModeChange(enableWatchmenMode);

    Page.Canvas.showLoader(true);
    ShaderPicker.loadShaders((success: boolean) => {
        if (success) {
            Page.Canvas.showLoader(false);
            enableWatchmenMode(Parameters.watchmenMode);
            requestAnimationFrame(mainLoop);
        } else {
            Page.Demopage.setErrorMessage("shaders-loading", "Failed to load shaders.");
        }
    });
}

main();
