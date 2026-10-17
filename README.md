# The Perfect Cut — Peluquería Demo

Sitio web ficticio de peluquería y barbería para portfolio, creado con **React 19 + TypeScript + Vite 8 + React Router 7 + CSS Modules**.

## Páginas

- `/` — **Inicio**: portada con slider, presentación, beneficios, servicios, horarios y galería.
- `/precios` — **Precios**: servicios agrupados por cortes, coloración y tratamientos con precios de ejemplo en ARS.
- `/contacto` — **Contacto**: formulario interactivo, información del salón ficticio y enlaces internos.

## Cómo integrarlo a tu repositorio actual

1. Descargá el archivo ZIP y **descomprimilo**.
2. Hacé una copia de seguridad de los archivos que ya modificaste en tu repositorio `peluqueria-demo` (especialmente `src`, `index.html` y `package.json`).
3. Copiá **el contenido** de la carpeta `peluqueria-demo-completo/` descomprimida a la **raíz** de tu repositorio local `peluqueria-demo/`, aceptando reemplazar los archivos del ejemplo inicial. No copies otra carpeta contenedora adentro del repositorio.
4. Abrí una terminal dentro de `peluqueria-demo/` y ejecutá:

   ```bash
   npm install
   npm run dev
   ```

5. Abrí la dirección que muestre Vite (normalmente `http://localhost:5173`).

Para verificar una compilación de producción:

```bash
npm run build
npm run preview
```

### Si preferís probarlo sin tocar tu repositorio

Abrí una terminal dentro de la carpeta `peluqueria-demo-completo/` descomprimida, ejecutá `npm install` y después `npm run dev`. Es un proyecto Vite completo e independiente.

## Estructura

```text
peluqueria-demo-completo/
├── public/
│   ├── favicon.svg
│   └── images/                # Fotografías locales creadas a partir de composiciones con IA
├── src/
│   ├── components/
│   │   ├── NavBar/
│   │   ├── BookingForm/
│   │   └── Footer/
│   ├── data/services.ts       # Servicios y precios editables
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Home.module.css
│   │   ├── Pricing.tsx
│   │   ├── Pricing.module.css
│   │   ├── Contact.tsx
│   │   └── Contact.module.css
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── vercel.json
├── package.json
└── README.md
```

## Personalización rápida

- **Servicios / precios:** editá `src/data/services.ts`. Los valores son **ilustrativos**; no son precios verificados de ningún salón.
- **Imágenes:** reemplazá los archivos correspondientes dentro de `public/images/`. Conservá los mismos nombres para no tocar las rutas.
- **Colores:** modificá las variables CSS en `src/index.css` (`--ink`, `--cream`, `--gold`, etc.).
- **Textos:** editá los archivos `Home.tsx`, `Pricing.tsx`, `Contact.tsx` y `Footer.tsx`.
- **Marca:** reemplazá el texto `THE PERFECT CUT` del NavBar y Footer.
- **Formularios:** el componente está en `src/components/BookingForm/BookingForm.tsx`.

## Importante: es una demostración

- **El formulario valida campos y muestra una respuesta local, pero NO envía mensajes ni guarda datos.** Para convertirlo en formulario real, conectalo con un backend, correo o servicio autorizado.
- El nombre comercial, los precios, horarios y la ubicación son **ficticios o ilustrativos**. No representan a un establecimiento real.
- Las fotografías `public/images/*.webp` se crearon recortando elementos fotográficos de composiciones originales generadas con inteligencia artificial para este proyecto. No son trabajos reales ni fotografías de un salón existente.
- Diseño visual inspirado en [Hair Salon Web Design (Community) de Figma](https://www.figma.com/design/yfwSR72U5yeHFziT6wvuw5/Hair-Salon-Web-Design--Community-). Esta es una adaptación funcional mobile-first en español, no una exportación píxel por píxel del archivo original.
- Las fuentes Cormorant Garamond y Montserrat cargan desde Google Fonts. Sin conexión se utilizan las fuentes alternativas declaradas en CSS.

## Responsive

El sitio está diseñado **mobile-first y con escalado fluido**, desde 320 px hasta resoluciones de escritorio anchas (incluyendo 1920 × 1080). Utiliza CSS Grid, Flexbox, `clamp`, y media queries a 1050, 980, 850, 780, 700, 650, 600, 560 y 390 px según el componente.

## Vercel

El archivo `vercel.json` está incluido para reenviar rutas directas (`/precios`, `/contacto`) al `index.html` de la SPA en producción.

Si publicás desde GitHub, seleccioná **Vite** como framework, build command `npm run build` y output directory `dist`.
