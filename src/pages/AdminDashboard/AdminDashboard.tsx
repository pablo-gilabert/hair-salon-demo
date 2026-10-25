import { useMemo, useState, type ChangeEvent } from "react";
import Swal from "sweetalert2";

import { useDisplay } from "../../context/DisplayContext";
import { useSalon } from "../../context/SalonContext";
import { dateKey } from "../../data/SalonSeed";
import type { BookingRequest, SalonBooking } from "../../data/SalonTypes";
import { FormatPrice } from "../../data/services";
import { adminTranslate } from "../../i18n/AdminTranslations";
import { allDaySlots, findService, fromMinutes, isAvailable, overlappingBooking, servicesOf, toMinutes } from "../../lib/SalonScheduling";
import { AlertClasses, confirmAction, createAlertOption, openEditor, showAlert } from "../../lib/SalonAlerts";
import styles from "./AdminDashboard.module.css";

// The dashboard displays current availability while every editing action opens a modal.
export default function AdminDashboard() {
    const { language } = useDisplay();
    const { database, addBooking, editBooking, updateBooking, deleteBooking } = useSalon();
    const a = (key: Parameters<typeof adminTranslate>[1]) => adminTranslate(language, key);
    const [date, setDate] = useState(() => database.bookings.find((booking) => booking.status === "confirmed" && booking.date >= dateKey(new Date()))?.date ?? dateKey(new Date()));
    const [showCancelled, setShowCancelled] = useState(false);

    const bookings = useMemo(() => database.bookings.filter((item) => item.date === date).sort((left, right) => left.time.localeCompare(right.time)), [database.bookings, date]);
    const confirmed = bookings.filter((item) => item.status === "confirmed");
    const visible = showCancelled ? bookings : confirmed;
    const slots = allDaySlots(database, date);
    const freeCount = slots.filter((slot) => isAvailable(database, date, slot, 30)).length;
    const paidCount = confirmed.filter((booking) => booking.depositPaid).length;
    const services = servicesOf(database);
    const appointmentLabel = (booking: SalonBooking) => findService(database, booking.serviceId)?.name[language] ?? booking.serviceId;

    // Refresh the selectable time slots whenever the service or date changes inside the popup.
    const attachSlotUpdates = (form: HTMLDivElement, appointment?: SalonBooking, startingTime?: string) => {
        const dateInput = form.querySelector<HTMLInputElement>('[name="date"]');
        const serviceInput = form.querySelector<HTMLSelectElement>('[name="serviceId"]');
        const timeInput = form.querySelector<HTMLSelectElement>('[name="time"]');
        if (!dateInput || !serviceInput || !timeInput) return;

        const refresh = () => {
            const service = findService(database, serviceInput.value);
            const previousTime = timeInput.value || startingTime;
            const choices = service ? allDaySlots(database, dateInput.value).filter((slot) =>
                isAvailable(database, dateInput.value, slot, service.duration, appointment?.id),
            ) : [];
            // Keep the original slot selectable when changing only client details.
            if (appointment && dateInput.value === appointment.date && serviceInput.value === appointment.serviceId && !choices.includes(appointment.time)) {
                choices.push(appointment.time);
                choices.sort();
            }
            timeInput.replaceChildren(createAlertOption("", a("chooseTime")));
            choices.forEach((slot) => timeInput.add(createAlertOption(slot, slot)));
            timeInput.value = previousTime && choices.includes(previousTime) ? previousTime : "";
            startingTime = undefined;
        };

        serviceInput.addEventListener("change", refresh);
        dateInput.addEventListener("change", refresh);
        refresh();
    };

    const appointmentFields = (appointment?: SalonBooking, preferredTime?: string) => {
        const initialService = appointment?.serviceId ?? services[0]?.id ?? "";
        return [
            {
                name: "serviceId", label: a("selectService"), kind: "select" as const, value: initialService, wide: true,
                options: services.map((service) => ({
                    value: service.id,
                    label: `${service.name[language]} · ${FormatPrice(service.price, language)} · ${service.duration} min`,
                })),
            },
            { name: "date", label: a("selectDate"), kind: "date" as const, value: appointment?.date ?? date, required: true },
            { name: "time", label: a("selectTime"), kind: "select" as const, value: appointment?.time ?? preferredTime ?? "", required: true },
            { name: "customerName", label: a("customerName"), value: appointment?.customerName ?? "", required: true, maxLength: 100 },
            { name: "customerPhone", label: a("customerPhone"), kind: "tel" as const, value: appointment?.customerPhone ?? "", required: true, maxLength: 30 },
            { name: "customerEmail", label: a("customerEmail"), kind: "email" as const, value: appointment?.customerEmail ?? "", maxLength: 140 },
            { name: "note", label: a("customerNote"), kind: "textarea" as const, value: appointment?.note ?? "", maxLength: 1000, wide: true },
            { name: "depositPaid", label: a("paidYes"), kind: "checkbox" as const, value: appointment?.depositPaid ?? false, wide: true },
        ];
    };

    // Both new and existing appointments use the same editor and availability constraints.
    const openAppointmentEditor = async (appointment?: SalonBooking, preferredTime?: string) => {
        if (!services.length) {
            await showAlert(a("noServices"), "error");
            return;
        }

        const values = await openEditor({
            title: a(appointment ? "editAppointment" : "newAppointment"),
            fields: appointmentFields(appointment, preferredTime),
            confirmText: a("saveBooking"),
            cancelText: a("discard"),
            invalidText: a("bookingInvalid"),
            onOpen: (form) => attachSlotUpdates(form, appointment, appointment?.time ?? preferredTime),
            validate: (draft) => {
                const service = findService(database, String(draft.serviceId));
                if (!service || !String(draft.customerName).trim() || !String(draft.customerPhone).trim() || !draft.time) return a("bookingInvalid");
                const scheduleChanged = !appointment || String(draft.date) !== appointment.date
                    || String(draft.time) !== appointment.time || String(draft.serviceId) !== appointment.serviceId
                    || service.duration !== appointment.duration;
                if ((!appointment || appointment.status === "confirmed") && scheduleChanged
                    && !isAvailable(database, String(draft.date), String(draft.time), service.duration, appointment?.id)) {
                    return a("bookingConflict");
                }
                return null;
            },
        });

        if (!values) return;
        const request: BookingRequest = {
            date: String(values.date),
            time: String(values.time),
            serviceId: String(values.serviceId),
            customerName: String(values.customerName).trim(),
            customerPhone: String(values.customerPhone).trim(),
            customerEmail: String(values.customerEmail).trim(),
            note: String(values.note).trim(),
        };
        const result = appointment
            ? editBooking(appointment.id, request, Boolean(values.depositPaid))
            : addBooking(request, Boolean(values.depositPaid));

        if (!result.ok) {
            await showAlert(a(result.reason === "invalid" ? "bookingInvalid" : "bookingConflict"), "error");
            return;
        }
        await showAlert(a("bookingSaved"));
    };

    const toggleDeposit = async (booking: SalonBooking) => {
        const accepted = await confirmAction({
            title: booking.depositPaid ? a("markUnpaid") : a("markPaid"),
            text: `${booking.customerName} · ${booking.date} ${booking.time}`,
            confirmText: a("confirmAction"),
            cancelText: a("discard"),
        });
        if (!accepted) return;
        updateBooking(booking.id, { depositPaid: !booking.depositPaid });
        await showAlert(a("saved"));
    };

    const toggleBooking = async (booking: SalonBooking) => {
        const restored = booking.status === "cancelled";
        if (restored && !isAvailable(database, booking.date, booking.time, booking.duration, booking.id)) {
            await showAlert(a("bookingConflict"), "error");
            return;
        }
        const accepted = await confirmAction({
            title: restored ? a("restore") : a("cancel"),
            text: `${booking.customerName} · ${booking.date} ${booking.time}`,
            confirmText: a("confirmAction"),
            cancelText: a("discard"),
            destructive: !restored,
        });
        if (!accepted) return;
        updateBooking(booking.id, { status: restored ? "confirmed" : "cancelled" });
        await showAlert(a("saved"));
    };

    const removeBooking = async (booking: SalonBooking) => {
        const accepted = await confirmAction({
            title: a("remove"),
            text: `${booking.customerName} · ${booking.date} ${booking.time}`,
            confirmText: a("remove"),
            cancelText: a("discard"),
            destructive: true,
        });
        if (!accepted) return;
        deleteBooking(booking.id);
        await showAlert(a("saved"));
    };

    // Selecting any booked calendar cell opens details and all available actions in a popup.
    const openDetails = async (booking: SalonBooking) => {
        const details = document.createElement("div");
        details.className = "salonAlertDetails";
        const lines = [
            [a("client"), booking.customerName],
            [a("phone"), booking.customerPhone],
            [a("email"), booking.customerEmail || "—"],
            [a("booking"), appointmentLabel(booking)],
            [a("time"), `${booking.date} · ${booking.time}–${fromMinutes(toMinutes(booking.time) + booking.duration)}`],
            [a("deposit"), booking.depositPaid ? a("paidYes") : a("paidNo")],
            [a("state"), booking.status === "cancelled" ? a("cancelled") : a("confirmed")],
            [a("note"), booking.note || a("noNote")],
        ];
        lines.forEach(([label, value]) => {
            const row = document.createElement("p");
            const strong = document.createElement("strong");
            strong.textContent = `${label}: `;
            row.append(strong, document.createTextNode(value));
            details.append(row);
        });

        const actions = document.createElement("div");
        actions.className = "salonAlertTools";
        const options = [
            { text: a("editAppointment"), callback: () => openAppointmentEditor(booking) },
            { text: booking.depositPaid ? a("markUnpaid") : a("markPaid"), callback: () => toggleDeposit(booking) },
            { text: booking.status === "confirmed" ? a("cancel") : a("restore"), callback: () => toggleBooking(booking) },
            { text: a("remove"), callback: () => removeBooking(booking) },
        ];
        options.forEach((option) => {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = option.text;
            button.addEventListener("click", () => {
                Swal.close();
                // Allow the details popup to close before presenting the editor or confirmation.
                window.setTimeout(() => { void option.callback(); }, 180);
            });
            actions.append(button);
        });
        details.append(actions);

        await Swal.fire({
            title: `${a("detail")} · ${booking.customerName}`,
            html: details,
            width: "min(94vw, 680px)",
            showCloseButton: true,
            showConfirmButton: false,
            customClass: AlertClasses,
        });
    };

    return (
        <div className={styles.page}>
            <div className={styles.heading}>
                <div>
                    <span className={styles.kicker}>{a("demoTag")}</span>
                    <h1>{a("dashboardTitle")}</h1>
                    <p>{a("dashboardHint")}</p>
                </div>
                <button type="button" className={styles.primary} onClick={() => void openAppointmentEditor()}>{a("newAppointment")} +</button>
            </div>

            <div className={styles.toolbar}>
                <label>{a("selectDate")}
                    <input type="date" value={date} onChange={(event: ChangeEvent<HTMLInputElement>) => setDate(event.target.value)} />
                </label>
                <button type="button" onClick={() => setDate(dateKey(new Date()))}>{a("today")}</button>
                <label className={styles.check}>
                    <input type="checkbox" checked={showCancelled} onChange={(event: ChangeEvent<HTMLInputElement>) => setShowCancelled(event.target.checked)} />
                    {a("archived")}
                </label>
            </div>

            <div className={styles.metrics}>
                <div><span>{a("confirmed")}</span><strong>{confirmed.length}</strong></div>
                <div><span>{a("available")}</span><strong>{freeCount}</strong></div>
                <div><span>{a("paid")}</span><strong>{paidCount}</strong></div>
                <div><span>{a("unpaid")}</span><strong>{confirmed.length - paidCount}</strong></div>
            </div>

            <section className={styles.panel}>
                <div className={styles.sectionHeader}><h2>{a("bookingsTitle")}</h2><p>{a("bookingsHint")}</p></div>
                <div className={styles.calendar}>
                    {slots.length ? slots.map((slot) => {
                        const booking = overlappingBooking(database, date, slot, 30);
                        const free = isAvailable(database, date, slot, 30);
                        return (
                            <button
                                key={slot}
                                type="button"
                                className={`${styles.slot} ${booking ? styles.busy : free ? styles.free : styles.elapsed}`}
                                onClick={() => {
                                    if (booking) void openDetails(booking);
                                    else if (free) void openAppointmentEditor(undefined, slot);
                                }}
                            >
                                <strong>{slot}</strong>
                                <span>{booking ? `${a("slotTaken")} · ${booking.customerName}` : free ? a("slotFree") : a("slotPast")}</span>
                            </button>
                        );
                    }) : <p>{a("closed")}</p>}
                </div>
            </section>

            <section className={styles.panel}>
                <div className={styles.sectionHeader}><h2>{a("appointments")}</h2><p>{a("demoContact")}</p></div>
                <div className={styles.bookingList}>
                    {visible.length ? visible.map((booking) => (
                        <button type="button" key={booking.id} className={styles.bookingItem} onClick={() => void openDetails(booking)}>
                            <span className={styles.bookingTime}>{booking.time}–{fromMinutes(toMinutes(booking.time) + booking.duration)}</span>
                            <span><strong>{booking.customerName}</strong><small>{appointmentLabel(booking)}</small></span>
                            <span className={styles.phone}>{booking.customerPhone}</span>
                            <span className={`${styles.pill} ${booking.status === "cancelled" ? styles.muted : booking.depositPaid ? styles.success : styles.pending}`}>
                                {booking.status === "cancelled" ? a("cancelled") : booking.depositPaid ? a("paidYes") : a("paidNo")}
                            </span>
                        </button>
                    )) : <p>{a("noBookings")}</p>}
                </div>
            </section>

            <p className={styles.footerNote}>{a("bookingDisclaimer")}</p>
        </div>
    );
}
