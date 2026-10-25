import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { createSalonSeed } from "../data/SalonSeed";
import type { BookingRequest, BookingResult, OpeningHours, SalonBooking, SalonDatabase, Weekday } from "../data/SalonTypes";
import { findService, isAvailable } from "../lib/SalonScheduling";
import type { Service, ServiceCategory } from "../data/services";

const STORAGE_KEY = "perfect-cut-salon-demo-v1";
const SESSION_KEY = "perfect-cut-admin-demo-session";

// These sample credentials are deliberately bundled into the frontend: this is NOT secure authentication.
export const DEMO_ADMIN = { email: "admin@demo.salon", password: "Demo2026!" } as const;

type SalonContextValue = {
    database: SalonDatabase;
    loggedIn: boolean;
    login: (email: string, password: string) => boolean;
    logout: () => void;
    book: (details: BookingRequest) => BookingResult;
    updateBooking: (id: string, patch: Partial<Pick<SalonBooking, "depositPaid" | "status" | "customerName" | "customerPhone" | "note">>) => void;
    addBooking: (details: BookingRequest, paid: boolean) => BookingResult;
    editBooking: (id: string, details: BookingRequest, paid: boolean) => BookingResult;
    deleteBooking: (id: string) => void;
    setHours: (day: Weekday, hours: OpeningHours) => void;
    upsertService: (categoryId: string, service: Service) => void;
    deleteService: (categoryId: string, serviceId: string) => void;
    resetDemo: () => void;
};

const SalonContext = createContext<SalonContextValue | null>(null);

// Minimal schema validation avoids crashing the public site on damaged/stale local data.
function loadDatabase(): SalonDatabase {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return createSalonSeed();
        const parsed: unknown = JSON.parse(stored);
        if (typeof parsed !== "object" || parsed === null) return createSalonSeed();
        const value = parsed as Partial<SalonDatabase>;
        if (value.version !== 1 || !Array.isArray(value.categories) || !Array.isArray(value.bookings) || !value.hours || !Object.values(value.hours).every((h) => h && typeof h.start === "string" && typeof h.end === "string" && typeof h.isOpen === "boolean")) return createSalonSeed();
        if (!value.categories.every((category: ServiceCategory) => Array.isArray(category.services))) return createSalonSeed();
        return value as SalonDatabase;
    } catch {
        return createSalonSeed();
    }
}

function readSession(): boolean {
    try {
        return sessionStorage.getItem(SESSION_KEY) === "signed-in";
    } catch {
        return false;
    }
}

