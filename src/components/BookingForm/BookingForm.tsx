import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router";
import styles from "./BookingForm.module.css";

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
};

const options = ["Corte", "Coloración", "Tratamientos"];

export default function BookingForm() {
  const [searchParams] = useSearchParams();
  const incoming = searchParams.get("servicio") || "";
  const initialService = options.includes(incoming) ? incoming : "Corte";
  const [selectedService, setSelectedService] = useState(initialService);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>({ firstName: "", lastName: "", phone: "", email: "", message: "" });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const updateField = (field: keyof FormState, value: string) => {
    setSubmitted(false);
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <p className={styles.eyebrow}>Escribinos</p>
      <h2 className={styles.heading}>Contanos qué necesitás</h2>
      <p className={styles.lead}>Completá el formulario para probar cómo sería la experiencia de consulta.</p>
      <div className={styles.fields}>
        <label>Nombre *<input name="firstName" autoComplete="given-name" required maxLength={80} value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} placeholder="Tu nombre" /></label>
        <label>Apellido *<input name="lastName" autoComplete="family-name" required maxLength={80} value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} placeholder="Tu apellido" /></label>
        <label>Teléfono *<input name="phone" type="tel" autoComplete="tel" minLength={6} maxLength={25} required value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="11 1234 5678" /></label>
        <label>Correo electrónico *<input name="email" type="email" autoComplete="email" required maxLength={140} value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="vos@ejemplo.com" /></label>
      </div>
      <fieldset className={styles.services}>
        <legend>Me interesa</legend>
        <div className={styles.options}>
          {options.map((option) => <button key={option} type="button" aria-pressed={selectedService === option} onClick={() => {setSelectedService(option);setSubmitted(false)}} className={selectedService === option ? styles.selected : ""}>{option}</button>)}
        </div>
      </fieldset>
      <label className={styles.message}>Mensaje<textarea name="message" rows={3} maxLength={1000} value={form.message} onChange={(e) => updateField("message", e.target.value)} placeholder="¿Qué te gustaría hacerte? ¿Tenés alguna consulta?" /></label>
      <button className={styles.submit} type="submit">Probar consulta <span aria-hidden="true">↗</span></button>
      {submitted && <p className={styles.result} role="status">¡Gracias, {form.firstName}! Esta es una demostración: los datos no se enviaron ni se guardaron. Seleccionaste «{selectedService}».</p>}
      <p className={styles.demoNote}>* Demostración interactiva. Este formulario no realiza reservas ni envía información a un negocio real.</p>
    </form>
  );
}
