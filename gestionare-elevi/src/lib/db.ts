import Database from "@tauri-apps/plugin-sql";
import type { Evaluation, EvalStudentRow, Grade, Meeting, Session, Student } from "./types";

const DB_URL = "sqlite:gestionare.db";
let dbPromise: Promise<Database> | null = null;

function getDb(): Promise<Database> {
  if (!dbPromise) dbPromise = Database.load(DB_URL);
  return dbPromise;
}

const uid = () => crypto.randomUUID();

// ---------- Students ----------

export async function listStudents(): Promise<Student[]> {
  const db = await getDb();
  return db.select<Student[]>("SELECT * FROM students ORDER BY nume COLLATE NOCASE");
}

export type StudentInput = Omit<Student, "id">;

export async function createStudent(input: StudentInput): Promise<Student> {
  const db = await getDb();
  const id = uid();
  await db.execute(
    `INSERT INTO students (id, nume, clasa, varsta, parinte, email, telefon, notite)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [id, input.nume, input.clasa, input.varsta, input.parinte, input.email, input.telefon, input.notite]
  );
  return { id, ...input };
}

export async function updateStudent(id: string, patch: Partial<StudentInput>): Promise<void> {
  const db = await getDb();
  const fields = Object.keys(patch);
  if (!fields.length) return;
  const set = fields.map((f, i) => `${f} = $${i + 2}`).join(", ");
  await db.execute(`UPDATE students SET ${set} WHERE id = $1`, [id, ...fields.map((f) => (patch as Record<string, unknown>)[f])]);
}

export async function deleteStudent(id: string): Promise<void> {
  const db = await getDb();
  await db.execute("DELETE FROM sessions WHERE student_id = $1", [id]);
  await db.execute("DELETE FROM grades WHERE student_id = $1", [id]);
  await db.execute("DELETE FROM meetings WHERE student_id = $1", [id]);
  await db.execute("DELETE FROM eval_students WHERE student_id = $1", [id]);
  await db.execute("DELETE FROM students WHERE id = $1", [id]);
}

// ---------- Sessions ----------

export async function listSessions(studentId: string): Promise<Session[]> {
  const db = await getDb();
  return db.select<Session[]>("SELECT * FROM sessions WHERE student_id = $1 ORDER BY data DESC", [studentId]);
}

export async function createSession(studentId: string, input: Partial<Omit<Session, "id" | "student_id">>): Promise<Session> {
  const db = await getDb();
  const id = uid();
  const data = input.data ?? new Date().toISOString().slice(0, 10);
  const durata = input.durata ?? 45;
  const tip = input.tip ?? "Individuală";
  const observatii = input.observatii ?? "";
  const html = input.html ?? "";
  await db.execute(
    `INSERT INTO sessions (id, student_id, data, durata, tip, observatii, html) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [id, studentId, data, durata, tip, observatii, html]
  );
  return { id, student_id: studentId, data, durata, tip, observatii, html };
}

export async function updateSession(id: string, patch: Partial<Omit<Session, "id" | "student_id">>): Promise<void> {
  const db = await getDb();
  const fields = Object.keys(patch);
  if (!fields.length) return;
  const set = fields.map((f, i) => `${f} = $${i + 2}`).join(", ");
  await db.execute(`UPDATE sessions SET ${set} WHERE id = $1`, [id, ...fields.map((f) => (patch as Record<string, unknown>)[f])]);
}

export async function deleteSession(id: string): Promise<void> {
  const db = await getDb();
  await db.execute("DELETE FROM sessions WHERE id = $1", [id]);
}

/** One row per student that has at least one session — used by the student
 *  list so it doesn't need an N+1 query per row. */
export async function listSessionSummary(): Promise<{ student_id: string; cnt: number; last_data: string }[]> {
  const db = await getDb();
  return db.select("SELECT student_id, COUNT(*) as cnt, MAX(data) as last_data FROM sessions GROUP BY student_id");
}

export async function countSessions(): Promise<number> {
  const db = await getDb();
  const rows = await db.select<{ n: number }[]>("SELECT COUNT(*) as n FROM sessions");
  return rows[0]?.n ?? 0;
}

// ---------- Grades ----------

export async function listGrades(studentId: string): Promise<Grade[]> {
  const db = await getDb();
  return db.select<Grade[]>("SELECT * FROM grades WHERE student_id = $1 ORDER BY data DESC", [studentId]);
}

export async function listAllGrades(): Promise<Grade[]> {
  const db = await getDb();
  return db.select<Grade[]>("SELECT * FROM grades");
}

/** One row per student that has at least one grade — used by the student
 *  list so it doesn't need an N+1 query per row. Non-numeric `valoare`
 *  casts to 0, matching the plain `Number(v) || 0` used elsewhere. */
export async function listGradeSummary(): Promise<{ student_id: string; cnt: number; avg: number }[]> {
  const db = await getDb();
  return db.select("SELECT student_id, COUNT(*) as cnt, AVG(CAST(valoare AS REAL)) as avg FROM grades GROUP BY student_id");
}

