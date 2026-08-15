import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as db from "./lib/db";
import type { MeetingInput, StudentInput } from "./lib/db";
import type { Evaluation, Meeting, Student } from "./lib/types";
import { fmtDate, todayIso } from "./lib/format";
import { color } from "./lib/ui";
import Sidebar from "./components/Sidebar";
import StudentsView from "./components/StudentsView";
import StudentDetail from "./components/StudentDetail";
import MeetingsView from "./components/MeetingsView";
import EvaluationsView from "./components/EvaluationsView";
import StudentModal from "./components/StudentModal";
import MeetingModal from "./components/MeetingModal";
import Toast from "./components/Toast";

export type View = "elevi" | "detaliu" | "parinti" | "evaluari";

function App() {
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [evals, setEvals] = useState<Evaluation[]>([]);

  const [view, setView] = useState<View>("elevi");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<"sesiuni" | "note">("sesiuni");
  const [selectedEvalId, setSelectedEvalId] = useState<string | null>(null);

  const [studentModal, setStudentModal] = useState<{ editingId: string | null } | null>(null);
  const [meetingModal, setMeetingModal] = useState<{ studentId: string | null } | null>(null);

  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | undefined>(undefined);

  const refreshStudents = useCallback(async () => setStudents(await db.listStudents()), []);
  const refreshMeetings = useCallback(async () => setMeetings(await db.listMeetings()), []);
  const refreshEvals = useCallback(async () => setEvals(await db.listEvals()), []);

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([refreshStudents(), refreshMeetings(), refreshEvals()]);
        setReady(true);
      } catch (err) {
        console.error(err);
        setLoadError(err instanceof Error ? err.message : String(err));
      }
    })();
  }, [refreshStudents, refreshMeetings, refreshEvals]);

  const flash = useCallback((msg: string) => {
    window.clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = window.setTimeout(() => setToast(""), 2400);
  }, []);

  const selectedStudent = students.find((s) => s.id === selectedId) || null;

  function openStudent(id: string, tab?: "sesiuni" | "note") {
    setSelectedId(id);
    setDetailTab(tab ?? "sesiuni");
    setView("detaliu");
  }

  function backToList() {
    setView("elevi");
    setSelectedId(null);
  }

  function newStudent() {
    setStudentModal({ editingId: null });
  }
  function editStudent() {
    if (selectedId) setStudentModal({ editingId: selectedId });
  }
  async function saveStudent(input: StudentInput) {
    if (studentModal?.editingId) {
      await db.updateStudent(studentModal.editingId, input);
      flash("Fișă actualizată");
      setStudentModal(null);
      await refreshStudents();
    } else {
      const s = await db.createStudent(input);
      setStudentModal(null);
      await refreshStudents();
      flash("Elev adăugat");
      openStudent(s.id);
    }
  }
  async function deleteStudent() {
    if (!selectedId) return;
    await db.deleteStudent(selectedId);
    backToList();
    await Promise.all([refreshStudents(), refreshMeetings()]);
    flash("Elev șters din evidență");
  }

  function goParinti() {
    setView("parinti");
  }
  function newMeeting() {
    setMeetingModal({ studentId: students[0]?.id ?? null });
  }
  function meetingForStudent() {
    setMeetingModal({ studentId: selectedId });
  }
  async function saveMeeting(input: MeetingInput) {
    await db.createMeeting(input);
    setMeetingModal(null);
    setView("parinti");
    await refreshMeetings();
    flash("Întâlnire programată · invitație pregătită");
  }

  function openEval(evalId: string) {
    setSelectedEvalId(evalId);
    setView("evaluari");
  }
  async function newEval() {
    const e = await db.createEval({ titlu: "Evaluare nouă", materie: "", data: todayIso(), ora: "10:00", clasa: "", descriere: "" });
    await refreshEvals();
    setSelectedEvalId(e.id);
    setView("evaluari");
  }

  const upcomingMeetings = useMemo(
    () =>
      meetings
        .filter((m) => m.data >= todayIso())
        .sort((a, b) => (a.data + a.ora).localeCompare(b.data + b.ora)),
    [meetings]
  );
  const nextMeeting = upcomingMeetings[0];
  const nextMeetingStudent = nextMeeting ? students.find((s) => s.id === nextMeeting.student_id) : null;

  useEffect(() => {
    if (!selectedEvalId && evals.length) setSelectedEvalId(evals[0].id);
  }, [evals, selectedEvalId]);

  if (loadError) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center", justifyContent: "center", height: "100vh", padding: 40, textAlign: "center" }}>
        <div style={{ fontWeight: 700, color: color.danger }}>Nu s-a putut încărca baza de date.</div>
        <div style={{ color: color.muted, fontFamily: "monospace", fontSize: 13, maxWidth: 560 }}>{loadError}</div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: color.muted }}>
        Se încarcă…
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: color.text, fontSize: 14 }}>
      <Sidebar
        activeView={view}
        counts={{ elevi: students.length, parinti: meetings.length, evaluari: evals.length }}
        onNavigate={(v) => setView(v)}
        nextMeetingLabel={nextMeetingStudent ? nextMeetingStudent.nume : "Nicio programare"}
        nextMeetingWhen={nextMeeting ? fmtDate(nextMeeting.data) + " · " + nextMeeting.ora : "Adaugă una din secțiunea Întâlniri"}
        onGoParinti={goParinti}
      />

      <main style={{ flex: 1, minWidth: 0, padding: "30px 36px 60px" }}>
        {view === "elevi" && (
          <StudentsView
            students={students}
            meetingsCount={upcomingMeetings.length}
            onOpenStudent={openStudent}
            onNewStudent={newStudent}
          />
        )}

        {view === "detaliu" && selectedStudent && (
          <StudentDetail
            key={selectedStudent.id}
            student={selectedStudent}
            initialTab={detailTab}
            onBack={backToList}
            onEdit={editStudent}
            onScheduleMeeting={meetingForStudent}
            onDelete={deleteStudent}
            onOpenEval={openEval}
          />
        )}

        {view === "parinti" && (
          <MeetingsView
            meetings={meetings}
            evals={evals}
            students={students}
            onRefresh={refreshMeetings}
            onNewMeeting={newMeeting}
            onOpenStudent={openStudent}
            flash={flash}
          />
        )}

        {view === "evaluari" && (
          <EvaluationsView
            evals={evals}
            students={students}
            selectedEvalId={selectedEvalId}
            onSelectEval={setSelectedEvalId}
            onRefreshEvals={refreshEvals}
            onNewEval={newEval}
            onOpenStudent={openStudent}
            flash={flash}
          />
        )}
      </main>

      {studentModal && (
        <StudentModal
          editing={studentModal.editingId ? students.find((s) => s.id === studentModal.editingId) ?? null : null}
          onCancel={() => setStudentModal(null)}
          onSave={saveStudent}
        />
      )}

      {meetingModal && (
        <MeetingModal
          students={students}
          defaultStudentId={meetingModal.studentId}
          onCancel={() => setMeetingModal(null)}
          onSave={saveMeeting}
        />
      )}

      <Toast message={toast} />
    </div>
  );
}

export default App;
