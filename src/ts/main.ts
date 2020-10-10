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
    gl.clearColor(0.967, 0.930, 0.608, 1); // same color as the SVG background

    function adjustCanvasSize(): void {
        GLCanvas.adjustSize(Parameters.supportHighDPI);
        Viewport.setFullCanvas(gl);
    }

    function adjustShaderToCanvas(shader: Shader): void {
        const aspectRatio = Page.Canvas.getAspectRatio();
        if (aspectRatio >= 1) {
            shader.u["uCoordsAdjustment"].value = [aspectRatio, 1];
        } else if (aspectRatio < 1) {
            shader.u["uCoordsAdjustment"].value = [1, 1 / aspectRatio];
        }
    }

    let canvasSizeChanged = true;
    Parameters.addResizeObserver(() => canvasSizeChanged = true);

    function mainLoop(): void {
        const currentMode = Parameters.watchmenMode ? ShaderPicker.EMode.WATCHMEN : ShaderPicker.EMode.CLASSIC;
        const shaderChanged = ShaderPicker.enableShader(currentMode);

        const currentShader = ShaderPicker.getCurrentShader();
        if (canvasSizeChanged || shaderChanged) {
            adjustShaderToCanvas(currentShader);
        }
        if (canvasSizeChanged) {
            adjustCanvasSize();
            canvasSizeChanged = false;
        }

        currentShader.u["uTime"].value = getTime();
        currentShader.u["uSharpness"].value = 1 - Parameters.sharpness;
        currentShader.u["uThreshold"].value = 1 - Parameters.density;
        currentShader.u["uScale"].value = Parameters.scale;
        currentShader.u["uSymetry"].value = Parameters.symetry;
        currentShader.u["uMaxDetails"].value = Parameters.details;

        currentShader.bindUniforms();

        if (currentMode === ShaderPicker.EMode.WATCHMEN) { // no need to clear canvas in classic mode because it redraws the whole canvas anyways
            gl.clear(gl.COLOR_BUFFER_BIT);
        }
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        requestAnimationFrame(mainLoop);
    }

    function enableWatchmenMode(enabled: boolean): void {
        RorschachFace.setVisibility(enabled);
    }
    enableWatchmenMode(Parameters.watchmenMode);
    Parameters.addWatchmenModeChange(enableWatchmenMode);

    Page.Canvas.showLoader(true);
    ShaderPicker.loadShaders((success: boolean) => {
        if (success) {
            Page.Canvas.showLoader(false);
            requestAnimationFrame(mainLoop);
        } else {
            Page.Demopage.setErrorMessage("shaders-loading", "Failed to load shaders.");
        }
    });
}

main();
