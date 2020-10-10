import "./page-interface-generated";

/* === IDs ============================================================ */
const controlId = {
    TIME: "time-checkbox-id",
    SPEED: "speed-range-id",
    SHARPNESS: "sharpness-range-id",
    DENSITY: "density-range-id",
    WATCHMEN_MODE: "watchmen-mode-checkbox-id",
    HIGH_DPI: "high-dpi-checkbox-id",
    SCALE: "scale-range-id",
    SYMETRY: "symetry-range-id",
    DETAILS: "details-range-id"
};


Page.Controls.setVisibility(controlId.HIGH_DPI, window.devicePixelRatio > 1);

function safePow(x: number, p: number): number {
    if (x <= 0) {
        return 0;
    } else if (x >= 1) {
        return 1;
    }
    return Math.pow(x, p);
}

abstract class Parameters {
    public static get speed(): number {
        return Page.Range.getValue(controlId.SPEED);
    }

    public static addSpeedChangeObserver(callback: (newSpeed: number) => unknown): void {
        Page.Range.addObserver(controlId.SPEED, callback);
    }

    public static get sharpness(): number {
        const rawValue = Page.Range.getValue(controlId.SHARPNESS);
        return safePow(rawValue, 0.05);
    }

    public static get density(): number {
        const rawValue = Page.Range.getValue(controlId.DENSITY);

        if (rawValue < 0.5) {
            return 0.5 *safePow(2 * rawValue, 0.1);
        } else {
            return 1 - 0.5 * safePow(2 - 2 * rawValue, 0.05);
        }
    }

    public static get watchmenMode(): boolean {
        return Page.Checkbox.isChecked(controlId.WATCHMEN_MODE);
    }
    public static addWatchmenModeChange(callback: (enabled: boolean) => unknown): void {
        Page.Checkbox.addObserver(controlId.WATCHMEN_MODE, callback);
    }

    public static get supportHighDPI(): boolean {
        return Page.Checkbox.isChecked(controlId.HIGH_DPI);
    }

    public static addResizeObserver(callback: () => unknown): void {
        Page.Checkbox.addObserver(controlId.HIGH_DPI, callback);
        Page.Canvas.Observers.canvasResize.push(callback);
    }

    public static get scale(): number {
        return Page.Range.getValue(controlId.SCALE);
    }

    public static get symetry(): number {
        return 2 * Page.Range.getValue(controlId.SYMETRY) - 1;
    }

    public static get details(): number {
        return Page.Range.getValue(controlId.DETAILS);
    }
}

export {
    Parameters,
}
