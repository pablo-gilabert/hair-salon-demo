import { ServiceCategories } from "./services";
import type { SalonBooking, SalonDatabase, Weekday } from "./SalonTypes";

// Seed appointments are fictional examples relative to the visitor's current date.
export function dateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function dateFromKey(value: string): Date {
    const [year = 0, month = 1, day = 1] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
}

export function addDays(value: string, days: number): string {
    const date = dateFromKey(value);
    date.setDate(date.getDate() + days);
    return dateKey(date);
}

function nextWorkingDays(count: number): string[] {
    const result: string[] = [];
    let day = addDays(dateKey(new Date()), 1);
    while (result.length < count) {
        if (dateFromKey(day).getDay() !== 0) result.push(day);
        day = addDays(day, 1);
    }
    return result;
}

export function createSalonSeed(): SalonDatabase {
    const [first, second, third] = nextWorkingDays(3);
    const now = new Date().toISOString();
    const sample = (id: string, date: string, time: string, serviceId: string, duration: number, customerName: string, customerPhone: string, depositPaid: boolean): SalonBooking => ({
        id,
        date,
        time,
        serviceId,
        duration,
        customerName,
        customerPhone,
        customerEmail: "",
        note: "",
        depositPaid,
        status: "confirmed",
        createdAt: now,
    });

    return {
        version: 1,
        categories: structuredClone(ServiceCategories),
        hours: {
            0: { isOpen: false, start: "09:00", end: "18:00" },
            1: { isOpen: true, start: "09:00", end: "20:00" },
            2: { isOpen: true, start: "09:00", end: "20:00" },
            3: { isOpen: true, start: "09:00", end: "20:00" },
            4: { isOpen: true, start: "09:00", end: "20:00" },
            5: { isOpen: true, start: "09:00", end: "20:00" },
            6: { isOpen: true, start: "09:00", end: "18:00" },
        } satisfies Record<Weekday, { isOpen: boolean; start: string; end: string }>,
        bookings: [
            sample("demo-booking-1", first!, "10:00", "classic-cut", 60, "Valentina López", "+54 11 5555-0101", true),
            sample("demo-booking-2", second!, "14:30", "balayage", 120, "Martín Fernández", "+54 11 5555-0102", false),
            sample("demo-booking-3", third!, "11:00", "hydration", 60, "Camila Torres", "+54 11 5555-0103", true),
        ],
    };
}
