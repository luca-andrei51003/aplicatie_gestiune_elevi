import { color } from "../lib/ui";

export default function DeleteButton({ onClick, title }: { onClick: () => void; title?: string }) {
  return (
    <button
      onClick={onClick}
      title={title ?? "Șterge"}
      style={{
        width: 26,
        height: 26,
        flex: "0 0 26px",
        borderRadius: 8,
        border: `1px solid ${color.dangerBorder}`,
        background: color.dangerTint,
        color: color.danger,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: 16,
        lineHeight: 1,
        fontWeight: 700,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = color.danger;
        e.currentTarget.style.color = "#fff";
        e.currentTarget.style.borderColor = color.danger;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = color.dangerTint;
        e.currentTarget.style.color = color.danger;
        e.currentTarget.style.borderColor = color.dangerBorder;
      }}
    >
      ×
    </button>
  );
}
