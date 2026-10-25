import { type ChangeEvent, useMemo, useState, type FormEvent } from "react";

import { useDisplay } from "../../context/DisplayContext";
import { useSalon } from "../../context/SalonContext";
import { dateKey } from "../../data/SalonSeed";
import { adminTranslate } from "../../i18n/AdminTranslations";
import { allDaySlots, availableSlots, isAvailable, findService, fromMinutes, overlappingBooking, servicesOf, toMinutes } from "../../lib/SalonScheduling";
import type { SalonBooking } from "../../data/SalonTypes";
import { FormatPrice } from "../../data/services";
import styles from "./AdminDashboard.module.css";

const EmptyCustomer = { customerName: "", customerPhone: "", customerEmail: "", note: "" };

// Every 30-minute calendar cell is derived from the single booking database.
export default function AdminDashboard() {
    const { language } = useDisplay();
    const { database, addBooking, updateBooking, deleteBooking } = useSalon();
    const a = (key: Parameters<typeof adminTranslate>[1]) => adminTranslate(language, key);
    const [date, setDate] = useState(() => database.bookings.find((booking) => booking.status === "confirmed" && booking.date >= dateKey(new Date()))?.date ?? dateKey(new Date()));
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showCancelled, setShowCancelled] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [serviceId, setServiceId] = useState(servicesOf(database)[0]?.id ?? "");
    const [time, setTime] = useState("");
    const [customer, setCustomer] = useState(EmptyCustomer);
    const [paid, setPaid] = useState(false);
    const [message, setMessage] = useState("");

    const bookings = useMemo(() => database.bookings.filter((item) => item.date === date).sort((left, right) => left.time.localeCompare(right.time)), [database.bookings, date]);
    const confirmed = bookings.filter((item) => item.status === "confirmed");
    const visible = showCancelled ? bookings : confirmed;
    const slots = allDaySlots(database, date);
    const freeCount = slots.filter((slot) => isAvailable(database, date, slot, 30)).length;
    const paidCount = confirmed.filter((booking) => booking.depositPaid).length;
    const selected = database.bookings.find((item) => item.id === selectedId);
    const services = servicesOf(database);
    const chosenService = findService(database, serviceId);
    const times = chosenService ? availableSlots(database, date, chosenService.duration) : [];

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = addBooking({ ...customer, date, time, serviceId }, paid);
        if (!result.ok) return setMessage(a(result.reason === "invalid" ? "bookingInvalid" : "bookingConflict"));
        setMessage(a("bookingSaved"));
        setCustomer(EmptyCustomer);
        setTime("");
        setPaid(false);
        setShowCreate(false);
    };

    const appointmentLabel = (booking: SalonBooking) => findService(database, booking.serviceId)?.name[language] ?? booking.serviceId;

    return (
        <div className={styles.page}>
            <div className={styles.heading}>
                <div><span className={styles.kicker}>{a("demoTag")}</span><h1>{a("dashboardTitle")}</h1><p>{a("dashboardHint")}</p></div>
                <button type="button" className={styles.primary} onClick={() => { setShowCreate(!showCreate); setMessage(""); }}>{a("newAppointment")} +</button>
            </div>
            <div className={styles.toolbar}>
                <label>{a("selectDate")} <input type="date" value={date} onChange={(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { setDate(event.target.value); setSelectedId(null); setMessage(""); }} /></label>
                <button type="button" onClick={() => setDate(dateKey(new Date()))}>{a("today")}</button>
                <label className={styles.check}><input type="checkbox" checked={showCancelled} onChange={(event: ChangeEvent<HTMLInputElement>) => setShowCancelled(event.target.checked)} />{a("archived")}</label>
            </div>
            <div className={styles.metrics}>
                <div><span>{a("confirmed")}</span><strong>{confirmed.length}</strong></div>
                <div><span>{a("available")}</span><strong>{freeCount}</strong></div>
                <div><span>{a("paid")}</span><strong>{paidCount}</strong></div>
                <div><span>{a("unpaid")}</span><strong>{confirmed.length - paidCount}</strong></div>
            </div>

            {showCreate && (
                <section className={styles.panel}>
                    <h2>{a("newAppointment")}</h2>
                    <form onSubmit={submit} className={styles.form}>
                        <label>{a("selectService")}
                            <select value={serviceId} required onChange={(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { setServiceId(event.target.value); setTime(""); }}>
                                {services.map((service) => <option key={service.id} value={service.id}>{service.name[language]} · {FormatPrice(service.price, language)} · {service.duration} min</option>)}
                            </select>
                        </label>
                        <label>{a("selectTime")}
                            <select value={time} required onChange={(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setTime(event.target.value)}>
                                <option value="">{a("chooseTime")}</option>
                                {times.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                            </select>
                        </label>
                        <label>{a("customerName")}<input required maxLength={100} value={customer.customerName} onChange={(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setCustomer({ ...customer, customerName: event.target.value })} /></label>
                        <label>{a("customerPhone")}<input required type="tel" maxLength={30} value={customer.customerPhone} onChange={(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setCustomer({ ...customer, customerPhone: event.target.value })} /></label>
                        <label>{a("customerEmail")}<input type="email" value={customer.customerEmail} onChange={(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setCustomer({ ...customer, customerEmail: event.target.value })} /></label>
                        <label className={styles.wide}>{a("customerNote")}<textarea rows={2} value={customer.note} onChange={(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setCustomer({ ...customer, note: event.target.value })} /></label>
                        <label className={styles.check}><input type="checkbox" checked={paid} onChange={(event: ChangeEvent<HTMLInputElement>) => setPaid(event.target.checked)} />{a("paidYes")}</label>
                        <button className={styles.primary} disabled={!times.length}>{a("saveBooking")}</button>
                    </form>
                    {!times.length && <p>{a("noSlots")}</p>}
                </section>
            )}
            {message && <p className={styles.notice} role="status">{message}</p>}

            <section className={styles.panel}>
                <div className={styles.sectionHeader}><h2>{a("bookingsTitle")}</h2><p>{a("bookingsHint")}</p></div>
                <div className={styles.calendar}>
                    {slots.length ? slots.map((slot) => {
                        const booking = overlappingBooking(database, date, slot, 30);
                        const free = isAvailable(database, date, slot, 30);
                        return (
                            <button key={slot} type="button" className={`${styles.slot} ${booking ? styles.busy : free ? styles.free : styles.elapsed}`} onClick={() => { if (booking) setSelectedId(booking.id); else if (free) { setSelectedId(null); setShowCreate(true); setTime(slot); } }}>
                                <strong>{slot}</strong><span>{booking ? `${a("slotTaken")} · ${booking.customerName}` : free ? a("slotFree") : a("slotPast")}</span>
                            </button>
                        );
                    }) : <p>{a("closed")}</p>}
                </div>
            </section>

            <section className={styles.panel}>
                <div className={styles.sectionHeader}><h2>{a("appointments")}</h2><p>{a("demoContact")}</p></div>
                <div className={styles.bookingList}>
                    {visible.length ? visible.map((booking) => (
                        <button type="button" key={booking.id} className={`${styles.bookingItem} ${selectedId === booking.id ? styles.selected : ""}`} onClick={() => setSelectedId(booking.id)}>
                            <span className={styles.bookingTime}>{booking.time}–{fromMinutes(toMinutes(booking.time) + booking.duration)}</span>
                            <span><strong>{booking.customerName}</strong><small>{appointmentLabel(booking)}</small></span>
                            <span className={styles.phone}>{booking.customerPhone}</span>
                            <span className={`${styles.pill} ${booking.status === "cancelled" ? styles.muted : booking.depositPaid ? styles.success : styles.pending}`}>
                                {booking.status === "cancelled" ? a("cancelled") : booking.depositPaid ? a("paidYes") : a("paidNo")}
                            </span>
                        </button>
                    )) : <p>{a("noBookings")}</p>}
                </div>
                {selected && (
                    <div className={styles.detail}>
                        <div className={styles.sectionHeader}><h3>{a("detail")} — {selected.customerName}</h3><button type="button" onClick={() => setSelectedId(null)}>×</button></div>
                        <p><strong>{a("booking")}:</strong> {appointmentLabel(selected)} · {selected.date} · {selected.time}</p>
                        <p><strong>{a("phone")}:</strong> <a href={`tel:${selected.customerPhone}`}>{selected.customerPhone}</a></p>
                        {selected.customerEmail && <p><strong>{a("email")}:</strong> {selected.customerEmail}</p>}
                        <p><strong>{a("note")}:</strong> {selected.note || a("noNote")}</p>
                        <div className={styles.detailActions}>
                            <button type="button" onClick={() => updateBooking(selected.id, { depositPaid: !selected.depositPaid })}>{selected.depositPaid ? a("markUnpaid") : a("markPaid")}</button>
                            <button type="button" onClick={() => {
                                if (selected.status === "cancelled" && !isAvailableForRestore(database, selected)) return setMessage(a("bookingConflict"));
                                updateBooking(selected.id, { status: selected.status === "confirmed" ? "cancelled" : "confirmed" });
                            }}>{selected.status === "confirmed" ? a("cancel") : a("restore")}</button>
                            <button type="button" className={styles.danger} onClick={() => { if (window.confirm(a("remove") + "?")) { deleteBooking(selected.id); setSelectedId(null); } }}>{a("remove")}</button>
                        </div>
                    </div>
                )}
            </section>
            <p className={styles.footerNote}>{a("bookingDisclaimer")}</p>
        </div>
    );
}

function isAvailableForRestore(database: ReturnType<typeof useSalon>["database"], booking: SalonBooking): boolean {
    // This check intentionally ignores the selected cancelled entry itself.
    return isAvailable(database, booking.date, booking.time, booking.duration, booking.id);
}
