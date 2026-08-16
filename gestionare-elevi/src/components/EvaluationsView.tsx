import { useEffect, useState } from "react";
import * as db from "../lib/db";
import type { EvalStudentRow, Evaluation, Student } from "../lib/types";
import { fmtDate, fmtGrade, gradeColors } from "../lib/format";
import { badge, btnDanger, btnGhost, btnPink, btnPrimary, card, color, input, sectionLabel } from "../lib/ui";
import DeleteButton from "./DeleteButton";
import ConfirmDialog from "./ConfirmDialog";

export default function EvaluationsView({
  evals,
  students,
  selectedEvalId,
  onSelectEval,
  onRefreshEvals,
  onNewEval,
  onOpenStudent,
  flash,
}: {
  evals: Evaluation[];
  students: Student[];
  selectedEvalId: string | null;
  onSelectEval: (id: string) => void;
  onRefreshEvals: () => Promise<void> | void;
  onNewEval: () => void;
  onOpenStudent: (id: string, tab?: "sesiuni" | "note") => void;
  flash: (msg: string) => void;
}) {
  const ev = evals.find((e) => e.id === selectedEvalId) || null;
  const [rows, setRows] = useState<EvalStudentRow[]>([]);
  const [addStudentId, setAddStudentId] = useState("");
  const [summary, setSummary] = useState<Record<string, { total: number; done: number }>>({});
  const [reopenStage, setReopenStage] = useState<0 | 1 | 2>(0);

  async function refreshRows() {
    if (!ev) return setRows([]);
    setRows(await db.listEvalStudents(ev.id));
  }

  async function refreshSummary() {
    const s = await db.listEvalRosterSummary();
    setSummary(Object.fromEntries(s.map((r) => [r.eval_id, { total: r.total, done: r.done }])));
  }

  useEffect(() => {
    refreshRows();
    setAddStudentId("");
    setReopenStage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEvalId]);

  useEffect(() => {
    refreshSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evals]);

  function patchEval(patch: Partial<Omit<Evaluation, "id">>) {
    if (!ev) return;
    void db.updateEval(ev.id, patch).then(() => onRefreshEvals());
  }

  async function addToEval() {
    if (!ev || !addStudentId) return;
    await db.addStudentToEval(ev.id, addStudentId);
    setAddStudentId("");
    await refreshRows();
    await refreshSummary();
  }

  async function removeFromEval(studentId: string) {
    if (!ev) return;
    await db.removeStudentFromEval(ev.id, studentId);
    await refreshRows();
    await refreshSummary();
  }

  async function setNota(studentId: string, nota: string) {
    if (!ev) return;
    setRows((prev) => prev.map((r) => (r.student_id === studentId ? { ...r, nota } : r)));
    await db.setEvalGrade(ev.id, studentId, nota);
    await refreshSummary();
  }

  async function publish() {
    if (!ev) return;
    const n = await db.publishEval(ev.id);
    flash(n ? n + " note trecute în fișe · evaluare închisă" : "Nu există note completate");
    if (n) await onRefreshEvals();
  }

  async function reopen() {
    if (!ev) return;
    await db.reopenEval(ev.id);
    setReopenStage(0);
    await onRefreshEvals();
    flash("Evaluare redeschisă");
  }

  async function removeEval() {
    if (!ev) return;
    await db.deleteEval(ev.id);
    await onRefreshEvals();
  }

  const options = students.filter((s) => !rows.some((r) => r.student_id === s.id));

  return (
    <div className="ge-in">
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: "'Instrument Serif', serif", fontSize: 40, fontWeight: 400 }}>Evaluări</h1>
          <p style={{ margin: "6px 0 0", color: color.muted }}>Programează testele și trece notele direct în fișele elevilor.</p>
        </div>
        <button style={btnPrimary} onClick={onNewEval}>
          + Evaluare nouă
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginTop: 26, alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: "1 1 280px", minWidth: 260, maxWidth: 340 }}>
          {evals.map((e) => {
            const s = summary[e.id] || { total: 0, done: 0 };
            const pct = s.total ? Math.round((s.done / s.total) * 100) : 0;
            return (
              <button
                key={e.id}
                onClick={() => onSelectEval(e.id)}
                style={{
                  textAlign: "left",
                  background: e.id === selectedEvalId ? color.blueTint : "#ffffff",
                  border: `1px solid ${e.id === selectedEvalId ? color.blueSoft : color.border}`,
                  borderRadius: 13,
                  padding: "15px 16px",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
                  <span style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 7 }}>
                    {e.titlu}
                    {!!e.closed && <span style={badge("#f1f6fa", "#5b7186")}>Închisă</span>}
                  </span>
                  <span style={{ fontSize: 12, color: color.muted, whiteSpace: "nowrap" }}>{fmtDate(e.data)}</span>
                </div>
                <div style={{ fontSize: 12, color: color.muted, marginTop: 5 }}>
                  {e.materie || "—"} · clasa {e.clasa || "—"} · {s.total} elevi
                </div>
                <div style={{ marginTop: 9, height: 5, borderRadius: 99, background: "#e8eff6", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: pct + "%", background: pct === 100 ? color.blue : color.pink }} />
                </div>
                <div style={{ fontSize: 11, color: color.mutedLight, marginTop: 5 }}>
                  {s.done} / {s.total} note completate
                </div>
              </button>
            );
          })}
          {evals.length === 0 && (
            <div style={{ ...card, padding: 40, textAlign: "center", color: color.muted, fontWeight: 500 }}>Nicio evaluare programată.</div>
          )}
        </div>

        <div style={{ ...card, padding: "22px 24px", flex: "1 1 460px", minWidth: 0 }}>
          {!ev && (
            <div style={{ padding: "60px 20px", textAlign: "center", color: color.muted, fontWeight: 500 }}>
              Selectează o evaluare din stânga sau creează una nouă.
            </div>
          )}
          {ev && (
            <div key={ev.id}>
              {!!ev.closed && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                    background: "#f1f6fa",
                    border: `1px solid ${color.border}`,
                    borderRadius: 11,
                    padding: "10px 14px",
                    marginBottom: 16,
                  }}
                >
                  <span style={{ fontSize: 13, color: "#5b7186" }}>
                    🔒 Evaluare închisă — notele au fost trecute în fișele elevilor. Detaliile nu mai pot fi editate.
                  </span>
                  <button style={btnGhost} onClick={() => setReopenStage(1)}>
                    Redeschide evaluarea
                  </button>
                </div>
              )}

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
                <label style={{ ...sectionLabel, display: "flex", flexDirection: "column", gap: 5, flex: 1, minWidth: 200 }}>
                  Titlu
                  <input
                    defaultValue={ev.titlu}
                    disabled={!!ev.closed}
                    onBlur={(e) => patchEval({ titlu: e.target.value })}
                    style={{ ...input, textTransform: "none", letterSpacing: 0, fontWeight: 600, background: ev.closed ? "#f8fbfd" : "#fff" }}
                  />
                </label>
                <label style={{ ...sectionLabel, display: "flex", flexDirection: "column", gap: 5 }}>
                  Materie
                  <input
                    defaultValue={ev.materie}
                    disabled={!!ev.closed}
                    onBlur={(e) => patchEval({ materie: e.target.value })}
                    style={{ ...input, textTransform: "none", letterSpacing: 0, fontWeight: 500, background: ev.closed ? "#f8fbfd" : "#fff" }}
                  />
                </label>
                <label style={{ ...sectionLabel, display: "flex", flexDirection: "column", gap: 5 }}>
                  Data
                  <input
                    type="date"
                    defaultValue={ev.data}
                    disabled={!!ev.closed}
                    onBlur={(e) => patchEval({ data: e.target.value })}
                    style={{ ...input, textTransform: "none", letterSpacing: 0, fontWeight: 500, width: "auto", background: ev.closed ? "#f8fbfd" : "#fff" }}
                  />
                </label>
                <label style={{ ...sectionLabel, display: "flex", flexDirection: "column", gap: 5 }}>
                  Ora
                  <input
                    defaultValue={ev.ora}
                    disabled={!!ev.closed}
                    onBlur={(e) => patchEval({ ora: e.target.value })}
                    style={{ ...input, width: 90, textTransform: "none", letterSpacing: 0, fontWeight: 500, background: ev.closed ? "#f8fbfd" : "#fff" }}
                  />
                </label>
                <button onClick={removeEval} style={btnDanger}>
                  Șterge
                </button>
              </div>

              <div style={{ marginTop: 20 }}>
                <div style={{ ...sectionLabel, marginBottom: 7 }}>Descriere / competențe evaluate</div>
                <textarea
                  defaultValue={ev.descriere}
                  disabled={!!ev.closed}
                  onBlur={(e) => patchEval({ descriere: e.target.value })}
                  placeholder="Ce se evaluează, structura testului, bareme…"
                  style={{ ...input, minHeight: 70, resize: "vertical", lineHeight: 1.55, background: ev.closed ? "#f8fbfd" : "#fbfdfe" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "24px 0 10px", gap: 12, flexWrap: "wrap" }}>
                <div style={{ fontWeight: 700 }}>Elevi înscriși și note</div>
                {!ev.closed && (
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <select value={addStudentId} onChange={(e) => setAddStudentId(e.target.value)} style={input}>
                      <option value="">Adaugă elev…</option>
                      {options.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nume}
                        </option>
                      ))}
                    </select>
                    <button onClick={addToEval} style={{ ...btnPrimary, whiteSpace: "nowrap" }}>
                      Adaugă
                    </button>
                  </div>
                )}
              </div>

              <div style={{ border: `1px solid ${color.border}`, borderRadius: 13, overflow: "hidden" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 0.8fr 1fr 1.2fr 40px",
                    gap: 12,
                    padding: "11px 18px",
                    background: "#f8fbfd",
                    borderBottom: `1px solid ${color.border}`,
                    ...sectionLabel,
                  }}
                >
                  <div>Elev</div>
                  <div>Clasa</div>
                  <div>Notă</div>
                  <div>Fișă</div>
                  <div />
                </div>
                {rows.map((r, i) => (
                  <div
                    key={r.student_id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 0.8fr 1fr 1.2fr 40px",
                      gap: 12,
                      padding: "11px 18px",
                      borderBottom: `1px solid ${color.borderLight}`,
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          background: i % 2 ? "#f9dbe6" : "#dbeaf6",
                          color: i % 2 ? color.pinkDark : color.blueDark,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: 11,
                        }}
                      >
                        {r.nume.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("")}
                      </div>
                      <span style={{ fontWeight: 600 }}>{r.nume}</span>
                    </div>
                    <div style={{ color: color.muted }}>{r.clasa}</div>
                    <div>
                      {ev.closed ? (
                        r.nota ? (
                          <span style={badge(gradeColors(r.nota).bg, gradeColors(r.nota).fg)} title="Trecută în fișă">
                            ✓ {fmtGrade(r.nota)}
                          </span>
                        ) : (
                          <span style={{ color: color.mutedLight }}>—</span>
                        )
                      ) : (
                        <input
                          value={r.nota ?? ""}
                          onChange={(e) => setNota(r.student_id, e.target.value)}
                          placeholder="—"
                          style={{ ...input, width: 70, fontWeight: 700, textAlign: "center" }}
                        />
                      )}
                    </div>
                    <div>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onOpenStudent(r.student_id, "note");
                        }}
                        style={{ fontWeight: 600 }}
                      >
                        deschide fișa →
                      </a>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      {!ev.closed && <DeleteButton onClick={() => removeFromEval(r.student_id)} title="Scoate elevul din evaluare" />}
                    </div>
                  </div>
                ))}
              </div>
              {!ev.closed && (
                <div style={{ display: "flex", gap: 10, marginTop: 16, alignItems: "center" }}>
                  <button onClick={publish} style={btnPink}>
                    Trece notele în fișe
                  </button>
                  <span style={{ fontSize: 12, color: color.mutedLight }}>Notele completate apar în secțiunea Note a fiecărui elev.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {reopenStage === 1 && (
        <ConfirmDialog
          title="Redeschizi evaluarea?"
          message="Notele au fost deja trecute în fișele elevilor. Redeschiderea permite modificarea lor — trebuie confirmată de două ori."
          confirmLabel="Continuă"
          onCancel={() => setReopenStage(0)}
          onConfirm={() => setReopenStage(2)}
        />
      )}
      {reopenStage === 2 && (
        <ConfirmDialog
          title="Confirmă din nou"
          message="Ești absolut sigur? Notele deja trecute în fișe NU se șterg automat — dacă modifici o notă aici, va trebui să apeși din nou „Trece notele în fișe” ca fișa elevului să reflecte schimbarea."
          confirmLabel="Da, redeschide"
          onCancel={() => setReopenStage(0)}
          onConfirm={reopen}
        />
      )}
    </div>
  );
}
