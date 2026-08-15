CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  nume TEXT NOT NULL,
  clasa TEXT NOT NULL DEFAULT '',
  varsta TEXT NOT NULL DEFAULT '',
  parinte TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  telefon TEXT NOT NULL DEFAULT '',
  notite TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  data TEXT NOT NULL,
  durata INTEGER NOT NULL DEFAULT 45,
  tip TEXT NOT NULL DEFAULT 'Individuală',
  observatii TEXT NOT NULL DEFAULT '',
  html TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_sessions_student ON sessions(student_id);

CREATE TABLE IF NOT EXISTS evals (
  id TEXT PRIMARY KEY,
  titlu TEXT NOT NULL DEFAULT '',
  materie TEXT NOT NULL DEFAULT '',
  data TEXT NOT NULL,
  ora TEXT NOT NULL DEFAULT '',
  clasa TEXT NOT NULL DEFAULT '',
  descriere TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS grades (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  materie TEXT NOT NULL DEFAULT '',
  valoare TEXT NOT NULL DEFAULT '',
  data TEXT NOT NULL,
  sursa TEXT NOT NULL DEFAULT '',
  eval_id TEXT REFERENCES evals(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_grades_student ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_eval ON grades(eval_id);

CREATE TABLE IF NOT EXISTS meetings (
  id TEXT PRIMARY KEY,
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  data TEXT NOT NULL,
  ora TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL DEFAULT '',
  agenda TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Programată'
);
CREATE INDEX IF NOT EXISTS idx_meetings_student ON meetings(student_id);

CREATE TABLE IF NOT EXISTS eval_students (
  eval_id TEXT NOT NULL REFERENCES evals(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  nota TEXT,
  PRIMARY KEY (eval_id, student_id)
);
CREATE INDEX IF NOT EXISTS idx_eval_students_student ON eval_students(student_id);
