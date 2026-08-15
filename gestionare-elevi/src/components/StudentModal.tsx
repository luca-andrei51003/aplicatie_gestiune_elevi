import { useState } from "react";
import type { StudentInput } from "../lib/db";
import type { Student } from "../lib/types";
import { btnGhost, btnPrimary, color, input, label, modalBackdrop, modalCard } from "../lib/ui";

export default function StudentModal({
  editing,
  onCancel,
  onSave,
}: {
  editing: Student | null;
  onCancel: () => void;
  onSave: (input: StudentInput) => Promise<void> | void;
}) {
  const [form, setForm] = useState<StudentInput>({
    nume: editing?.nume ?? "",
    clasa: editing?.clasa ?? "",
    varsta: editing?.varsta ?? "",
    parinte: editing?.parinte ?? "",
    email: editing?.email ?? "",
    telefon: editing?.telefon ?? "",
    telefon_elev: editing?.telefon_elev ?? "",
    notite: editing?.notite ?? "",
  });
  const [error, setError] = useState("");

  const set = (field: keyof StudentInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const save = () => {
    if (!form.nume.trim()) return setError("Numele elevului este obligatoriu.");
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      return setError("Adresa de e-mail nu pare validă.");
    }
    setError("");
    onSave(form);
  };

  return (
    <div style={modalBackdrop}>
      <div className="ge-in" style={modalCard}>
        <h2 style={{ margin: "0 0 18px", fontFamily: "'Instrument Serif', serif", fontSize: 28, fontWeight: 400 }}>
          {editing ? "Editează fișa elevului" : "Elev nou"}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <label style={{ ...label, gridColumn: "span 2" }}>
            Nume complet
            <input style={input} value={form.nume} onChange={set("nume")} placeholder="Numele și prenumele elevului" />
          </label>
          <label style={label}>
            Clasa
            <select style={input} value={form.clasa} onChange={set("clasa")}>
              <option value="">Alege tipul</option>
              <option value="Particular">Particular</option>
              <option value="Didacto">Didacto</option>
            </select>
          </label>
          <label style={label}>
            Vârsta
            <input style={input} value={form.varsta} onChange={set("varsta")} placeholder="Completează vârsta" />
          </label>
          <label style={label}>
            Părinte
            <input style={input} value={form.parinte} onChange={set("parinte")} placeholder="Numele părintelui" />
          </label>
          <label style={label}>
            Telefon părinte
            <input style={input} value={form.telefon} onChange={set("telefon")} placeholder="Număr de telefon" />
          </label>
          <label style={{ ...label, gridColumn: "span 2" }}>
            Telefon elev <span style={{ textTransform: "none", fontWeight: 500, letterSpacing: 0 }}>(opțional)</span>
            <input
              style={input}
              value={form.telefon_elev}
              onChange={set("telefon_elev")}
              placeholder="Dacă elevul are telefon propriu"
            />
          </label>
          <label style={{ ...label, gridColumn: "span 2" }}>
            E-mail părinte
            <input style={input} value={form.email} onChange={set("email")} placeholder="Adresa de e-mail a părintelui" />
          </label>
        </div>
        {error && (
          <div
            style={{
              marginTop: 14,
              background: color.dangerTint,
              border: `1px solid ${color.dangerBorder}`,
              color: color.danger,
              borderRadius: 10,
              padding: "10px 12px",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
          <button style={btnGhost} onClick={onCancel}>
            Renunță
          </button>
          <button style={btnPrimary} onClick={save}>
            Salvează
          </button>
        </div>
      </div>
    </div>
  );
}
