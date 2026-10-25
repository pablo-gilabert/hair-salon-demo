# The Perfect Cut — Hair Salon Website

A responsive, bilingual website concept for a modern hair salon and barbershop. Built with React, TypeScript, Vite and CSS Modules, this portfolio project explores editorial layouts, accessible interactions and a reusable, maintainable component architecture.

> **Portfolio demonstration.** The business identity, pricing, schedule and contact details are illustrative. The inquiry form does not transmit or persist personal information, and the website does not include a real booking backend.

## Features

- Three fully responsive pages: Home, Pricing and Contact.
- Spanish and English interface content, including service descriptions, image alternative text and form feedback.
- Dark and light appearance with consistent semantic color tokens.
- Persistent language and theme preferences using `localStorage`.
- Hero slideshow, service catalog, category deep links and interactive inquiry form.
- Images optimized as WebP and included in the repository.
- Client-side navigation using React Router, with Vercel SPA rewrites.
- Accessible form labels, navigation states, meaningful alt text and reduced-motion support.

## Technology

| Area | Technology |
| --- | --- |
| UI | React, TypeScript |
| Build tooling | Vite |
| Routing | React Router |
| Styling | CSS Modules, CSS custom properties |
| Internationalization | Typed English/Spanish translation dictionaries |
| Preferences | `localStorage` (theme and language only) |
| Deployment | Vercel or another static hosting provider |

## Project structure

```text
public/
├── flags/                  # SVG flags for the language selector
└── images/                 # Original WebP imagery
src/
├── components/
│   ├── BookingForm/
│   ├── DisplayControls/
│   ├── Footer/
│   └── Navbar/
├── context/
│   └── DisplayContext.tsx  # Shared language/theme state and preferences
├── data/
│   └── Services.ts         # Typed catalog with bilingual service records
├── i18n/
│   ├── English.ts
│   ├── Spanish.ts
│   └── Translations.ts    # Compile-time checked translation keys
├── pages/
│   ├── Contact/
│   ├── Home/
│   └── Pricing/
├── styles/
│   └── Global.css          # Reset and semantic theme tokens
├── App.tsx
└── Main.tsx
```

Page and component folders pair a PascalCase `.tsx` file with a matching `.module.css` stylesheet. Shared data, state, and locale dictionaries live outside the presentation layer. Code, identifiers and documentation are written in English; visitor-facing content is available in Spanish and English.

## Getting started

**Prerequisites:** a recent Node.js release compatible with Vite 8 and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. The site defaults to Spanish and dark appearance.

```bash
npm run typecheck
npm run build
npm run preview
```

`npm install` generates `package-lock.json` if it is not already present. Commit the generated lockfile so your future builds can use `npm ci` deterministically.

## How localization works

The dictionary keys are defined by `src/i18n/Spanish.ts`. `English.ts` implements the same set, checked by TypeScript through `src/i18n/Translations.ts`. Components consume translations via the `useDisplay()` hook. The catalog keeps identifiers and prices language-independent while localizing service names, descriptions and image alternative text.

Changing the language also updates the document's `lang` attribute and route titles. Language and theme preferences are preserved between visits in `localStorage`; form input stays only in React component memory.

## Themes and styling

`src/styles/Global.css` defines semantic tokens for primary text, backgrounds, panels, borders, form colors and the footer. Scoped component styles use those variables rather than duplicating unrelated theme overrides. High-contrast text is retained over photographic hero overlays in both modes.

CSS declarations use four-space indentation and one property per line. Responsive breakpoints remain near the related styles.

## Deployment

The root `vercel.json` configures fallback routing for the client-side SPA. Vercel should detect Vite automatically:

- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`
- Environment variables: none

For deployment details, see [`DEPLOY.md`](./DEPLOY.md).

## Scope and limitations

This is a frontend portfolio demo. The sample prices are illustrative, the address is not a real salon location, and submitting the contact form only displays a local confirmation. A production project would need a real booking platform or backend, appropriate handling of personal data, operational monitoring and deployment configuration suited to a paying client.

## Credits

The visual direction was inspired by the community Figma concept *Hair Salon Web Design*. All information representing the fictional business is included for demonstration purposes.
