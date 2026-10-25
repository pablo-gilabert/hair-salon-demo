import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "../styles/SalonAlerts.css";

// These types describe browser-only modal fields without introducing a second React form state.
export type AlertValue = string | boolean;
export type AlertValues = Record<string, AlertValue>;
export type AlertOption = { value: string; label: string };
export type AlertField = {
    name: string;
    label: string;
    kind?: "text" | "tel" | "email" | "number" | "date" | "time" | "select" | "textarea" | "checkbox";
    value?: AlertValue | number;
    options?: AlertOption[];
    required?: boolean;
    min?: number;
    max?: number;
    step?: number;
    maxLength?: number;
    wide?: boolean;
};

type EditorOptions = {
    title: string;
    fields: AlertField[];
    confirmText: string;
    cancelText: string;
    invalidText: string;
    validate?: (values: AlertValues) => string | null;
    onOpen?: (form: HTMLDivElement) => void;
};

type ConfirmOptions = {
    title: string;
    text: string;
    confirmText: string;
    cancelText: string;
    destructive?: boolean;
};

// The same appearance adapts to the website's semantic dark/light color tokens.
export const AlertClasses = {
    popup: "salonAlertPopup",
    confirmButton: "salonAlertConfirm",
    cancelButton: "salonAlertCancel",
    htmlContainer: "salonAlertContent",
};

export function createAlertOption(value: string, label: string): HTMLOptionElement {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    return option;
}

// Render DOM controls instead of interpolating client data into raw HTML strings.
function createControl(field: AlertField): HTMLElement {
    const label = document.createElement("label");
    label.className = `salonAlertField${field.wide ? " salonAlertWide" : ""}`;

    if (field.kind === "checkbox") {
        label.classList.add("salonAlertCheckbox");
    }

    const title = document.createElement("span");
    title.textContent = field.label;

    let control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

    if (field.kind === "select") {
        const select = document.createElement("select");
        field.options?.forEach(({ value, label: text }) => select.add(createAlertOption(value, text)));
        control = select;
    } else if (field.kind === "textarea") {
        const textarea = document.createElement("textarea");
        textarea.rows = 3;
        control = textarea;
    } else {
        const input = document.createElement("input");
        input.type = field.kind === "checkbox" ? "checkbox" : field.kind ?? "text";
        if (field.kind === "checkbox") input.checked = field.value === true;
        if (field.min !== undefined) input.min = String(field.min);
        if (field.max !== undefined) input.max = String(field.max);
        if (field.step !== undefined) input.step = String(field.step);
        control = input;
    }

    control.name = field.name;
    control.id = `salon-alert-${field.name}`;
    control.required = field.required ?? false;
    if (field.maxLength !== undefined && (control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement)) {
        control.maxLength = field.maxLength;
    }
    if (field.kind !== "checkbox") control.value = String(field.value ?? "");

    if (field.kind === "checkbox") {
        label.append(control, title);
    } else {
        label.append(title, control);
    }

    return label;
}

function readValues(form: HTMLElement): AlertValues {
    const values: AlertValues = {};
    form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("[name]").forEach((control) => {
        values[control.name] = control instanceof HTMLInputElement && control.type === "checkbox"
            ? control.checked
            : control.value;
    });
    return values;
}

// All editor modals validate before they close. Cancel and Escape never mutate the database.
export async function openEditor(options: EditorOptions): Promise<AlertValues | null> {
    const form = document.createElement("div");
    form.className = "salonAlertGrid";
    options.fields.forEach((field) => form.append(createControl(field)));

    const result = await Swal.fire({
        title: options.title,
        html: form,
        width: "min(94vw, 680px)",
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonText: options.confirmText,
        cancelButtonText: options.cancelText,
        buttonsStyling: false,
        customClass: AlertClasses,
        focusConfirm: false,
        didOpen: () => options.onOpen?.(form),
        preConfirm: () => {
            const elements = Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("[name]"));
            if (elements.some((element) => !element.checkValidity())) {
                Swal.showValidationMessage(options.invalidText);
                return false;
            }
            const values = readValues(form);
            const problem = options.validate?.(values);
            if (problem) {
                Swal.showValidationMessage(problem);
                return false;
            }
            return values;
        },
    });

    return result.isConfirmed && result.value && typeof result.value === "object" ? result.value as AlertValues : null;
}

// Irreversible actions use a real confirmation rather than window.confirm().
export async function confirmAction(options: ConfirmOptions): Promise<boolean> {
    const result = await Swal.fire({
        title: options.title,
        text: options.text,
        icon: options.destructive ? "warning" : "question",
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonText: options.confirmText,
        cancelButtonText: options.cancelText,
        buttonsStyling: false,
        customClass: {
            ...AlertClasses,
            confirmButton: options.destructive ? "salonAlertDanger" : "salonAlertConfirm",
        },
    });
    return result.isConfirmed;
}

// Informational messages use the same visual language and never block the admin page.
export async function showAlert(title: string, icon: "success" | "error" | "info" = "success"): Promise<void> {
    await Swal.fire({
        title,
        icon,
        timer: icon === "success" ? 1700 : undefined,
        showConfirmButton: icon !== "success",
        buttonsStyling: false,
        customClass: AlertClasses,
    });
}
