import type { View } from "../App";
import { color } from "../lib/ui";

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
        width: 236,
        flex: "0 0 236px",
        background: "#ffffff",
        borderRight: `1px solid ${color.border}`,
        padding: "22px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 26,
        position: "sticky",
        top: 0,
        height: "100vh",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "0 6px" }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 11,
            background: color.blueSoft,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Instrument Serif', serif",
            fontSize: 20,
            color: color.blueDark,
          }}
        >
          e
        </div>
        <div>
          <div style={{ fontWeight: 700, letterSpacing: "-0.01em" }}>Cabinet</div>
          <div style={{ fontSize: 11, color: "#7f93a6", letterSpacing: "0.02em" }}>gestionare elevi</div>
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
                background: isActive ? color.blueTint : "transparent",
                color: isActive ? color.blueDark : "#4a6379",
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#eef5fb"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: isActive ? color.blue : "#d3e0ea",
                }}
              />
              <span style={{ flex: 1 }}>{n.label}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#93a6b8" }}>{n.count}</span>
            </button>
          );
        })}
      </nav>

      <div
        style={{
          marginTop: "auto",
          background: color.pinkTint,
          border: `1px solid ${color.pinkSoft}`,
          borderRadius: 12,
          padding: 14,
        }}
      >
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: color.pink, fontWeight: 700 }}>
          Următoarea întâlnire
        </div>
        <div style={{ marginTop: 8, fontWeight: 600 }}>{nextMeetingLabel}</div>
        <div style={{ fontSize: 12, color: color.muted, marginTop: 2 }}>{nextMeetingWhen}</div>
        <button
          onClick={onGoParinti}
          style={{
            marginTop: 12,
            width: "100%",
            border: `1px solid ${color.pinkSoft}`,
            background: "#ffffff",
            color: color.pinkDark,
            borderRadius: 8,
            padding: 7,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Vezi calendarul
        </button>
      </div>
    </aside>
  );
}
