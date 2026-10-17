export type Service = {
  name: string;
  description: string;
  price: number;
};

export type ServiceCategory = {
  id: string;
  label: string;
  intro: string;
  image: string;
  imageAlt: string;
  services: Service[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: "cortes",
    label: "Cortes & peinados",
    intro: "Para cada estilo, una forma de hacerlo único.",
    image: "/images/cut-mens.webp",
    imageAlt: "Corte masculino moderno con degradado",
    services: [
      { name: "Corte clásico", description: "Asesoramiento, corte y terminación", price: 8000 },
      { name: "Corte + lavado", description: "Lavado relajante y corte personalizado", price: 9500 },
      { name: "Corte infantil", description: "Hasta 12 años", price: 7000 },
      { name: "Perfilado de barba", description: "Definición y acabado", price: 5000 },
      { name: "Brushing & ondas", description: "Peinado para cualquier ocasión", price: 9000 },
    ],
  },
  {
    id: "coloracion",
    label: "Coloración",
    intro: "Matices que iluminan y expresan tu personalidad.",
    image: "/images/hair-color.webp",
    imageAlt: "Cabello largo con balayage y ondas doradas",
    services: [
      { name: "Color completo", description: "Tono uniforme de raíz a puntas", price: 18000 },
      { name: "Reflejos", description: "Luz y profundidad", price: 20000 },
      { name: "Balayage", description: "Degradado natural hecho a medida", price: 22000 },
      { name: "Matización", description: "Revitalizá el tono", price: 12000 },
    ],
  },
  {
    id: "tratamientos",
    label: "Tratamientos",
    intro: "Un ritual de cuidado para un cabello saludable.",
    image: "/images/hair-treatment.webp",
    imageAlt: "Tratamiento capilar en bacha de peluquería",
    services: [
      { name: "Hidratación profunda", description: "Nutrición y brillo", price: 10000 },
      { name: "Reconstrucción capilar", description: "Fortaleza y suavidad", price: 12000 },
      { name: "Botox capilar", description: "Control del frizz", price: 15000 },
      { name: "Alisado progresivo", description: "Acabado liso de larga duración", price: 18000 },
    ],
  },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
