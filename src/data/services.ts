import type { Language } from "../i18n/Translations";

// Service information is modeled once, with localized display content and shared prices.
type LocalizedText = Record<Language, string>;

export type Service = {
    id: string;
    name: LocalizedText;
    description: LocalizedText;
    price: number;
    duration: number;
};

export type ServiceCategory = {
    id: string;
    bookingValue: string;
    label: LocalizedText;
    intro: LocalizedText;
    image: string;
    imageAlt: LocalizedText;
    services: Service[];
};

export const ServiceCategories: ServiceCategory[] = [
    {
        id: "cortes",
        bookingValue: "cut",
        label: { es: "Cortes & peinados", en: "Haircuts & styling" },
        intro: { es: "Para cada estilo, una forma de hacerlo único.", en: "Every style deserves a personal touch." },
        image: "/images/cut-mens.webp",
        imageAlt: { es: "Corte masculino moderno con degradado", en: "Modern men's fade haircut" },
        services: [
            { id: "classic-cut", name: { es: "Corte clásico", en: "Classic haircut" }, description: { es: "Asesoramiento, corte y terminación", en: "Consultation, haircut and finishing" }, price: 8000, duration: 60 },
            { id: "wash-cut", name: { es: "Corte + lavado", en: "Haircut + wash" }, description: { es: "Lavado relajante y corte personalizado", en: "Relaxing wash and personalized haircut" }, price: 9500, duration: 60 },
            { id: "child-cut", name: { es: "Corte infantil", en: "Children's haircut" }, description: { es: "Hasta 12 años", en: "Up to 12 years old" }, price: 7000, duration: 60 },
            { id: "beard", name: { es: "Perfilado de barba", en: "Beard shaping" }, description: { es: "Definición y acabado", en: "Shaping and finishing" }, price: 5000, duration: 60 },
            { id: "waves", name: { es: "Brushing & ondas", en: "Blowout & waves" }, description: { es: "Peinado para cualquier ocasión", en: "Styling for any occasion" }, price: 9000, duration: 60 },
        ],
    },
    {
        id: "coloracion",
        bookingValue: "color",
        label: { es: "Coloración", en: "Hair color" },
        intro: { es: "Matices que iluminan y expresan tu personalidad.", en: "Shades that brighten and express your personality." },
        image: "/images/hair-color.webp",
        imageAlt: { es: "Cabello largo con balayage y ondas doradas", en: "Long balayage hair with golden waves" },
        services: [
            { id: "full-color", name: { es: "Color completo", en: "Full color" }, description: { es: "Tono uniforme de raíz a puntas", en: "Even color from roots to ends" }, price: 18000, duration: 120 },
            { id: "highlights", name: { es: "Reflejos", en: "Highlights" }, description: { es: "Luz y profundidad", en: "Light and dimension" }, price: 20000, duration: 120 },
            { id: "balayage", name: { es: "Balayage", en: "Balayage" }, description: { es: "Degradado natural hecho a medida", en: "Custom natural-looking color blend" }, price: 22000, duration: 120 },
            { id: "toning", name: { es: "Matización", en: "Hair toning" }, description: { es: "Revitalizá el tono", en: "Refresh your shade" }, price: 12000, duration: 90 },
        ],
    },
    {
        id: "tratamientos",
        bookingValue: "treatment",
        label: { es: "Tratamientos", en: "Treatments" },
        intro: { es: "Un ritual de cuidado para un cabello saludable.", en: "A nourishing ritual for healthy hair." },
        image: "/images/hair-treatment.webp",
        imageAlt: { es: "Tratamiento capilar en bacha de peluquería", en: "Hair treatment at a salon wash station" },
        services: [
            { id: "hydration", name: { es: "Hidratación profunda", en: "Deep hydration" }, description: { es: "Nutrición y brillo", en: "Nourishment and shine" }, price: 10000, duration: 60 },
            { id: "repair", name: { es: "Reconstrucción capilar", en: "Hair repair" }, description: { es: "Fortaleza y suavidad", en: "Strength and softness" }, price: 12000, duration: 90 },
            { id: "botox", name: { es: "Botox capilar", en: "Hair botox treatment" }, description: { es: "Control del frizz", en: "Frizz control" }, price: 15000, duration: 90 },
            { id: "straightening", name: { es: "Alisado progresivo", en: "Progressive straightening" }, description: { es: "Acabado liso de larga duración", en: "Long-lasting smooth finish" }, price: 18000, duration: 120 },
        ],
    },
];

// All prices are illustrative; retain the source currency for both interface languages.
export function FormatPrice(price: number, language: Language): string {
    return new Intl.NumberFormat(language === "es" ? "es-AR" : "en-US", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(price);
}
