import { type ChangeEvent, useState, type FormEvent } from "react";

import { useDisplay } from "../../context/DisplayContext";
import { useSalon } from "../../context/SalonContext";
import { adminTranslate } from "../../i18n/AdminTranslations";
import { FormatPrice, type Service } from "../../data/services";
import styles from "./AdminServices.module.css";

type ServiceDraft = {
    id: string;
    categoryId: string;
    nameEs: string;
    nameEn: string;
    descriptionEs: string;
    descriptionEn: string;
    price: number;
    duration: number;
};

function createEmptyDraft(categoryId: string): ServiceDraft {
    return { id: "", categoryId, nameEs: "", nameEn: "", descriptionEs: "", descriptionEn: "", price: 0, duration: 60 };
}

// All edits are applied to the shared local browser catalog, never to a remote service.
export default function AdminServices() {
    const { database, upsertService, deleteService, resetDemo } = useSalon();
    const { language } = useDisplay();
    const a = (key: Parameters<typeof adminTranslate>[1]) => adminTranslate(language, key);
    const [draft, setDraft] = useState<ServiceDraft | null>(null);
    const [message, setMessage] = useState("");

    const edit = (categoryId: string, service: Service) => {
        setDraft({ id: service.id, categoryId, nameEs: service.name.es, nameEn: service.name.en, descriptionEs: service.description.es, descriptionEn: service.description.en, price: service.price, duration: service.duration });
        setMessage("");
    };

    const save = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!draft) return;
        upsertService(draft.categoryId, {
            id: draft.id || crypto.randomUUID(),
            name: { es: draft.nameEs.trim(), en: draft.nameEn.trim() },
            description: { es: draft.descriptionEs.trim(), en: draft.descriptionEn.trim() },
            price: draft.price,
            duration: draft.duration,
        });
        setMessage(a("serviceSaved"));
        setDraft(null);
    };

    return (
        <div className={styles.page}>
            <span className={styles.kicker}>{a("demoTag")}</span>
            <h1>{a("catalogTitle")}</h1>
            <p className={styles.description}>{a("catalogHint")}</p>

            {database.categories.map((category) => (
                <section key={category.id} className={styles.group}>
                    <div className={styles.groupHeader}>
                        <h2>{category.label[language]}</h2>
                        <button type="button" onClick={() => { setDraft(createEmptyDraft(category.id)); setMessage(""); }}>{a("newService")} +</button>
                    </div>
                    {category.services.length ? category.services.map((service) => (
                        <div key={service.id} className={styles.service}>
                            <div><strong>{service.name[language]}</strong><small>{service.description[language]}</small></div>
                            <span className={styles.price}>{FormatPrice(service.price, language)}</span>
                            <span className={styles.duration}>{service.duration} min</span>
                            <button type="button" onClick={() => edit(category.id, service)}>{a("editService")}</button>
                            <button type="button" className={styles.delete} onClick={() => { if (window.confirm(a("deleteQuestion"))) deleteService(category.id, service.id); }}>{a("deleteService")}</button>
                        </div>
                    )) : <p>{a("noServices")}</p>}
                </section>
            ))}

            {draft && (
                <section className={styles.editor}>
                    <div className={styles.groupHeader}><h2>{a(draft.id ? "editService" : "newService")}</h2><button type="button" onClick={() => setDraft(null)}>×</button></div>
                    <form onSubmit={save} className={styles.form}>
                        <label>{a("category")}
                            <select value={draft.categoryId} onChange={(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setDraft({ ...draft, categoryId: event.target.value })}>
                                {database.categories.map((category) => <option key={category.id} value={category.id}>{category.label[language]}</option>)}
                            </select>
                        </label>
                        <label>{a("serviceNameEs")}<input required maxLength={100} value={draft.nameEs} onChange={(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setDraft({ ...draft, nameEs: event.target.value })} /></label>
                        <label>{a("serviceNameEn")}<input required maxLength={100} value={draft.nameEn} onChange={(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setDraft({ ...draft, nameEn: event.target.value })} /></label>
                        <label>{a("descriptionEs")}<input maxLength={250} value={draft.descriptionEs} onChange={(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setDraft({ ...draft, descriptionEs: event.target.value })} /></label>
                        <label>{a("descriptionEn")}<input maxLength={250} value={draft.descriptionEn} onChange={(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setDraft({ ...draft, descriptionEn: event.target.value })} /></label>
                        <label>{a("price")}<input type="number" min={0} step={100} required value={draft.price} onChange={(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setDraft({ ...draft, price: Number(event.target.value) })} /></label>
                        <label>{a("minutes")}
                            <select value={draft.duration} onChange={(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setDraft({ ...draft, duration: Number(event.target.value) })}>
                                {[30, 60, 90, 120, 150, 180, 210, 240, 300, 360, 420, 480].map((minute) => <option key={minute} value={minute}>{minute} min</option>)}
                            </select>
                        </label>
                        <div className={styles.formActions}>
                            <button type="submit">{a("saveService")}</button>
                            <button type="button" onClick={() => setDraft(null)}>{a("discard")}</button>
                        </div>
                    </form>
                </section>
            )}
            {message && <p className={styles.message} role="status">{message}</p>}
            <div className={styles.reset}>
                <p>{a("browserOnly")}</p>
                <button type="button" onClick={() => { if (window.confirm(a("resetQuestion"))) { resetDemo(); setMessage(a("saved")); setDraft(null); } }}>{a("reset")}</button>
            </div>
        </div>
    );
}
