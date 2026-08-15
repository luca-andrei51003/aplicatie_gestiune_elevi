import type { CSSProperties } from "react";

export const color = {
  bg: "#eef3f9",
  text: "#1e2b36",
  muted: "#6b8095",
  mutedLight: "#8b9eb0",
  border: "#dce6f0",
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

  // Dark sidebar palette — the app's "slice" of dark mode, kept isolated to
  // the nav rail so the content canvas stays on the validated light theme.
  sidebarBg: "#101c28",
  sidebarBgAlt: "#16242f",
  sidebarBorder: "rgba(255,255,255,0.07)",
  sidebarText: "#e8f0f7",
  sidebarTextMuted: "#7d93a7",
  sidebarActiveBg: "rgba(96,177,230,0.16)",
  sidebarActiveText: "#7ec4ee",
  sidebarHoverBg: "rgba(255,255,255,0.05)",
  sidebarDot: "#4a86ad",
};

export const card: CSSProperties = {
  background: "#ffffff",
  border: `1px solid ${color.border}`,
  borderRadius: 16,
  boxShadow: "0 1px 2px rgba(21,34,46,0.04), 0 12px 28px -18px rgba(21,34,46,0.22)",
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
  borderRadius: 10,
  padding: "10px 16px",
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: 14,
};

export const btnPrimary: CSSProperties = {
  ...btnBase,
  background: color.blue,
  color: "#fff",
  boxShadow: "0 1px 2px rgba(44,100,145,0.3), 0 8px 16px -8px rgba(44,100,145,0.55)",
};
export const btnPink: CSSProperties = {
  ...btnBase,
  background: color.pink,
  color: "#fff",
  boxShadow: "0 1px 2px rgba(168,81,120,0.3), 0 8px 16px -8px rgba(168,81,120,0.55)",
};
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
    boxShadow: "inset 0 0 0 1px rgba(15,23,31,0.06)",
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
  background: "rgba(14, 22, 30, 0.45)",
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
  boxShadow: "0 24px 60px rgba(14, 22, 30, 0.28)",
};
