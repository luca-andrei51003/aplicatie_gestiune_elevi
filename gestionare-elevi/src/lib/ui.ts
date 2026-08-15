import type { CSSProperties } from "react";

export const color = {
  bg: "#f3f7fb",
  text: "#1e2b36",
  muted: "#6b8095",
  mutedLight: "#8b9eb0",
  border: "#e4edf5",
  borderLight: "#eef4f9",
  inputBorder: "#dfe9f2",
  blue: "#34719e",
  blueDark: "#2c6491",
  blueSoft: "#bcd8ee",
  blueTint: "#e8f2f9",
  blueTint2: "#f4f9fd",
  pink: "#c2668c",
  pinkDark: "#a85178",
  pinkSoft: "#f2c6d8",
  pinkTint: "#fdf1f5",
  pinkTint2: "#fbe6ee",
  danger: "#b06070",
  dangerBorder: "#f0dade",
  dangerTint: "#fdf4f5",
};

export const card: CSSProperties = {
  background: "#ffffff",
  border: `1px solid ${color.border}`,
  borderRadius: 14,
};

export const input: CSSProperties = {
  border: `1px solid ${color.inputBorder}`,
  borderRadius: 9,
  padding: "9px 11px",
  color: color.text,
  fontFamily: "inherit",
  fontSize: 14,
  width: "100%",
  boxSizing: "border-box",
  background: "#ffffff",
};

export const label: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 5,
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: color.mutedLight,
};

export const btnBase: CSSProperties = {
  border: 0,
  borderRadius: 9,
  padding: "10px 16px",
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: 14,
};

export const btnPrimary: CSSProperties = { ...btnBase, background: color.blue, color: "#fff" };
export const btnPink: CSSProperties = { ...btnBase, background: color.pink, color: "#fff" };
export const btnGhost: CSSProperties = {
  ...btnBase,
  background: "#ffffff",
  border: `1px solid ${color.inputBorder}`,
  color: color.text,
};
export const btnPinkGhost: CSSProperties = {
  ...btnBase,
  background: color.pinkTint,
  border: `1px solid ${color.pinkSoft}`,
  color: color.pinkDark,
};
export const btnDanger: CSSProperties = {
  ...btnBase,
  background: "#ffffff",
  border: `1px solid ${color.dangerBorder}`,
  color: color.danger,
};

export function badge(bg: string, fg: string): CSSProperties {
  return {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    fontWeight: 700,
    fontSize: 12,
    background: bg,
    color: fg,
  };
}

export const sectionLabel: CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  color: color.mutedLight,
};

export const modalBackdrop: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(30, 43, 54, 0.34)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
  zIndex: 40,
};

export const modalCard: CSSProperties = {
  background: "#ffffff",
  borderRadius: 18,
  width: 520,
  maxWidth: "100%",
  padding: "26px 28px",
  boxShadow: "0 24px 60px rgba(30, 43, 54, 0.2)",
};
