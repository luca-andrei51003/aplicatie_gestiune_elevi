import { useEffect, useMemo, useState } from "react";
import type { Student } from "../lib/types";
import * as db from "../lib/db";
import { fmtDate, fmtGrade, gradeColors, initials } from "../lib/format";
import { badge, btnPrimary, card, color, input, sectionLabel } from "../lib/ui";

export default function StudentsView({
  students,
  meetingsCount,
  onOpenStudent,
  onNewStudent,
}: {
  students: Student[];
  meetingsCount: number;
  onOpenStudent: (id: string) => void;
  onNewStudent: () => void;
}) {
  const [query, setQuery] = useState("");
  const [sessionSummary, setSessionSummary] = useState<Record<string, { cnt: number; last_data: string }>>({});
  const [gradeSummary, setGradeSummary] = useState<Record<string, { cnt: number; avg: number }>>({});
  const [totalSessions, setTotalSessions] = useState(0);
  const [overallAvg, setOverallAvg] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const [sess, grades, total, allGrades] = await Promise.all([
        db.listSessionSummary(),
        db.listGradeSummary(),
        db.countSessions(),
        db.listAllGrades(),
      ]);
      setSessionSummary(Object.fromEntries(sess.map((r) => [r.student_id, r])));
      setGradeSummary(Object.fromEntries(grades.map((r) => [r.student_id, r])));
      setTotalSessions(total);
      setOverallAvg(
        allGrades.length ? allGrades.reduce((a, g) => a + (Number(g.valoare) || 0), 0) / allGrades.length : null
      );
    })();
  }, [students]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => s.nume.toLowerCase().includes(q) || s.clasa.toLowerCase().includes(q));
  }, [students, query]);

  const stats = [
    { label: "Elevi activi", value: String(students.length), note: "în evidență" },
    { label: "Fișe de ședință", value: String(totalSessions), note: "total înregistrate" },
    { label: "Întâlniri viitoare", value: String(meetingsCount), note: "cu părinții" },
    { label: "Medie generală", value: overallAvg === null ? "—" : fmtGrade(overallAvg), note: "scala 1–10" },
  ];

  return (
    <div className="ge-in">
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: "'Instrument Serif', serif", fontSize: 40, fontWeight: 400, letterSpacing: "-0.01em" }}>
            Elevi
          </h1>
          <p style={{ margin: "6px 0 0", color: color.muted }}>Fișe individuale, ședințe și note.</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Caută nume sau clasă…"
            style={{ ...input, width: 240 }}
          />
          <button style={btnPrimary} onClick={onNewStudent}>
            + Elev nou
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginTop: 26 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ ...card, padding: "16px 18px" }}>
            <div style={sectionLabel}>{s.label}</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, marginTop: 6 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: color.muted }}>{s.note}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 26, ...card, overflow: "hidden" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2.2fr 0.8fr 1.6fr 1fr 0.9fr 40px",
            gap: 12,
            padding: "13px 20px",
            background: "#f8fbfd",
            borderBottom: `1px solid ${color.border}`,
            ...sectionLabel,
          }}
        >
          <div>Elev</div>
          <div>Clasa</div>
          <div>Părinte / contact</div>
          <div>Ședințe</div>
          <div>Medie</div>
          <div />
        </div>
        {filtered.map((s, i) => {
          const g = gradeSummary[s.id];
          const sess = sessionSummary[s.id];
          const c = g ? gradeColors(g.avg) : gradeColors("");
          return (
            <div
              key={s.id}
              onClick={() => onOpenStudent(s.id)}
              style={{
                display: "grid",
                gridTemplateColumns: "2.2fr 0.8fr 1.6fr 1fr 0.9fr 40px",
                gap: 12,
                padding: "14px 20px",
                borderBottom: `1px solid ${color.borderLight}`,
                alignItems: "center",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fbfd")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    flex: "0 0 36px",
                    borderRadius: "50%",
                    background: i % 2 ? "#f9dbe6" : "#dbeaf6",
                    color: i % 2 ? color.pinkDark : color.blueDark,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 12,
                  }}
                >
                  {initials(s.nume)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600 }}>{s.nume}</div>
                  <div style={{ fontSize: 12, color: color.mutedLight }}>
                    ultima ședință · {sess ? fmtDate(sess.last_data) : "fără ședințe"}
                  </div>
                </div>
              </div>
              <div style={{ color: "#4a6379" }}>{s.clasa}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: "#4a6379" }}>{s.parinte}</div>
                <div style={{ fontSize: 12, color: color.mutedLight, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {s.email}
                </div>
              </div>
              <div style={{ color: "#4a6379" }}>{sess?.cnt ?? 0}</div>
              <div>
                <span style={badge(c.bg, c.fg)}>{g ? fmtGrade(g.avg) : "—"}</span>
              </div>
              <div style={{ textAlign: "right", color: "#b4c4d2" }}>›</div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: color.muted, fontWeight: 500 }}>Niciun elev nu corespunde căutării.</div>
        )}
      </div>
    </div>
  );
}
