import { btnDanger, btnGhost, color, modalCard } from "../lib/ui";

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Șterge",
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        zIndex: 40,
      }}
      onClick={onCancel}
    >
      <div
        className="ge-in"
        style={{
          ...modalCard,
          width: 400,
          boxShadow: "0 40px 90px -12px rgba(20,30,40,0.45), 0 12px 32px -8px rgba(20,30,40,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: "0 0 10px", fontFamily: "'Instrument Serif', serif", fontSize: 24, fontWeight: 400 }}>
          {title}
        </h2>
        <p style={{ margin: 0, color: color.muted, lineHeight: 1.5 }}>{message}</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
          <button style={btnGhost} onClick={onCancel}>
            Renunță
          </button>
          <button style={{ ...btnDanger, background: color.danger, color: "#fff", border: 0 }} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
