import { type ChangeEvent, useState } from "react";

import { useSalon } from "../../context/SalonContext";
import { useDisplay } from "../../context/DisplayContext";
import { toMinutes } from "../../lib/SalonScheduling";
import { adminTranslate } from "../../i18n/AdminTranslations";
import type { OpeningHours, Weekday } from "../../data/SalonTypes";
import styles from "./AdminHours.module.css";

const Days: Weekday[] = [1, 2, 3, 4, 5, 6, 0];

// Each weekday can be opened/closed or given its own opening and closing times.
export default function AdminHours() {
    const { database, setHours } = useSalon();
    const { language } = useDisplay();
    const a = (key: Parameters<typeof adminTranslate>[1]) => adminTranslate(language, key);
    const [message, setMessage] = useState("");
    const [drafts, setDrafts] = useState(database.hours);

    const update = (day: Weekday, patch: Partial<OpeningHours>) => {
        setDrafts((current) => ({ ...current, [day]: { ...current[day], ...patch } }));
        setMessage("");
    };

    const save = () => {
        if (Days.some((day) => drafts[day].isOpen && (drafts[day].start >= drafts[day].end || toMinutes(drafts[day].start) % 30 !== 0 || toMinutes(drafts[day].end) % 30 !== 0))) return setMessage(a("invalidHours"));
        Days.forEach((day) => setHours(day, drafts[day]));
        setMessage(a("hoursSaved"));
    };

    return (
        <div className={styles.page}>
            <span className={styles.kicker}>{a("demoTag")}</span>
            <h1>{a("scheduleTitle")}</h1>
            <p className={styles.description}>{a("scheduleHint")}</p>
            <div className={styles.rows}>
                {Days.map((day) => (
                    <div key={day} className={styles.row}>
                        <strong>{a(`weekday${day}`)}</strong>
                        <label className={styles.toggle}>
                            <input type="checkbox" checked={drafts[day].isOpen} onChange={(event: ChangeEvent<HTMLInputElement>) => update(day, { isOpen: event.target.checked })} />
                            {drafts[day].isOpen ? a("enabled") : a("closed")}
                        </label>
                        <label>{a("open")}<input type="time" step={1800} value={drafts[day].start} disabled={!drafts[day].isOpen} onChange={(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => update(day, { start: event.target.value })} /></label>
                        <label>{a("close")}<input type="time" step={1800} value={drafts[day].end} disabled={!drafts[day].isOpen} onChange={(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => update(day, { end: event.target.value })} /></label>
                    </div>
                ))}
            </div>
            <div className={styles.actions}>
                <button type="button" onClick={save}>{a("saveHours")}</button>
                {message && <p role="status">{message}</p>}
            </div>
            <p className={styles.note}>{a("existingBookings")}</p>
        </div>
    );
}
