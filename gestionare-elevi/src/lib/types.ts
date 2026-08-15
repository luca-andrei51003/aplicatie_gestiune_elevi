export interface Student {
  id: string;
  nume: string;
  clasa: string;
  varsta: string;
  parinte: string;
  email: string;
  telefon: string;
  telefon_elev: string;
  notite: string;
}

export interface Session {
  id: string;
  student_id: string;
  data: string;
  durata: number;
  tip: string;
  observatii: string;
  html: string;
}

export interface Grade {
  id: string;
  student_id: string;
  materie: string;
  valoare: string;
  data: string;
  sursa: string;
  eval_id: string | null;
}

export interface Meeting {
  id: string;
  student_id: string | null;
  data: string;
  ora: string;
  link: string;
  agenda: string;
  status: string;
}

export interface Evaluation {
  id: string;
  titlu: string;
  materie: string;
  data: string;
  ora: string;
  clasa: string;
  descriere: string;
}

export interface EvalStudentRow {
  eval_id: string;
  student_id: string;
  nota: string | null;
  nume: string;
  clasa: string;
}
