export default function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div
      className="ge-in"
      style={{
        position: "fixed",
        bottom: 26,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#1e2b36",
        color: "#ffffff",
        padding: "12px 20px",
        borderRadius: 999,
        fontWeight: 600,
        boxShadow: "0 12px 30px rgba(30, 43, 54, 0.25)",
        zIndex: 60,
      }}
    >
      {message}
    </div>
  );
}
