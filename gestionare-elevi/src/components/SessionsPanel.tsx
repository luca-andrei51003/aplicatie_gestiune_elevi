import { useEffect, useRef, useState, type CSSProperties } from "react";
import * as db from "../lib/db";
import type { Session } from "../lib/types";
import { countWords, fmtDate } from "../lib/format";
import { btnDanger, card, color, input, sectionLabel } from "../lib/ui";

const TOOLBAR: { label: string; title: string; cmd: string; arg?: string; weight: number; italic: boolean; underline: boolean }[] = [
  { label: "B", title: "Bold", cmd: "bold", weight: 700, italic: false, underline: false },
  { label: "I", title: "Italic", cmd: "italic", weight: 500, italic: true, underline: false },
  { label: "U", title: "Subliniat", cmd: "underline", weight: 500, italic: false, underline: true },
  { label: "Titlu", title: "Subtitlu", cmd: "formatBlock", arg: "<h3>", weight: 700, italic: false, underline: false },
  { label: "Text", title: "Paragraf", cmd: "formatBlock", arg: "<p>", weight: 500, italic: false, underline: false },
  { label: "• listă", title: "Listă cu puncte", cmd: "insertUnorderedList", weight: 500, italic: false, underline: false },
  { label: "1. listă", title: "Listă numerotată", cmd: "insertOrderedList", weight: 500, italic: false, underline: false },
  { label: "❝ citat", title: "Citat", cmd: "formatBlock", arg: "<blockquote>", weight: 500, italic: false, underline: false },
];

const fieldLabel: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 5,
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: color.mutedLight,
};

