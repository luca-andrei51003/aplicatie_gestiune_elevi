import type { View } from "../App";
import { color } from "../lib/ui";
import SidebarFloral from "./SidebarFloral";

interface NavDef {
  key: "elevi" | "parinti" | "evaluari";
  label: string;
  count: number;
}

export default function Sidebar({
  activeView,
  counts,
  onNavigate,
  nextMeetingLabel,
  nextMeetingWhen,
  onGoParinti,
}: {
  activeView: View;
  counts: { elevi: number; parinti: number; evaluari: number };
  onNavigate: (v: "elevi" | "parinti" | "evaluari") => void;
  nextMeetingLabel: string;
  nextMeetingWhen: string;
  onGoParinti: () => void;
}) {
  const navDef: NavDef[] = [
    { key: "elevi", label: "Elevi", count: counts.elevi },
    { key: "parinti", label: "Întâlniri părinți", count: counts.parinti },
    { key: "evaluari", label: "Evaluări", count: counts.evaluari },
  ];
  const active = activeView === "detaliu" ? "elevi" : activeView;

  return (
    <aside
      style={{
        width: 240,
        flex: "0 0 240px",
        background: `linear-gradient(180deg, ${color.sidebarBgAlt}, ${color.sidebarBg})`,
        borderRight: `1px solid ${color.sidebarBorder}`,
        padding: "22px 16px",
        position: "sticky",
        top: 0,
        height: "100vh",
        boxShadow: "4px 0 24px -12px rgba(6,12,18,0.5)",
        overflow: "hidden",
      }}
    >
      <SidebarFloral />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 26, height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "0 6px" }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 11,
            background: `linear-gradient(155deg, ${color.blueSoft}, ${color.blue})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Instrument Serif', serif",
            fontSize: 20,
            color: "#0d1c26",
            boxShadow: "0 4px 14px -4px rgba(52,113,158,0.65)",
          }}
        >
          e
        </div>
        <div>
          <div style={{ fontWeight: 700, letterSpacing: "-0.01em", color: color.sidebarText }}>Cabinet</div>
          <div style={{ fontSize: 11, color: color.sidebarTextMuted, letterSpacing: "0.02em" }}>gestionare elevi</div>
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {navDef.map((n) => {
          const isActive = active === n.key;
          return (
            <button
              key={n.key}
              onClick={() => onNavigate(n.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                textAlign: "left",
                border: 0,
                cursor: "pointer",
                padding: "10px 12px",
                borderRadius: 10,
                fontWeight: 600,
                background: isActive ? color.sidebarActiveBg : "transparent",
                boxShadow: isActive ? `inset 0 0 0 1px rgba(126,196,238,0.25)` : "none",
                color: isActive ? color.sidebarActiveText : color.sidebarText,
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = color.sidebarHoverBg; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: isActive ? color.sidebarActiveText : color.sidebarDot,
                }}
              />
              <span style={{ flex: 1 }}>{n.label}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: isActive ? color.sidebarActiveText : color.sidebarTextMuted }}>
                {n.count}
              </span>
            </button>
          );
        })}
      </nav>

      <div
        style={{
          marginTop: "auto",
          background: "rgba(194,102,140,0.12)",
          border: "1px solid rgba(194,102,140,0.3)",
          borderRadius: 14,
          padding: 14,
        }}
      >
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#e8a9c2", fontWeight: 700 }}>
          Următoarea întâlnire
        </div>
        <div style={{ marginTop: 8, fontWeight: 600, color: color.sidebarText }}>{nextMeetingLabel}</div>
        <div style={{ fontSize: 12, color: color.sidebarTextMuted, marginTop: 2 }}>{nextMeetingWhen}</div>
        <button
          onClick={onGoParinti}
          style={{
            marginTop: 12,
            width: "100%",
            border: "1px solid rgba(194,102,140,0.4)",
            background: "rgba(255,255,255,0.04)",
            color: "#f3c8da",
            borderRadius: 9,
            padding: 7,
            fontWeight: 600,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.09)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
        >
          Vezi calendarul
        </button>
      </div>
      </div>
    </aside>
  );
}
