import { useState, type ChangeEvent, type FormEvent } from "react";
import { useSearchParams } from "react-router";

import { useDisplay } from "../../context/DisplayContext";
import { ServiceCategories } from "../../data/Services";
import styles from "./BookingForm.module.css";

type FormState = {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    message: string;
};

const EmptyForm: FormState = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: "",
};

// Service identifiers are stable even when the visitor changes interface language.
export default function BookingForm() {
    const [searchParams] = useSearchParams();
    const initial = searchParams.get("servicio");
    const initialService = ServiceCategories.some((item) => item.bookingValue === initial)
        ? initial ?? ServiceCategories[0]!.bookingValue
        : ServiceCategories[0]!.bookingValue;

    const [selectedService, setSelectedService] = useState(initialService);
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState<FormState>(EmptyForm);
    const { language, t } = useDisplay();

    // The form stays entirely in browser memory and never sends personal data.
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitted(true);
    };

    const updateField = (field: keyof FormState, value: string) => {
        setSubmitted(false);
        setForm((previous) => ({ ...previous, [field]: value }));
    };

    const selection = ServiceCategories.find((item) => item.bookingValue === selectedService);

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <p className={styles.eyebrow}>{t("contact.write")}</p>
            <h2 className={styles.heading}>{t("form.title")}</h2>
            <p className={styles.lead}>{t("form.desc")}</p>

            <div className={styles.fields}>
                <label>
                    {t("form.firstName")}
                    <input
                        name="firstName"
                        autoComplete="given-name"
                        required
                        maxLength={80}
                        value={form.firstName}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => updateField("firstName", event.target.value)}
                        placeholder={t("form.firstPlaceholder")}
                    />
                </label>
                <label>
                    {t("form.lastName")}
                    <input
                        name="lastName"
                        autoComplete="family-name"
                        required
                        maxLength={80}
                        value={form.lastName}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => updateField("lastName", event.target.value)}
                        placeholder={t("form.lastPlaceholder")}
                    />
                </label>
                <label>
                    {t("form.phone")}
                    <input
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        minLength={6}
                        maxLength={25}
                        required
                        value={form.phone}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => updateField("phone", event.target.value)}
                        placeholder="11 1234 5678"
                    />
                </label>
                <label>
                    {t("form.email")}
                    <input
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        maxLength={140}
                        value={form.email}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => updateField("email", event.target.value)}
                        placeholder={t("form.emailPlaceholder")}
                    />
                </label>
            </div>

            <fieldset className={styles.services}>
                <legend>{t("form.interest")}</legend>
                <div className={styles.options}>
                    {ServiceCategories.map((category) => (
                        <button
                            key={category.id}
                            type="button"
                            aria-pressed={selectedService === category.bookingValue}
                            onClick={() => {
                                setSelectedService(category.bookingValue);
                                setSubmitted(false);
                            }}
                            className={selectedService === category.bookingValue ? styles.selected : ""}
                        >
                            {category.label[language]}
                        </button>
                    ))}
                </div>
            </fieldset>

            <label className={styles.message}>
                {t("form.message")}
                <textarea
                    name="message"
                    rows={3}
                    maxLength={1000}
                    value={form.message}
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) => updateField("message", event.target.value)}
                    placeholder={t("form.messagePlaceholder")}
                />
            </label>

            <button className={styles.submit} type="submit">
                {t("form.submit")} <span aria-hidden="true">↗</span>
            </button>

            {submitted && (
                <p className={styles.result} role="status">
                    {t("form.thanks")} {form.firstName}! {t("form.demoResult")} «{selection?.label[language]}».
                </p>
            )}

            <p className={styles.demoNote}>{t("form.disclaimer")}</p>
        </form>
    );
}
