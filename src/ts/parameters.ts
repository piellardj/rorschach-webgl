import "./page-interface-generated";

/* === IDs ============================================================ */
const controlId = {
    TIME: "time-checkbox-id",
    SPEED: "speed-range-id",
    SHARPNESS: "sharpness-range-id",
    DENSITY: "density-range-id",
    WATCHMEN_MODE: "watchmen-mode-checkbox-id",
};

abstract class Parameters {
    public static get time(): boolean {
        return Page.Checkbox.isChecked(controlId.TIME);
    }

    public static get speed(): number {
        return Page.Range.getValue(controlId.SPEED);
    }

    public static addSpeedChangeObserver(callback: (newSpeed: number) => unknown): void {
        Page.Range.addObserver(controlId.SPEED, callback);
    }

    public static get sharpness(): number {
        return Page.Range.getValue(controlId.SHARPNESS);
    }

    public static get density(): number {
        return Page.Range.getValue(controlId.DENSITY);
    }

    public static get watchmenMode(): boolean {
        return Page.Checkbox.isChecked(controlId.WATCHMEN_MODE);
    }
    public static addWatchmenModeChange(callback: (enabled: boolean) => unknown): void {
        Page.Checkbox.addObserver(controlId.WATCHMEN_MODE, callback);
    }
}

export {
    Parameters,
}
