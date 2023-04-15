import * as fs from "fs";
import * as fse from "fs-extra";
import * as path from "path";
import { Demopage } from "webpage-templates";

const data = {
    title: "Rorschach",
    description: "Generation of Rorschach-like inkblots with WebGL.",
    introduction: [
        "The Rorschach test is a projective test relying on the interpretation of symmetrical images made of random inkblots.",
        "Rorschach is also the most horrifying and fascinating character of the Watchmen comics, hiding behind an ever-changing mask to become a moral judge instead of acknowledging his own issues with violence.",
        "This is my attempt at recreating these patterns on GPU using WebGL, by computing a 3D multiscale gradient noise and thresholding it."
    ],
    githubProjectName: "rorschach-webgl",
    readme: {
        filepath: path.join(__dirname, "..", "README.md"),
        branchName: "master"
    },
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
            title: "Simulation",
            controls: [
                {
                    type: Demopage.supportedControls.Tabs,
                    title: "Mode",
                    id: "mode-tabs-id",
                    unique: true,
                    options: [
                        {
                            label: "Classic",
                            value: "0",
                            checked: false,
                        },
                        {
                            label: "Watchmen",
                            value: "1",
                            checked: true,
                        },
                    ]
                },
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
                    title: "Scale",
                    id: "scale-range-id",
                    min: 0.5,
                    max: 10,
                    value: 1,
                    step: 0.5
                },
                {
                    type: Demopage.supportedControls.Checkbox,
                    title: "High DPI",
                    id: "high-dpi-checkbox-id",
                    checked: true
                },
            ]
        },
        {
            title: "Appearance",
            controls: [
                {
                    type: Demopage.supportedControls.Range,
                    title: "Details",
                    id: "details-range-id",
                    min: 1,
                    max: 5,
                    value: 3.75,
                    step: 0.01
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
                    title: "Symmetry",
                    id: "symetry-range-id",
                    min: 0.5,
                    max: 1.0,
                    value: 0.5,
                    step: 0.01
                },
                {
                    type: Demopage.supportedControls.ColorPicker,
                    title: "Background",
                    id: "background-color-id",
                    defaultValueHex: "#F6ED98"
                }
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
