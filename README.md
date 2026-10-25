# The Perfect Cut — Hair Salon Management Demo

A polished, responsive **hair salon and barbershop website with an integrated administration experience**. This portfolio project pairs a customer-facing service catalog and appointment form with a fully interactive, locally persisted admin dashboard.

Built with **React, TypeScript, Vite, React Router, and CSS Modules**, it demonstrates component-driven UI architecture, controlled forms, browser persistence, bilingual UX, calendar constraints, and responsive design.

> **Portfolio concept, not a production booking platform.** All identities, contact details, opening hours, prices, appointments and customer records are fictional. Login and permissions are client-side simulations. Changes and bookings are only visible inside the same browser profile; there is no server, database, email delivery, real payment processor, or cross-device synchronization. Never use real customer information.

## Experiences

### Public website

- Responsive editorial homepage and photographic carousel.
- Original salon artwork and imagery (included under `public/images`).
- Live service catalog and ARS prices, based on the administrator's locally edited data.
- Contact and booking form with a selected service, date, available start time, name, phone number, optional email and notes.
- Availability generated from weekly opening hours, the selected service's duration, and confirmed bookings; overlapping reservations are rejected.
- Spanish / English interface and dark / light themes, with persistent display preferences.

### Administrator dashboard

- Sample sign-in screen at **`/admin/login`** and admin-only demo routes.
- Day-based booking timeline with available and occupied 30-minute blocks.
- Appointment list showing client name, phone number, time, service, deposit status and notes.
- Mark deposits paid or unpaid, cancel or restore bookings (when the time is still available), create manual appointments, or remove records.
- Edit opening and closing times or mark each weekday as closed.
- Edit service names and descriptions in both languages, prices, and expected durations; add, move or remove services.
- Changes reflect immediately in the same browser's public pricing and availability.
- Optional demo-data reset, including representative seeded appointments on upcoming weekdays.

**Demonstration account**

| Field | Value |
|---|---|
| Email | `admin@demo.salon` |
| Password | `Demo2026!` |

The credentials are deliberately displayed on the login page because this is a **frontend demonstration only**. The client can inspect or change the bundled credentials, or alter the session via browser developer tools. It offers **no real access control** and must not be used to protect customer details.

## Data model and storage

The demo uses an in-memory React context backed by `localStorage`:

- `perfect-cut-salon-demo-v1`: versioned salon data including service categories, bilingual service definitions, prices, durations, seven-day business hours, bookings and deposits.
- `perfect-cut-language` and `perfect-cut-theme`: interface preferences.
- `perfect-cut-admin-demo-session`: simulated signed-in state in `sessionStorage`.

Service and reservation data is loaded from typed sample data on first visit, then stored locally. Other devices, incognito tabs, different browser profiles, or new users **do not share** that state. Clearing site storage removes edits and bookings. No booking notification or payment processing is performed; a `depositPaid` flag is only a manually edited demonstration status.

### Booking logic

- The selectable window covers the upcoming **21 days**.
- Availability is split into **30-minute intervals** and bounded by the configured weekday hours.
- Services have configurable 30–480 minute durations in 30-minute increments.
- Interval-overlap detection prevents two confirmed appointments from occupying the same time.
- Cancelled reservations do not block availability; restoration checks for conflicts.
- Booking records retain the original duration if a service's duration is edited later.

## Code organization

```text
src/
├── components/
│   ├── AdminShell/
│   ├── BookingForm/
│   ├── DisplayControls/
│   ├── Footer/
│   └── Navbar/
├── context/
│   ├── DisplayContext.tsx
│   └── SalonContext.tsx
├── data/
│   ├── SalonSeed.ts
│   ├── SalonTypes.ts
│   └── services.ts
├── i18n/
│   ├── AdminTranslations.ts
│   ├── English.ts
│   ├── Spanish.ts
│   └── Translations.ts
├── lib/
│   └── SalonScheduling.ts
├── pages/
│   ├── AdminDashboard/
│   ├── AdminHours/
│   ├── AdminLogin/
│   ├── AdminServices/
│   ├── Contact/
│   ├── Home/
│   └── Pricing/
├── styles/
├── App.tsx
└── main.tsx
```

Components and page directories contain matching PascalCase `.tsx` and `.module.css` files where styling is needed. Styling uses reusable CSS custom properties, scoped classes, four-space indentation and one CSS property per line. Code identifiers and comments are in English; visible copy is localized.

## Production considerations

A real appointment platform requires server-side authentication and authorization, a shared database, input validation, secure handling of customer information, concurrent booking safeguards, privacy controls, operational monitoring, and actual payment reconciliation. The browser-only demo intentionally omits these services.

**Portfolio status:** fictional brand and content, with independently interactive demo data. No affiliation with an existing salon is implied.