export async function createGrade(studentId: string, input: { materie: string; valoare: string; data: string; sursa: string; eval_id?: string | null }): Promise<Grade> {
  const db = await getDb();
  const id = uid();
  const eval_id = input.eval_id ?? null;
  await db.execute(
    `INSERT INTO grades (id, student_id, materie, valoare, data, sursa, eval_id) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [id, studentId, input.materie, input.valoare, input.data, input.sursa, eval_id]
  );
  return { id, student_id: studentId, materie: input.materie, valoare: input.valoare, data: input.data, sursa: input.sursa, eval_id };
}

export async function deleteGrade(id: string): Promise<void> {
  const db = await getDb();
  await db.execute("DELETE FROM grades WHERE id = $1", [id]);
}

// ---------- Meetings ----------

export async function listMeetings(): Promise<Meeting[]> {
  const db = await getDb();
  return db.select<Meeting[]>("SELECT * FROM meetings ORDER BY data, ora");
}

export type MeetingInput = Omit<Meeting, "id">;

export async function createMeeting(input: MeetingInput): Promise<Meeting> {
  const db = await getDb();
  const id = uid();
  await db.execute(
    `INSERT INTO meetings (id, student_id, data, ora, link, agenda, status) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [id, input.student_id, input.data, input.ora, input.link, input.agenda, input.status]
  );
  return { id, ...input };
}

export async function updateMeeting(id: string, patch: Partial<MeetingInput>): Promise<void> {
  const db = await getDb();
  const fields = Object.keys(patch);
  if (!fields.length) return;
  const set = fields.map((f, i) => `${f} = $${i + 2}`).join(", ");
  await db.execute(`UPDATE meetings SET ${set} WHERE id = $1`, [id, ...fields.map((f) => (patch as Record<string, unknown>)[f])]);
}

export async function deleteMeeting(id: string): Promise<void> {
  const db = await getDb();
  await db.execute("DELETE FROM meetings WHERE id = $1", [id]);
}

// ---------- Evaluations ----------

export async function listEvals(): Promise<Evaluation[]> {
  const db = await getDb();
  return db.select<Evaluation[]>("SELECT * FROM evals ORDER BY data DESC");
}

export type EvalInput = Omit<Evaluation, "id">;

export async function createEval(input: EvalInput): Promise<Evaluation> {
  const db = await getDb();
  const id = uid();
  await db.execute(
    `INSERT INTO evals (id, titlu, materie, data, ora, clasa, descriere) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [id, input.titlu, input.materie, input.data, input.ora, input.clasa, input.descriere]
  );
  return { id, ...input };
}

export async function updateEval(id: string, patch: Partial<EvalInput>): Promise<void> {
  const db = await getDb();
  const fields = Object.keys(patch);
  if (!fields.length) return;
  const set = fields.map((f, i) => `${f} = $${i + 2}`).join(", ");
  await db.execute(`UPDATE evals SET ${set} WHERE id = $1`, [id, ...fields.map((f) => (patch as Record<string, unknown>)[f])]);
}

export async function deleteEval(id: string): Promise<void> {
  const db = await getDb();
  await db.execute("DELETE FROM eval_students WHERE eval_id = $1", [id]);
  await db.execute("UPDATE grades SET eval_id = NULL WHERE eval_id = $1", [id]);
  await db.execute("DELETE FROM evals WHERE id = $1", [id]);
}

export async function listEvalStudents(evalId: string): Promise<EvalStudentRow[]> {
  const db = await getDb();
  return db.select<EvalStudentRow[]>(
    `SELECT es.eval_id, es.student_id, es.nota, s.nume, s.clasa
     FROM eval_students es JOIN students s ON s.id = es.student_id
     WHERE es.eval_id = $1 ORDER BY s.nume COLLATE NOCASE`,
    [evalId]
  );
}

/** Roster size + completed-grade count per evaluation — used by the
 *  evaluation list so it doesn't need an N+1 query per row. */
export async function listEvalRosterSummary(): Promise<{ eval_id: string; total: number; done: number }[]> {
  const db = await getDb();
  return db.select(
    `SELECT eval_id, COUNT(*) as total, SUM(CASE WHEN nota IS NOT NULL AND nota != '' THEN 1 ELSE 0 END) as done
     FROM eval_students GROUP BY eval_id`
  );
}

export async function addStudentToEval(evalId: string, studentId: string): Promise<void> {
  const db = await getDb();
  await db.execute(
    "INSERT OR IGNORE INTO eval_students (eval_id, student_id, nota) VALUES ($1, $2, NULL)",
    [evalId, studentId]
  );
}

export async function removeStudentFromEval(evalId: string, studentId: string): Promise<void> {
  const db = await getDb();
  await db.execute("DELETE FROM eval_students WHERE eval_id = $1 AND student_id = $2", [evalId, studentId]);
}

export async function setEvalGrade(evalId: string, studentId: string, nota: string): Promise<void> {
  const db = await getDb();
  await db.execute("UPDATE eval_students SET nota = $1 WHERE eval_id = $2 AND student_id = $3", [nota, evalId, studentId]);
}

/** Copies every completed nota from an evaluation's roster into that student's
 *  grades (replacing any grade previously published from this eval). */
export async function publishEval(evalId: string): Promise<number> {
  const db = await getDb();
  const ev = (await db.select<Evaluation[]>("SELECT * FROM evals WHERE id = $1", [evalId]))[0];
  if (!ev) return 0;
  const rows = await listEvalStudents(evalId);
  let n = 0;
  for (const row of rows) {
    if (row.nota === null || row.nota === "") continue;
    await db.execute("DELETE FROM grades WHERE eval_id = $1 AND student_id = $2", [evalId, row.student_id]);
    await db.execute(
      `INSERT INTO grades (id, student_id, materie, valoare, data, sursa, eval_id) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [uid(), row.student_id, ev.materie || ev.titlu, row.nota, ev.data, ev.titlu, evalId]
    );
    n++;
  }
  return n;
}
