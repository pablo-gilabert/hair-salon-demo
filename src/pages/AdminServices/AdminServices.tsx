import { useDisplay } from "../../context/DisplayContext";
import { useSalon } from "../../context/SalonContext";
import { type Service, FormatPrice } from "../../data/services";
import { adminTranslate } from "../../i18n/AdminTranslations";
import { confirmAction, openEditor, showAlert } from "../../lib/SalonAlerts";
import styles from "./AdminServices.module.css";

// Bilingual service edits are handled in one modal and shared with the public catalog.
export default function AdminServices() {
    const { database, upsertService, deleteService, resetDemo } = useSalon();
    const { language } = useDisplay();
    const a = (key: Parameters<typeof adminTranslate>[1]) => adminTranslate(language, key);

    const editService = async (categoryId: string, existing?: Service) => {
        const values = await openEditor({
            title: a(existing ? "editService" : "newService"),
            confirmText: a("saveService"),
            cancelText: a("discard"),
            invalidText: a("bookingInvalid"),
            fields: [
                {
                    name: "categoryId", label: a("category"), kind: "select", value: categoryId, wide: true,
                    options: database.categories.map((category) => ({ value: category.id, label: category.label[language] })),
                },
                { name: "nameEs", label: a("serviceNameEs"), value: existing?.name.es ?? "", required: true, maxLength: 100 },
                { name: "nameEn", label: a("serviceNameEn"), value: existing?.name.en ?? "", required: true, maxLength: 100 },
                { name: "descriptionEs", label: a("descriptionEs"), kind: "textarea", value: existing?.description.es ?? "", maxLength: 250 },
                { name: "descriptionEn", label: a("descriptionEn"), kind: "textarea", value: existing?.description.en ?? "", maxLength: 250 },
                { name: "price", label: a("price"), kind: "number", value: existing?.price ?? 0, min: 0, step: 100, required: true },
                {
                    name: "duration", label: a("minutes"), kind: "select", value: existing?.duration ?? 60,
                    options: [30, 60, 90, 120, 150, 180, 210, 240, 300, 360, 420, 480]
                        .map((duration) => ({ value: String(duration), label: `${duration} min` })),
                },
            ],
            validate: (draft) => {
                if (!String(draft.nameEs).trim() || !String(draft.nameEn).trim()) return a("bookingInvalid");
                if (!Number.isFinite(Number(draft.price)) || Number(draft.price) < 0) return a("bookingInvalid");
                return null;
            },
        });

        if (!values) return;
        const service: Service = {
            id: existing?.id ?? crypto.randomUUID(),
            name: { es: String(values.nameEs).trim(), en: String(values.nameEn).trim() },
            description: { es: String(values.descriptionEs).trim(), en: String(values.descriptionEn).trim() },
            price: Number(values.price),
            duration: Number(values.duration),
        };
        upsertService(String(values.categoryId), service);
        await showAlert(a("serviceSaved"));
    };

    // Deleting a service does not erase the historical bookings linked to its ID.
    const removeService = async (categoryId: string, service: Service) => {
        const accepted = await confirmAction({
            title: a("deleteService"),
            text: `${service.name[language]}. ${a("deleteQuestion")}`,
            confirmText: a("remove"),
            cancelText: a("discard"),
            destructive: true,
        });
        if (!accepted) return;
        deleteService(categoryId, service.id);
        await showAlert(a("saved"));
    };

    const reset = async () => {
        const accepted = await confirmAction({
            title: a("reset"),
            text: a("resetQuestion"),
            confirmText: a("reset"),
            cancelText: a("discard"),
            destructive: true,
        });
        if (!accepted) return;
        resetDemo();
        await showAlert(a("saved"));
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
                        <button type="button" onClick={() => void editService(category.id)}>{a("newService")} +</button>
                    </div>
                    {category.services.length ? category.services.map((service) => (
                        <div key={service.id} className={styles.service}>
                            <div>
                                <strong>{service.name[language]}</strong>
                                <small>{service.description[language]}</small>
                            </div>
                            <span className={styles.price}>{FormatPrice(service.price, language)}</span>
                            <span className={styles.duration}>{service.duration} min</span>
                            <button type="button" onClick={() => void editService(category.id, service)}>{a("editService")}</button>
                            <button type="button" className={styles.delete} onClick={() => void removeService(category.id, service)}>{a("deleteService")}</button>
                        </div>
                    )) : <p>{a("noServices")}</p>}
                </section>
            ))}

            <div className={styles.reset}>
                <p>{a("browserOnly")}</p>
                <button type="button" onClick={() => void reset()}>{a("reset")}</button>
            </div>
        </div>
    );
}
