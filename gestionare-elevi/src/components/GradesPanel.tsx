import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import * as db from "../lib/db";
import type { Grade, Student } from "../lib/types";
import { average, fmtDate, fmtGrade, gradeColors, todayIso } from "../lib/format";
import { badge, btnGhost, btnPrimary, card, color, input, sectionLabel } from "../lib/ui";
import DeleteButton from "./DeleteButton";

export default function GradesPanel({
  student,
  onOpenEval,
  flash,
}: {
  student: Student;
  onOpenEval: (evalId: string) => void;
  flash: (msg: string) => void;
}) {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [evalTitles, setEvalTitles] = useState<Record<string, string>>({});
  const [materie, setMaterie] = useState("");
  const [dataNota, setDataNota] = useState(todayIso());
  const [sursa, setSursa] = useState("Oral");
  const [valoare, setValoare] = useState("");
  const [notite, setNotite] = useState(student.notite);
  const notiteTimer = useRef<number | undefined>(undefined);

  async function refresh() {
    setGrades(await db.listGrades(student.id));
  }

  useEffect(() => {
    refresh();
    setNotite(student.notite);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student.id]);

  useEffect(() => {
    if (!grades.some((g) => g.eval_id)) return;
    (async () => {
      const evals = await db.listEvals();
      setEvalTitles(Object.fromEntries(evals.map((e) => [e.id, e.titlu])));
    })();
  }, [grades]);

  const avg = average(grades.map((g) => g.valoare));

  async function addGrade() {
    if (!materie || !valoare) return flash("Completează materia și nota");
    try {
      await db.createGrade(student.id, { materie, valoare, data: dataNota || todayIso(), sursa });
      setMaterie("");
      setValoare("");
      await refresh();
    } catch (err) {
      console.error(err);
      flash("Eroare la salvarea notei: " + (err instanceof Error ? err.message : String(err)));
    }
  }

  async function removeGrade(id: string) {
    await db.deleteGrade(id);
    await refresh();
  }

  function onNotite(v: string) {
    setNotite(v);
    window.clearTimeout(notiteTimer.current);
    notiteTimer.current = window.setTimeout(() => {
      void db.updateStudent(student.id, { notite: v });
    }, 400);
  }

  const printTh: CSSProperties = {
    textAlign: "left",
    padding: "8px 10px",
    borderBottom: "2px solid #333",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  };
  const printTd: CSSProperties = {
    padding: "8px 10px",
    borderBottom: "1px solid #ddd",
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <button onClick={() => window.print()} style={btnGhost}>
          ⬇ Generează raport PDF
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}>
      <div style={{ ...card, overflow: "hidden", flex: "1 1 420px", minWidth: 0 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1.2fr 0.6fr 40px",
            gap: 12,
            padding: "13px 20px",
            background: "#f8fbfd",
            borderBottom: `1px solid ${color.border}`,
            ...sectionLabel,
          }}
        >
          <div>Materie</div>
          <div>Data</div>
          <div>Sursă</div>
          <div>Notă</div>
          <div />
        </div>
        {grades.map((g) => {
          const c = gradeColors(g.valoare);
          return (
            <div
              key={g.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 1fr 1.2fr 0.6fr 40px",
                gap: 12,
                padding: "13px 20px",
                borderBottom: `1px solid ${color.borderLight}`,
                alignItems: "center",
              }}
            >
              <div style={{ fontWeight: 600 }}>{g.materie}</div>
              <div style={{ color: color.muted }}>{fmtDate(g.data)}</div>
              <div>
                {g.eval_id ? (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onOpenEval(g.eval_id!);
                    }}
                    style={{ fontWeight: 600 }}
                  >
                    {evalTitles[g.eval_id] || "Evaluare"}
                  </a>
                ) : (
                  <span>{g.sursa || "—"}</span>
                )}
              </div>
              <div>
                <span style={badge(c.bg, c.fg)}>{fmtGrade(g.valoare)}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <DeleteButton onClick={() => removeGrade(g.id)} title="Șterge nota" />
              </div>
            </div>
          );
        })}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1.2fr 0.6fr 40px",
            gap: 12,
            padding: "14px 20px",
            alignItems: "center",
            background: "#fbfdfe",
          }}
        >
          <input value={materie} onChange={(e) => setMaterie(e.target.value)} placeholder="Materie" style={input} />
          <input type="date" value={dataNota} onChange={(e) => setDataNota(e.target.value)} style={input} />
          <select value={sursa} onChange={(e) => setSursa(e.target.value)} style={input}>
            <option>Oral</option>
            <option>Temă</option>
            <option>Ședință individuală</option>
          </select>
          <input value={valoare} onChange={(e) => setValoare(e.target.value)} placeholder="notă" style={{ ...input, textAlign: "center", fontWeight: 700 }} />
          <button onClick={addGrade} style={{ ...btnPrimary, padding: 9 }}>
            +
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: "1 1 260px", minWidth: 250, maxWidth: 320 }}>
        <div style={{ ...card, padding: 18 }}>
          <div style={sectionLabel}>Media generală</div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 46, lineHeight: 1.1, marginTop: 4 }}>
            {avg === null ? "—" : fmtGrade(avg)}
          </div>
          <div style={{ fontSize: 12, color: color.muted }}>din {grades.length} note · scala 1–10</div>
        </div>
        <div style={{ background: color.pinkTint, border: `1px solid ${color.pinkSoft}`, borderRadius: 14, padding: 18 }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", color: color.pink, fontWeight: 700 }}>
            Note interne
          </div>
          <textarea
            value={notite}
            onChange={(e) => onNotite(e.target.value)}
            placeholder="Observații generale despre elev, context familial, plan de intervenție…"
            style={{
              width: "100%",
              minHeight: 190,
              marginTop: 10,
              resize: "vertical",
              border: `1px solid ${color.pinkSoft}`,
              borderRadius: 11,
              padding: 12,
              lineHeight: 1.6,
              background: "#ffffff",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>
      </div>

      {createPortal(
        <div id="ge-print-report">
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 26, margin: "0 0 4px" }}>{student.nume}</h1>
          <div style={{ color: "#333", marginBottom: 4 }}>
            {[student.clasa, student.parinte].filter(Boolean).join(" · ")}
          </div>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 20 }}>Raport generat la {fmtDate(todayIso())}</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={printTh}>Materie</th>
                <th style={printTh}>Data</th>
                <th style={printTh}>Sursă</th>
                <th style={printTh}>Notă</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g) => (
                <tr key={g.id}>
                  <td style={printTd}>{g.materie}</td>
                  <td style={printTd}>{fmtDate(g.data)}</td>
                  <td style={printTd}>{g.eval_id ? evalTitles[g.eval_id] || "Evaluare" : g.sursa || "—"}</td>
                  <td style={printTd}>{fmtGrade(g.valoare)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {grades.length === 0 && <div style={{ padding: "16px 0", color: "#666" }}>Nicio notă înregistrată.</div>}
          <div style={{ marginTop: 20, fontWeight: 700 }}>
            Media generală: {avg === null ? "—" : fmtGrade(avg)} (din {grades.length} note)
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
