import type { ServiceCategory } from "./services";

// A single typed shape is shared by the public booking form and the administrator area.
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type OpeningHours = {
    isOpen: boolean;
    start: string;
    end: string;
};

export type SalonBooking = {
    id: string;
    date: string;
    time: string;
    serviceId: string;
    duration: number;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    note: string;
    depositPaid: boolean;
    status: "confirmed" | "cancelled";
    createdAt: string;
};

export type SalonDatabase = {
    version: 1;
    categories: ServiceCategory[];
    hours: Record<Weekday, OpeningHours>;
    bookings: SalonBooking[];
};

export type BookingRequest = Pick<SalonBooking, "date" | "time" | "serviceId" | "customerName" | "customerPhone" | "customerEmail" | "note">;

export type BookingResult = { ok: true } | { ok: false; reason: "unavailable" | "invalid" };
