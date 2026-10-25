import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useSearchParams } from "react-router";

import { useDisplay } from "../../context/DisplayContext";
import { useSalon } from "../../context/SalonContext";
import { adminTranslate } from "../../i18n/AdminTranslations";
import { dateRange, availableSlots, workingHours } from "../../lib/SalonScheduling";
import styles from "./BookingForm.module.css";

type FormState = {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    message: string;
};

const EmptyForm: FormState = { firstName: "", lastName: "", phone: "", email: "", message: "" };

// The booking form writes to the same localStorage-backed demo calendar as the admin panel.
export default function BookingForm() {
    const [searchParams] = useSearchParams();
    const { database, book } = useSalon();
    const { language, t } = useDisplay();
    const a = (key: Parameters<typeof adminTranslate>[1]) => adminTranslate(language, key);
    const requestedCategory = searchParams.get("servicio");
    const firstCategory = database.categories.find((category) => category.bookingValue === requestedCategory) ?? database.categories[0];
    const [categoryId, setCategoryId] = useState(firstCategory?.id ?? "");
    const category = database.categories.find((item) => item.id === categoryId) ?? database.categories[0];
    const [serviceId, setServiceId] = useState(category?.services[0]?.id ?? "");
    const chosenService = category?.services.find((service) => service.id === serviceId) ?? category?.services[0];
    const upcomingDays = useMemo(() => dateRange(21), []);
    const [date, setDate] = useState(() => upcomingDays.find((day) => workingHours(database, day).isOpen) ?? upcomingDays[0]!);
    const [time, setTime] = useState("");
    const [form, setForm] = useState<FormState>(EmptyForm);
    const [feedback, setFeedback] = useState<"success" | "invalid" | "unavailable" | null>(null);
    const times = chosenService ? availableSlots(database, date, chosenService.duration) : [];

    const update = (field: keyof FormState, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
        setFeedback(null);
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!chosenService) return setFeedback("invalid");
        const result = book({
            date,
            time,
            serviceId: chosenService.id,
            customerName: `${form.firstName} ${form.lastName}`.trim(),
            customerPhone: form.phone,
            customerEmail: form.email,
            note: form.message,
        });
        if (!result.ok) return setFeedback(result.reason);
        setFeedback("success");
        setTime("");
        setForm(EmptyForm);
    };

    return (
        <form className={styles.form} onSubmit={submit}>
            <p className={styles.eyebrow}>{t("contact.write")}</p>
            <h2 className={styles.heading}>{a("customerBookingTitle")}</h2>
            <p className={styles.lead}>{a("customerBookingHint")}</p>

            {/* The public service catalog responds immediately to admin additions and removals. */}
            <fieldset className={styles.services}>
                <legend>{t("form.interest")}</legend>
                <div className={styles.options}>
                    {database.categories.map((item) => (
                        <button key={item.id} type="button" aria-pressed={category?.id === item.id} className={category?.id === item.id ? styles.selected : ""}
                            onClick={() => { setCategoryId(item.id); setServiceId(item.services[0]?.id ?? ""); setTime(""); setFeedback(null); }}>
                            {item.label[language]}
                        </button>
                    ))}
                </div>
            </fieldset>
            <div className={styles.bookingGrid}>
                <label>{a("selectService")}
                    <select required value={chosenService?.id ?? ""} onChange={(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { setServiceId(event.target.value); setTime(""); setFeedback(null); }}>
                        {(category?.services ?? []).map((service) => <option key={service.id} value={service.id}>{service.name[language]} · {service.duration} min</option>)}
                    </select>
                </label>
                <label>{a("selectDay")}
                    <select required value={date} onChange={(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { setDate(event.target.value); setTime(""); setFeedback(null); }}>
                        {upcomingDays.map((day) => <option key={day} value={day} disabled={!workingHours(database, day).isOpen}>{day} {workingHours(database, day).isOpen ? "" : `· ${a("closed")}`}</option>)}
                    </select>
                </label>
                <label>{a("selectTime")}
                    <select value={time} required onChange={(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { setTime(event.target.value); setFeedback(null); }}>
                        <option value="">{a("chooseTime")}</option>
                        {times.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                    </select>
                </label>
            </div>
            {chosenService && <p className={styles.demoNote}>{a("serviceDuration")}: {chosenService.duration} min</p>}
            {!times.length && <p className={styles.demoNote}>{a("noSlots")}</p>}

            <div className={styles.fields}>
                <label>{t("form.firstName")}
                    <input name="firstName" autoComplete="given-name" required maxLength={80} value={form.firstName} onChange={(event: ChangeEvent<HTMLInputElement>) => update("firstName", event.target.value)} placeholder={t("form.firstPlaceholder")} />
                </label>
                <label>{t("form.lastName")}
                    <input name="lastName" autoComplete="family-name" required maxLength={80} value={form.lastName} onChange={(event: ChangeEvent<HTMLInputElement>) => update("lastName", event.target.value)} placeholder={t("form.lastPlaceholder")} />
                </label>
                <label>{t("form.phone")}
                    <input name="phone" type="tel" autoComplete="tel" minLength={6} maxLength={25} required value={form.phone} onChange={(event: ChangeEvent<HTMLInputElement>) => update("phone", event.target.value)} placeholder="11 1234 5678" />
                </label>
                <label>{t("form.email")}
                    <input name="email" type="email" autoComplete="email" required maxLength={140} value={form.email} onChange={(event: ChangeEvent<HTMLInputElement>) => update("email", event.target.value)} placeholder={t("form.emailPlaceholder")} />
                </label>
            </div>
            <label className={styles.message}>{t("form.message")}
                <textarea name="message" rows={3} maxLength={1000} value={form.message} onChange={(event: ChangeEvent<HTMLTextAreaElement>) => update("message", event.target.value)} placeholder={t("form.messagePlaceholder")} />
            </label>
            <button className={styles.submit} type="submit" disabled={!chosenService || !time}>{a("saveBooking")} <span aria-hidden="true">↗</span></button>
            {feedback && <p role="status" className={styles.result}>{a(feedback === "success" ? "bookingSubmitted" : feedback === "unavailable" ? "bookingConflict" : "bookingInvalid")}</p>}
            <p className={styles.demoNote}>{a("bookingDisclaimer")}</p>
        </form>
    );
}
