import "./page-interface-generated";

/* === IDs ============================================================ */
const controlId = {
    TIME: "time-checkbox-id",
    SHARPNESS: "sharpness-range-id",
    DENSITY: "density-range-id",
};

abstract class Parameters {
    public static get time(): boolean {
        return Page.Checkbox.isChecked(controlId.TIME);
    }

    public static get sharpness(): number {
        return Page.Range.getValue(controlId.SHARPNESS);
    }

    public static get density(): number {
        return Page.Range.getValue(controlId.DENSITY);
    }
}

export {
    Parameters,
}
