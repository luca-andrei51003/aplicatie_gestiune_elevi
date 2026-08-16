import { useMemo, useState } from "react";
import * as db from "../lib/db";
import type { Evaluation, Meeting, Student } from "../lib/types";
import { MONTHS_LONG, todayIso } from "../lib/format";
import { badge, btnPink, btnPinkGhost, card, color } from "../lib/ui";

const MONTHS_SHORT = ["ian", "feb", "mar", "apr", "mai", "iun", "iul", "aug", "sep", "oct", "nov", "dec"];
const WEEK_DAYS = ["L", "Ma", "Mi", "J", "V", "S", "D"];

export default function MeetingsView({
  meetings,
  evals,
  students,
  onRefresh,
  onNewMeeting,
  onOpenStudent,
}: {
  meetings: Meeting[];
  evals: Evaluation[];
  students: Student[];
  onRefresh: () => Promise<void> | void;
  onNewMeeting: () => void;
  onOpenStudent: (id: string) => void;
}) {
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const today = todayIso();

  const studentOf = (id: string | null) => students.find((s) => s.id === id) || null;

  const sorted = useMemo(
    () => meetings.slice().sort((a, b) => (a.data + a.ora).localeCompare(b.data + b.ora)),
    [meetings]
  );

  async function toggleStatus(m: Meeting) {
    const confirmed = m.status === "Confirmată";
    await db.updateMeeting(m.id, { status: confirmed ? "Programată" : "Confirmată" });
    await onRefresh();
  }

  async function remove(m: Meeting) {
    await db.deleteMeeting(m.id);
    await onRefresh();
  }

  function prevMonth() {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(calYear - 1);
    } else {
      setCalMonth(calMonth - 1);
    }
  }
  function nextMonth() {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(calYear + 1);
    } else {
      setCalMonth(calMonth + 1);
    }
  }

  const first = new Date(calYear, calMonth, 1);
  const offset = (first.getDay() + 6) % 7;
  const daysIn = new Date(calYear, calMonth + 1, 0).getDate();
  const cells: { label: string | number; bg: string; fg: string; dot: string; weight: number }[] = [];
  for (let i = 0; i < offset; i++) cells.push({ label: "", bg: "transparent", fg: "transparent", dot: "transparent", weight: 400 });
  for (let d = 1; d <= daysIn; d++) {
    const key = calYear + "-" + String(calMonth + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
    const hasM = meetings.some((m) => m.data === key);
    const hasE = evals.some((e) => e.data === key);
    const isToday = key === today;
    cells.push({
      label: d,
      bg: isToday ? color.blue : hasM ? color.pinkTint : hasE ? "#f1f7fb" : "#ffffff",
      fg: isToday ? "#ffffff" : "#3c5265",
      dot: hasM ? (isToday ? "#f9dbe6" : color.pink) : hasE ? (isToday ? "#dbeaf6" : color.blue) : "transparent",
      weight: isToday || hasM ? 700 : 500,
    });
  }

  return (
    <div className="ge-in">
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: "'Instrument Serif', serif", fontSize: 40, fontWeight: 400 }}>
            Întâlniri cu părinții
          </h1>
          <p style={{ margin: "6px 0 0", color: color.muted }}>Programare, contact și invitații.</p>
        </div>
        <button style={btnPink} onClick={onNewMeeting}>
          + Programare nouă
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginTop: 26, alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: "1 1 460px", minWidth: 0 }}>
          {sorted.map((m) => {
            const s = studentOf(m.student_id);
            const dt = new Date(m.data + "T00:00:00");
            const confirmed = m.status === "Confirmată";
            return (
              <div
                key={m.id}
                style={{ ...card, padding: "18px 20px", display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center" }}
              >
                <div
                  style={{
                    textAlign: "center",
                    background: m.data < today ? "#f1f6fa" : color.pinkTint,
                    borderRadius: 11,
                    padding: "10px 6px",
                    width: 92,
                    flex: "0 0 92px",
                  }}
                >
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", color: "#7f93a6", fontWeight: 700 }}>
                    {MONTHS_SHORT[dt.getMonth()]}
                  </div>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 27, lineHeight: 1.1 }}>{dt.getDate()}</div>
                  <div style={{ fontSize: 12, color: color.muted }}>{m.ora}</div>
                </div>
                <div style={{ flex: "1 1 260px", minWidth: 240 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700 }}>{(s && s.parinte) || "—"}</span>
                    <span style={{ fontSize: 12, color: color.muted }}>părintele lui</span>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (s) onOpenStudent(s.id);
                      }}
                      style={{ fontWeight: 600 }}
                    >
                      {s ? s.nume : "elev șters"}
                    </a>
                    <span style={badge(confirmed ? color.blueTint : "#f9dbe6", confirmed ? color.blueDark : color.pinkDark)}>
                      {m.status}
                    </span>
                    <span style={badge("#f1f6fa", "#5b7186")}>Online</span>
                  </div>
                  <div style={{ fontSize: 13, color: color.muted, marginTop: 6 }}>{m.agenda || "fără agendă"}</div>
                  <div style={{ display: "flex", gap: 14, marginTop: 8, fontSize: 12, color: color.mutedLight, flexWrap: "wrap" }}>
                    <span>datele de contact sunt în fișa elevului</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7, marginLeft: "auto" }}>
                  <button onClick={() => toggleStatus(m)} style={{ ...btnPinkGhost, whiteSpace: "nowrap" }}>
                    {confirmed ? "Marchează neconfirmată" : "Confirmă"}
                  </button>
                  <button
                    onClick={() => remove(m)}
                    style={{ border: 0, background: "transparent", color: "#a6b7c6", cursor: "pointer", fontSize: 12 }}
                  >
                    Anulează
                  </button>
                </div>
              </div>
            );
          })}
          {sorted.length === 0 && (
            <div style={{ ...card, padding: 40, textAlign: "center", color: color.muted, fontWeight: 500 }}>
              Nicio întâlnire programată.
            </div>
          )}
        </div>

        <div style={{ ...card, padding: 18, flex: "1 1 280px", minWidth: 270, maxWidth: 340 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button
              onClick={prevMonth}
              style={{ border: `1px solid ${color.border}`, background: "#ffffff", borderRadius: 8, width: 28, height: 28, cursor: "pointer" }}
            >
              ‹
            </button>
            <div style={{ fontWeight: 700 }}>
              {MONTHS_LONG[calMonth]} {calYear}
            </div>
            <button
              onClick={nextMonth}
              style={{ border: `1px solid ${color.border}`, background: "#ffffff", borderRadius: 8, width: 28, height: 28, cursor: "pointer" }}
            >
              ›
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginTop: 14, fontSize: 11, color: "#93a6b8", fontWeight: 700, textAlign: "center" }}>
            {WEEK_DAYS.map((wd) => (
              <div key={wd}>{wd}</div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginTop: 6 }}>
            {cells.map((d, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: "1",
                  borderRadius: 9,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: d.weight,
                  background: d.bg,
                  color: d.fg,
                }}
              >
                <span>{d.label}</span>
                <span style={{ width: 5, height: 5, borderRadius: "50%", marginTop: 3, background: d.dot }} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${color.borderLight}`, fontSize: 12, color: color.muted, display: "flex", flexDirection: "column", gap: 7 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: color.pink }} /> zi cu întâlnire programată
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: color.blue }} /> zi cu evaluare
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
