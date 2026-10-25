import { addDays, dateFromKey, dateKey } from "../data/SalonSeed";
import type { SalonBooking, SalonDatabase, Weekday } from "../data/SalonTypes";
import type { Service } from "../data/services";

export const SLOT_STEP_MINUTES = 30;

// Convert the editor's HH:mm format into comparable minute offsets.
export function toMinutes(value: string): number {
    const [hours = 0, minutes = 0] = value.split(":").map(Number);
    return hours * 60 + minutes;
}

export function fromMinutes(value: number): string {
    return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}

export function servicesOf(database: SalonDatabase): Service[] {
    return database.categories.flatMap((category) => category.services);
}

export function findService(database: SalonDatabase, id: string): Service | undefined {
    return servicesOf(database).find((service) => service.id === id);
}

export function workingHours(database: SalonDatabase, date: string) {
    return database.hours[dateFromKey(date).getDay() as Weekday];
}

// An interval overlaps another when each starts before the other ends.
export function overlappingBooking(database: SalonDatabase, date: string, time: string, duration: number, ignoreId?: string): SalonBooking | undefined {
    const start = toMinutes(time);
    const end = start + duration;
    return database.bookings.find((booking) => booking.status === "confirmed" && booking.date === date && booking.id !== ignoreId && start < toMinutes(booking.time) + booking.duration && end > toMinutes(booking.time));
}

export function isAvailable(database: SalonDatabase, date: string, time: string, duration: number, ignoreId?: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time) || duration < 30 || duration > 480 || duration % 30 !== 0) return false;
    if (dateKey(dateFromKey(date)) !== date) return false;
    if (date < dateKey(new Date())) return false;
    const hours = workingHours(database, date);
    if (!hours.isOpen) return false;
    const start = toMinutes(time);
    if (start < toMinutes(hours.start) || start + duration > toMinutes(hours.end)) return false;
    if (start % SLOT_STEP_MINUTES !== 0) return false;
    if (date === dateKey(new Date())) {
        const now = new Date();
        if (start <= now.getHours() * 60 + now.getMinutes()) return false;
    }
    return !overlappingBooking(database, date, time, duration, ignoreId);
}

// The public form and admin calendar use the same availability rules.
export function allDaySlots(database: SalonDatabase, date: string): string[] {
    const hours = workingHours(database, date);
    if (!hours.isOpen) return [];
    const results: string[] = [];
    for (let minute = toMinutes(hours.start); minute < toMinutes(hours.end); minute += SLOT_STEP_MINUTES) {
        results.push(fromMinutes(minute));
    }
    return results;
}

export function availableSlots(database: SalonDatabase, date: string, duration: number): string[] {
    return allDaySlots(database, date).filter((time) => isAvailable(database, date, time, duration));
}

export function dateRange(days: number): string[] {
    const start = dateKey(new Date());
    return Array.from({ length: days }, (_, index) => addDays(start, index));
}
