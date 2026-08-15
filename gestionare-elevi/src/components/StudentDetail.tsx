import { useState } from "react";
import type { Student } from "../lib/types";
import { initials } from "../lib/format";
import { btnDanger, btnGhost, btnPinkGhost, color } from "../lib/ui";
import SessionsPanel from "./SessionsPanel";
import GradesPanel from "./GradesPanel";

type Tab = "sesiuni" | "note";

export default function StudentDetail({
  student,
  initialTab,
  onBack,
  onEdit,
  onScheduleMeeting,
  onDelete,
  onOpenEval,
  flash,
}: {
  student: Student;
  initialTab?: Tab;
  onBack: () => void;
  onEdit: () => void;
  onScheduleMeeting: () => void;
  onDelete: () => void;
  onOpenEval: (evalId: string) => void;
  flash: (msg: string) => void;
}) {
  const [tab, setTab] = useState<Tab>(initialTab ?? "sesiuni");

  const tabs: { key: Tab; label: string }[] = [
    { key: "sesiuni", label: "Ședințe individuale" },
    { key: "note", label: "Note" },
  ];

  return (
    <div className="ge-in">
      <button
        onClick={onBack}
        style={{ border: 0, background: "transparent", color: color.muted, cursor: "pointer", padding: 0, fontWeight: 600 }}
      >
        ‹ Toți elevii
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 16, flexWrap: "wrap" }}>
        <div
          style={{
            width: 62,
            height: 62,
            borderRadius: "50%",
            background: color.blueSoft,
            color: color.blueDark,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Instrument Serif', serif",
            fontSize: 26,
          }}
        >
          {initials(student.nume)}
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <h1 style={{ margin: 0, fontFamily: "'Instrument Serif', serif", fontSize: 36, fontWeight: 400 }}>{student.nume}</h1>
          <div style={{ color: color.muted, marginTop: 4 }}>
            Clasa {student.clasa} · {student.varsta} ani · {student.parinte} · {student.telefon}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onEdit} style={btnGhost}>
            Editează fișa
          </button>
          <button onClick={onScheduleMeeting} style={btnPinkGhost}>
            Programează părinții
          </button>
          <button onClick={onDelete} style={btnDanger}>
            Șterge
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, margin: "22px 0 18px", borderBottom: `1px solid ${color.border}` }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              border: 0,
              background: "transparent",
              cursor: "pointer",
              padding: "10px 16px",
              fontWeight: 600,
              color: tab === t.key ? color.blueDark : "#7f93a6",
              borderBottom: `2px solid ${tab === t.key ? color.blue : "transparent"}`,
              marginBottom: -1,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "sesiuni" && <SessionsPanel studentId={student.id} />}
      {tab === "note" && <GradesPanel student={student} onOpenEval={onOpenEval} flash={flash} />}
    </div>
  );
}
