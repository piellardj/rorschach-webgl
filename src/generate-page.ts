import * as fs from "fs";
import * as fse from "fs-extra";
import * as path from "path";
import { Demopage } from "webpage-templates";

const data = {
    title: "Rorschach",
    description: "Generation of Rorschach-like inkblots with WebGL.",
    introduction: [
        "PLACEHOLDER INTRODUCTION"
    ],
    githubProjectName: "rorschach-webgl",
    additionalLinks: [],
    styleFiles: [
        "css/main.css"
    ],
    scriptFiles: [
        "script/main.min.js"
    ],
    indicators: [],
    canvas: {
        width: 512,
        height: 512,
        enableFullscreen: true
    },
    controlsSections: [
        {
            title: "Parameters",
            controls: [
                {
                    type: Demopage.supportedControls.Range,
                    title: "Speed",
                    id: "speed-range-id",
                    min: 0,
                    max: 10,
                    value: 1,
                    step: 0.1
                },
                {
                    type: Demopage.supportedControls.Range,
                    title: "Sharpness",
                    id: "sharpness-range-id",
                    min: 0,
                    max: 1,
                    value: 0.95,
                    step: 0.01
                },
                {
                    type: Demopage.supportedControls.Range,
                    title: "Density",
                    id: "density-range-id",
                    min: 0,
                    max: 1,
                    value: 0.5,
                    step: 0.01
                },
                {
                    type: Demopage.supportedControls.Range,
                    title: "Symetry",
                    id: "symetry-range-id",
                    min: 0.5,
                    max: 0.5,
                    value: 0.5,
                    step: 0.01
                },
                {
                    type: Demopage.supportedControls.Range,
                    title: "Scale",
                    id: "scale-range-id",
                    min: 0.5,
                    max: 10,
                    value: 1,
                    step: 0.5
                },
                {
                    type: Demopage.supportedControls.Range,
                    title: "Details",
                    id: "details-range-id",
                    min: 1,
                    max: 5,
                    value: 4.5,
                    step: 0.01
                },
                {
                    type: Demopage.supportedControls.Checkbox,
                    title: "Watchmen",
                    id: "watchmen-mode-checkbox-id",
                    checked: true
                },
                {
                    type: Demopage.supportedControls.Checkbox,
                    title: "High DPI",
                    id: "high-dpi-checkbox-id",
                    checked: false
                },
            ],
        }
    ]
};

const SRC_DIR = path.resolve(__dirname);
const DEST_DIR = path.resolve(__dirname, "..", "docs");
const minified = true;

const buildResult = Demopage.build(data, DEST_DIR, {
    debug: !minified,
});

// disable linting on this file because it is generated
buildResult.pageScriptDeclaration = "/* tslint:disable */\n" + buildResult.pageScriptDeclaration;

const SCRIPT_DECLARATION_FILEPATH = path.join(SRC_DIR, "ts", "page-interface-generated.ts");
fs.writeFileSync(SCRIPT_DECLARATION_FILEPATH, buildResult.pageScriptDeclaration);

fse.copySync(path.join(SRC_DIR, "shaders"), path.join(DEST_DIR, "shaders"));
fse.copySync(path.join(SRC_DIR, "resources"), path.join(DEST_DIR, "resources"));
fse.copySync(path.join(SRC_DIR, "css", "main.css"), path.join(DEST_DIR, "css", "main.css"));
