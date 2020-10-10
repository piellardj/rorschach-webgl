import { gl } from "./gl-utils/gl-canvas";
import { Shader } from "./gl-utils/shader";
import * as ShaderManager from "./gl-utils/shader-manager";
import { VBO } from "./gl-utils/vbo";

const shadersList: Shader[] = [null, null];

enum EMode {
    CLASSIC = 0, // index of this shader in the array
    WATCHMEN = 1, // index of this shader in the array
}
let currentMode: EMode | null = null;

const randomScalar = Math.random() * 200 - 100;

function loadShaderInternal(mode: EMode, vertexFilename: string, vbo: VBO, callback: (success: boolean) => unknown): void {
    ShaderManager.buildShader(
        {
            fragmentFilename: "rorschach.frag",
            vertexFilename,
            injected: {
                SEED: randomScalar.toString(),
                WATCHMEN_MODE_ID: (mode === EMode.WATCHMEN) ? "1" : "0",
            },
        }, (builtShader: Shader | null) => {
            if (builtShader !== null) {
                builtShader.a["aCoords"].VBO = vbo;
                shadersList[mode] = builtShader;
                callback(true);
            } else {
                const errorId = `shader-loading-${mode}`;
                Page.Demopage.setErrorMessage(errorId, `Failed to load/build the shader for the mode '${mode}'.`);
                callback(false);
            }
        }
    );
}

function loadShaders(callback: (success: boolean) => unknown): void {
    let totalSuccess = true;
    function loadedShaderCallback(success: boolean): void {
        totalSuccess = totalSuccess && success;

        let allFinished = true;
        for (const shader of shadersList) {
            if (shader === null) {
                allFinished = false;
            }
        }

        if (allFinished) {
            callback(totalSuccess);
        }
    }

    const classicModeVBO = VBO.createQuad(gl, -1, -1, 1, 1); // redraw the whole canvas
    loadShaderInternal(EMode.CLASSIC, "classic-mode.vert", classicModeVBO, loadedShaderCallback);

    const watchmenModeVBO = VBO.createQuad(gl, -.6, -.95, .6, .2); // only draw the portion of canvas that is visibile through the SVG
    loadShaderInternal(EMode.WATCHMEN, "watchmen-mode.vert", watchmenModeVBO, loadedShaderCallback);
}

/** Returns true if the shader was changed */
function enableShader(mode: EMode): boolean {
    if (currentMode !== mode) {
        currentMode = mode;
        shadersList[currentMode].use();
        shadersList[currentMode].bindAttributes();
        return true;
    }
    return false;
}

function getCurrentShader(): Shader {
    return shadersList[currentMode];
}

export {
    EMode,
    enableShader,
    getCurrentShader,
    loadShaders,
};