// Salon state is shared by the public catalog, booking flow, and protected demo routes.
export function SalonProvider({ children }: { children: ReactNode }) {
    const [database, setDatabase] = useState<SalonDatabase>(loadDatabase);
    const [loggedIn, setLoggedIn] = useState(readSession);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
        } catch {
            // Browsers with restricted storage can still try the in-memory demonstration.
        }
    }, [database]);

    const login = (email: string, password: string): boolean => {
        if (email.trim().toLowerCase() !== DEMO_ADMIN.email || password !== DEMO_ADMIN.password) return false;
        setLoggedIn(true);
        try { sessionStorage.setItem(SESSION_KEY, "signed-in"); } catch { /* Session lasts only in React memory. */ }
        return true;
    };

    const logout = () => {
        setLoggedIn(false);
        try { sessionStorage.removeItem(SESSION_KEY); } catch { /* Storage is optional in the demo. */ }
    };

    // Validate the entire interval again at submission to prevent overlapping reservations.
    const addBooking = (details: BookingRequest, depositPaid: boolean): BookingResult => {
        const service = findService(database, details.serviceId);
        if (!service || !details.customerName.trim() || !details.customerPhone.trim()) return { ok: false, reason: "invalid" };
        if (!isAvailable(database, details.date, details.time, service.duration)) return { ok: false, reason: "unavailable" };
        const booking: SalonBooking = {
            ...details,
            customerName: details.customerName.trim(),
            customerPhone: details.customerPhone.trim(),
            customerEmail: details.customerEmail.trim(),
            note: details.note.trim(),
            id: crypto.randomUUID(),
            duration: service.duration,
            depositPaid,
            status: "confirmed",
            createdAt: new Date().toISOString(),
        };
        setDatabase((previous) => ({ ...previous, bookings: [...previous.bookings, booking] }));
        return { ok: true };
    };

    // Admin edits re-check overlap and duration before updating a confirmed appointment.
    const editBooking = (id: string, details: BookingRequest, depositPaid: boolean): BookingResult => {
        const existing = database.bookings.find((booking) => booking.id === id);
        const service = findService(database, details.serviceId);
        if (!existing || !service || !details.customerName.trim() || !details.customerPhone.trim()) return { ok: false, reason: "invalid" };
        const scheduleChanged = details.date !== existing.date || details.time !== existing.time
            || details.serviceId !== existing.serviceId || service.duration !== existing.duration;
        if (existing.status === "confirmed" && scheduleChanged && !isAvailable(database, details.date, details.time, service.duration, id)) {
            return { ok: false, reason: "unavailable" };
        }
        setDatabase((previous) => ({
            ...previous,
            bookings: previous.bookings.map((booking) => booking.id === id ? {
                ...booking,
                ...details,
                customerName: details.customerName.trim(),
                customerPhone: details.customerPhone.trim(),
                customerEmail: details.customerEmail.trim(),
                note: details.note.trim(),
                duration: service.duration,
                depositPaid,
            } : booking),
        }));
        return { ok: true };
    };

    const updateBooking = (id: string, patch: Partial<Pick<SalonBooking, "depositPaid" | "status" | "customerName" | "customerPhone" | "note">>) => {
        setDatabase((previous) => ({ ...previous, bookings: previous.bookings.map((booking) => booking.id === id ? { ...booking, ...patch } : booking) }));
    };

    const deleteBooking = (id: string) => {
        setDatabase((previous) => ({ ...previous, bookings: previous.bookings.filter((booking) => booking.id !== id) }));
    };

    const setHours = (day: Weekday, hours: OpeningHours) => {
        if (hours.isOpen && hours.start >= hours.end) return;
        setDatabase((previous) => ({ ...previous, hours: { ...previous.hours, [day]: hours } }));
    };

    const upsertService = (categoryId: string, service: Service) => {
        if (!service.name.es.trim() || !service.name.en.trim() || service.price < 0 || service.duration < 30 || service.duration > 480 || service.duration % 30 !== 0) return;
        setDatabase((previous) => ({
            ...previous,
            categories: previous.categories.map((category) => {
                if (category.id !== categoryId) {
                    return { ...category, services: category.services.filter((entry) => entry.id !== service.id) };
                }
                return {
                    ...category,
                    services: category.services.some((entry) => entry.id === service.id)
                        ? category.services.map((entry) => entry.id === service.id ? service : entry)
                        : [...category.services, service],
                };
            }),
        }));
    };

    const deleteService = (categoryId: string, serviceId: string) => {
        setDatabase((previous) => ({
            ...previous,
            categories: previous.categories.map((category) => category.id === categoryId ? {
                ...category,
                services: category.services.filter((service) => service.id !== serviceId),
            } : category),
        }));
    };

    const resetDemo = () => setDatabase(createSalonSeed());

    const value = useMemo<SalonContextValue>(() => ({
        database, loggedIn, login, logout,
        book: (details) => addBooking(details, false),
        addBooking, editBooking, updateBooking, deleteBooking, setHours, upsertService, deleteService, resetDemo,
    // Local event handlers are recreated intentionally; the context is re-rendered on changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [database, loggedIn]);

    return <SalonContext.Provider value={value}>{children}</SalonContext.Provider>;
}

export function useSalon(): SalonContextValue {
    const value = useContext(SalonContext);
    if (!value) throw new Error("useSalon requires SalonProvider");
    return value;
}
