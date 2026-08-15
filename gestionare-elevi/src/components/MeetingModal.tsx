import { useState } from "react";
import type { MeetingInput } from "../lib/db";
import type { Student } from "../lib/types";
import { shiftDays } from "../lib/format";
import { btnGhost, btnPink, color, input, label, modalBackdrop, modalCard } from "../lib/ui";

export default function MeetingModal({
  students,
  defaultStudentId,
  onCancel,
  onSave,
}: {
  students: Student[];
  defaultStudentId: string | null;
  onCancel: () => void;
  onSave: (input: MeetingInput) => Promise<void> | void;
}) {
  const [studentId, setStudentId] = useState(defaultStudentId ?? students[0]?.id ?? "");
  const [data, setData] = useState(shiftDays(3));
  const [ora, setOra] = useState("16:30");
  const [link, setLink] = useState("");
  const [agenda, setAgenda] = useState("");
  const [error, setError] = useState("");

  const save = () => {
    if (!studentId) return setError("Alege elevul.");
    const s = students.find((x) => x.id === studentId);
    if (!s || !s.email) return setError("Elevul selectat nu are e-mail de contact. Completează-l în fișa elevului.");
    if (!data) return setError("Alege data întâlnirii.");
    onSave({
      student_id: studentId,
      data,
      ora: ora || "16:00",
      link: link || "link nesetat",
      agenda,
      status: "Programată",
    });
  };

  return (
    <div style={modalBackdrop}>
      <div className="ge-in" style={{ ...modalCard, width: 560 }}>
        <h2 style={{ margin: "0 0 18px", fontFamily: "'Instrument Serif', serif", fontSize: 28, fontWeight: 400 }}>
          Programare întâlnire
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <label style={{ ...label, gridColumn: "span 2" }}>
            Elev
            <select style={input} value={studentId} onChange={(e) => setStudentId(e.target.value)}>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nume} · {s.clasa}
                </option>
              ))}
            </select>
          </label>
          <div
            style={{
              gridColumn: "span 2",
              background: color.blueTint2,
              border: `1px solid ${color.inputBorder}`,
              borderRadius: 10,
              padding: "11px 13px",
              fontSize: 12,
              color: "#5b7186",
              lineHeight: 1.5,
            }}
          >
            Întâlnirile se desfășoară online. Invitația se trimite automat pe adresa părintelui din fișa elevului — datele
            de contact se editează doar acolo.
          </div>
          <label style={label}>
            Data
            <input type="date" style={input} value={data} onChange={(e) => setData(e.target.value)} />
          </label>
          <label style={label}>
            Ora
            <input style={input} value={ora} onChange={(e) => setOra(e.target.value)} placeholder="16:30" />
          </label>
          <label style={{ ...label, gridColumn: "span 2" }}>
            Link video
            <input
              style={input}
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://meet.example.com/cabinet-12"
            />
          </label>
          <label style={{ ...label, gridColumn: "span 2" }}>
            Agenda discuției
            <textarea
              style={{ ...input, minHeight: 70, resize: "vertical", lineHeight: 1.55 }}
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              placeholder="Progres la citire, temele de acasă, plan pentru trimestrul următor…"
            />
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
          <button style={btnPink} onClick={save}>
            Programează
          </button>
        </div>
      </div>
    </div>
  );
}
