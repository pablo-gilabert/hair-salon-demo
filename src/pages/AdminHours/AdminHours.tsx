import { useDisplay } from "../../context/DisplayContext";
import { useSalon } from "../../context/SalonContext";
import { type OpeningHours, type Weekday } from "../../data/SalonTypes";
import { adminTranslate } from "../../i18n/AdminTranslations";
import { toMinutes } from "../../lib/SalonScheduling";
import { openEditor, showAlert } from "../../lib/SalonAlerts";
import styles from "./AdminHours.module.css";

const Days: Weekday[] = [1, 2, 3, 4, 5, 6, 0];

// The schedule is read-only until an administrator opens a SweetAlert2 editor.
export default function AdminHours() {
    const { database, setHours } = useSalon();
    const { language } = useDisplay();
    const a = (key: Parameters<typeof adminTranslate>[1]) => adminTranslate(language, key);

    // Validate half-hour boundaries before persisting a changed working day.
    const editHours = async (day: Weekday) => {
        const initial = database.hours[day];
        const values = await openEditor({
            title: `${a("editHours")} · ${a(`weekday${day}`)}`,
            confirmText: a("saveHours"),
            cancelText: a("discard"),
            invalidText: a("invalidHours"),
            fields: [
                { name: "isOpen", label: a("enabled"), kind: "checkbox", value: initial.isOpen, wide: true },
                { name: "start", label: a("open"), kind: "time", value: initial.start, required: true },
                { name: "end", label: a("close"), kind: "time", value: initial.end, required: true },
            ],
            onOpen: (form) => {
                const enabled = form.querySelector<HTMLInputElement>('[name="isOpen"]');
                const start = form.querySelector<HTMLInputElement>('[name="start"]');
                const end = form.querySelector<HTMLInputElement>('[name="end"]');
                if (!enabled || !start || !end) return;
                const sync = () => {
                    start.disabled = !enabled.checked;
                    end.disabled = !enabled.checked;
                };
                enabled.addEventListener("change", sync);
                sync();
            },
            validate: (draft) => {
                if (!draft.isOpen) return null;
                const start = String(draft.start);
                const end = String(draft.end);
                if (!/^\d{2}:\d{2}$/.test(start) || !/^\d{2}:\d{2}$/.test(end)) return a("invalidHours");
                if (start >= end || toMinutes(start) % 30 !== 0 || toMinutes(end) % 30 !== 0) return a("invalidHours");
                return null;
            },
        });

        if (!values) return;
        const hours: OpeningHours = {
            isOpen: Boolean(values.isOpen),
            start: String(values.start),
            end: String(values.end),
        };
        setHours(day, hours);
        await showAlert(a("hoursSaved"));
    };

    return (
        <div className={styles.page}>
            <span className={styles.kicker}>{a("demoTag")}</span>
            <h1>{a("scheduleTitle")}</h1>
            <p className={styles.description}>{a("scheduleHint")}</p>

            <div className={styles.rows}>
                {Days.map((day) => {
                    const hours = database.hours[day];
                    return (
                        <div key={day} className={styles.row}>
                            <strong>{a(`weekday${day}`)}</strong>
                            <span className={styles.status}>{hours.isOpen ? a("enabled") : a("closed")}</span>
                            <span className={styles.hours}>{hours.isOpen ? `${hours.start} – ${hours.end}` : "—"}</span>
                            <button type="button" className={styles.editButton} onClick={() => void editHours(day)}>{a("editHours")}</button>
                        </div>
                    );
                })}
            </div>

            <p className={styles.note}>{a("existingBookings")}</p>
        </div>
    );
}
