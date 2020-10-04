import "./page-interface-generated";

let htmlElement: HTMLElement = null;
let isAttached = false;

function createElementIfNeeded(): void {
    if (htmlElement === null) {
        htmlElement = document.createElement("div");
        htmlElement.id = "rorschach-face";
    }
}

function setVisibility(visible: boolean): void {
    if (isAttached !== visible) {
        createElementIfNeeded();

        const canvasContainer = Page.Canvas.getCanvasContainer();
        if (!isAttached) {
            canvasContainer.appendChild(htmlElement);
        } else {
            canvasContainer.removeChild(htmlElement);
        }
        isAttached = visible;
    }
}

export { setVisibility }