export default function SessionsPanel({ studentId, durataImplicita = 45 }: { studentId: string; durataImplicita?: number }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [savedAt, setSavedAt] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);
  const syncedFor = useRef<string | null>(null);
  const saveTimer = useRef<number | undefined>(undefined);

  const selected = sessions.find((s) => s.id === selectedId) || null;

  async function refresh(keepId: string | null) {
    const list = await db.listSessions(studentId);
    setSessions(list);
    const stillThere = keepId && list.some((s) => s.id === keepId);
    setSelectedId(stillThere ? keepId : list[0]?.id ?? null);
  }

  useEffect(() => {
    syncedFor.current = null;
    refresh(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  useEffect(() => {
    const el = editorRef.current;
    if (!el || !selected) {
      syncedFor.current = null;
      return;
    }
    el.innerHTML = selected.html || "";
    syncedFor.current = selected.id;
    setWordCount(countWords(el.innerText || ""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  function pushEditor() {
    const el = editorRef.current;
    if (!el || !selectedId || syncedFor.current !== selectedId) return;
    const html = el.innerHTML;
    setWordCount(countWords(el.innerText || ""));
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(async () => {
      await db.updateSession(selectedId, { html });
      setSavedAt(Date.now());
      setSessions((prev) => prev.map((s) => (s.id === selectedId ? { ...s, html } : s)));
    }, 350);
  }

  const exec = (cmd: string, arg?: string) => () => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, arg);
    pushEditor();
  };

  async function newSession() {
    const s = await db.createSession(studentId, {
      data: new Date().toISOString().slice(0, 10),
      durata: durataImplicita,
      tip: "Individuală",
      observatii: "",
      html: "",
    });
    syncedFor.current = null;
    await refresh(s.id);
  }

  async function deleteSession() {
    if (!selectedId) return;
    await db.deleteSession(selectedId);
    syncedFor.current = null;
    await refresh(null);
  }

  function patchField(patch: Partial<Pick<Session, "data" | "durata" | "tip" | "observatii">>) {
    if (!selectedId) return;
    setSessions((prev) => prev.map((s) => (s.id === selectedId ? { ...s, ...patch } : s)));
    void db.updateSession(selectedId, patch);
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}>
      <div style={{ ...card, padding: 12, flex: "1 1 250px", minWidth: 240, maxWidth: 300 }}>
        <button
          onClick={newSession}
          style={{
            width: "100%",
            border: `1px dashed ${color.blueSoft}`,
            background: color.blueTint2,
            color: color.blueDark,
            borderRadius: 10,
            padding: 10,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Fișă ședință nouă
        </button>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 10 }}>
          {sessions.map((ss) => (
            <button
              key={ss.id}
              onClick={() => setSelectedId(ss.id)}
              style={{
                textAlign: "left",
                border: `1px solid ${ss.id === selectedId ? color.blueSoft : "#e9f0f6"}`,
                background: ss.id === selectedId ? color.blueTint : "#ffffff",
                borderRadius: 10,
                padding: "11px 12px",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{fmtDate(ss.data)}</span>
                <span style={{ fontSize: 11, color: color.mutedLight }}>{ss.durata}′</span>
              </div>
              <div style={{ fontSize: 12, color: color.muted, marginTop: 3 }}>{ss.tip}</div>
              <div
                style={{
                  fontSize: 12,
                  color: "#93a6b8",
                  marginTop: 4,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {(ss.observatii || "").slice(0, 44) || "fără observații"}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ ...card, padding: "22px 24px", flex: "1 1 420px", minWidth: 0 }}>
        {!selected && (
          <div style={{ padding: "60px 20px", textAlign: "center", color: color.muted, fontWeight: 500 }}>
            Selectează o fișă din stânga sau creează una nouă.
          </div>
        )}
        {selected && (
          <div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
              <label style={fieldLabel}>
                Data
                <input
                  type="date"
                  value={selected.data}
                  onChange={(e) => patchField({ data: e.target.value })}
                  style={{ ...input, textTransform: "none", letterSpacing: 0, fontWeight: 500, width: "auto" }}
                />
              </label>
              <label style={fieldLabel}>
                Durată (min)
                <input
                  type="number"
                  value={selected.durata}
                  onChange={(e) => patchField({ durata: Number(e.target.value) || 0 })}
                  style={{ ...input, width: 96, textTransform: "none", letterSpacing: 0, fontWeight: 500 }}
                />
              </label>
              <label style={fieldLabel}>
                Tip ședință
                <select
                  value={selected.tip}
                  onChange={(e) => patchField({ tip: e.target.value })}
                  style={{ ...input, textTransform: "none", letterSpacing: 0, fontWeight: 500, width: "auto" }}
                >
                  <option>Individuală</option>
                  <option>Grupă particulară</option>
                  <option>Didacto</option>
                </select>
              </label>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: color.mutedLight }}>
                  {savedAt ? "Salvat automat" : "Modificările se salvează automat"}
                </span>
                <button onClick={deleteSession} style={btnDanger}>
                  Șterge fișa
                </button>
              </div>
            </div>

            <div style={{ marginTop: 22 }}>
              <div style={{ ...sectionLabel, marginBottom: 7 }}>Observații</div>
              <textarea
                value={selected.observatii}
                onChange={(e) => patchField({ observatii: e.target.value })}
                placeholder="Comportament, atenție, cooperare, recomandări…"
                style={{ ...input, minHeight: 82, resize: "vertical", lineHeight: 1.55, background: "#fbfdfe" }}
              />
            </div>

            <div style={{ marginTop: 22, border: `1px solid ${color.inputBorder}`, borderRadius: 13, overflow: "hidden" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "8px 10px",
                  background: "#f8fbfd",
                  borderBottom: `1px solid ${color.border}`,
                  flexWrap: "wrap",
                }}
              >
                {TOOLBAR.map((tb) => (
                  <button
                    key={tb.label + tb.title}
                    title={tb.title}
                    onClick={exec(tb.cmd, tb.arg)}
                    style={{
                      minWidth: 32,
                      height: 30,
                      padding: "0 9px",
                      border: `1px solid ${color.border}`,
                      background: "#ffffff",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: tb.weight,
                      fontStyle: tb.italic ? "italic" : "normal",
                      textDecoration: tb.underline ? "underline" : "none",
                      fontSize: 13,
                    }}
                  >
                    {tb.label}
                  </button>
                ))}
                <span style={{ marginLeft: "auto", fontSize: 11, color: "#93a6b8" }}>{wordCount} cuvinte</span>
              </div>
              <div
                ref={editorRef}
                contentEditable
                onInput={pushEditor}
                data-ph="Ce am lucrat în această ședință…"
                style={{ minHeight: 300, padding: "22px 26px", lineHeight: 1.7, fontSize: 15, background: "#ffffff" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
