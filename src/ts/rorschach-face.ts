import { IRGB, Parameters } from "./parameters";

import "./page-interface-generated";

const canvasContainer = Page.Canvas.getCanvasContainer();

const htmlBackgroundElement = document.createElement("div");
htmlBackgroundElement.classList.add("rorschach-face-element");
htmlBackgroundElement.style.visibility = "hidden";
canvasContainer.appendChild(htmlBackgroundElement);

const htmlFaceElement = document.createElement("div");
htmlFaceElement.classList.add("rorschach-face-element");
htmlFaceElement.id = "rorschach-face";
htmlFaceElement.style.visibility = "hidden";
canvasContainer.appendChild(htmlFaceElement);

function getBackgroundForColorAsBase64(color: IRGB): string {
    return window.btoa(
        `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 500 500">
            <path stroke="none" fill="rgb(${color.r}, ${color.g}, ${color.b})" d="M 0,0 H 500 V 500 H 0 Z m 130.47,342.13 c 7.52,60.63 5.80,62.61 44.1,97.1 18.53,16.72 35.18,35.13 68.09,35.13 41.81,5.66 61.98,-20.86 68.18,-26.91 C 361.29,405.75 346.29,398.08 358.13,353.87 400.36,325.70 416.15,164.79 245.25,164.79 84.54,164.79 96.13,332.93 130.47,342.13 Z"/>
        </svg>`
    );
}

function setBackgroundColor(color: IRGB): void {
    const svgBase64 = getBackgroundForColorAsBase64(color);
    htmlBackgroundElement.style.backgroundImage = `url("data:image/svg+xml;base64,${svgBase64}")`;
}

setBackgroundColor(Parameters.backgroundColor);

function setVisibility(visible: boolean): void {
    const visibility = visible ? "" : "hidden";
    htmlFaceElement.style.visibility = visibility;
    htmlBackgroundElement.style.visibility = visibility;
}

export {
    setBackgroundColor,
    setVisibility,
};

