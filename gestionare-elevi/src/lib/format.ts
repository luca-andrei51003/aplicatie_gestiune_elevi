const MONTHS = ["ian", "feb", "mar", "apr", "mai", "iun", "iul", "aug", "sep", "oct", "nov", "dec"];
export const MONTHS_LONG = [
  "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
  "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie",
];

export const iso = (d: Date) => d.toISOString().slice(0, 10);
export const todayIso = () => iso(new Date());
export const shiftDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return iso(d);
};

export function fmtDate(d: string | null | undefined): string {
  if (!d) return "—";
  const dt = new Date(d + "T00:00:00");
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.getDate() + " " + MONTHS[dt.getMonth()] + " " + dt.getFullYear();
}

export function initials(nume: string): string {
  return (nume || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function fmtGrade(v: string | number | null | undefined, scale: "1-10" | "procente" = "1-10"): string {
  if (v === null || v === undefined || v === "") return "—";
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  if (scale === "procente") return Math.round(n * 10) + "%";
  return (Math.round(n * 100) / 100).toFixed(n % 1 === 0 ? 0 : 2);
}

export function gradeColors(v: string | number | null | undefined): { bg: string; fg: string } {
  const n = Number(v);
  if (Number.isNaN(n)) return { bg: "#f1f6fa", fg: "#5b7186" };
  if (n >= 9) return { bg: "#e4f0f8", fg: "#2c6491" };
  if (n >= 7) return { bg: "#fdf1f5", fg: "#a85178" };
  return { bg: "#fbeef0", fg: "#a95a68" };
}

export function average(values: Array<string | number>): number | null {
  if (!values.length) return null;
  const nums = values.map((v) => Number(v) || 0);
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function countWords(text: string): number {
  const m = text.trim().match(/[^\s]+/g);
  return m ? m.length : 0;
}
