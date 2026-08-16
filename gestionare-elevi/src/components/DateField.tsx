import { useEffect, useRef, useState, type CSSProperties } from "react";
import { input as inputStyle, color } from "../lib/ui";

function isoToDisplay(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  return m ? `${m[3]}/${m[2]}/${m[1]}` : "";
}

function maskedToIso(masked: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(masked);
  if (!m) return null;
  const [, d, mo, y] = m;
  const day = Number(d);
  const month = Number(mo);
  if (day < 1 || day > 31 || month < 1 || month > 12) return null;
  return `${y}-${mo}-${d}`;
}

function formatTyping(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits.slice(0, 2) + "/" + digits.slice(2, 4) + "/" + digits.slice(4);
}

/** Date input that always displays/types as dd/mm/yyyy, regardless of the
 *  Windows region setting a bare `<input type="date">` would otherwise
 *  follow. A visually hidden native date input still backs the calendar
 *  icon, so `showPicker()` gives a real picker without exposing its own
 *  (possibly mm/dd/yyyy) text field. */
export default function DateField({
  value,
  onChange,
  disabled,
  style,
}: {
  value: string;
  onChange: (iso: string) => void;
  disabled?: boolean;
  style?: CSSProperties;
}) {
  const [text, setText] = useState(isoToDisplay(value));
  const pickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setText(isoToDisplay(value));
  }, [value]);

  return (
    <div style={{ position: "relative", width: style?.width ?? "100%" }}>
      <input
        value={text}
        disabled={disabled}
        onChange={(e) => {
          const formatted = formatTyping(e.target.value);
          setText(formatted);
          const iso = maskedToIso(formatted);
          if (iso) onChange(iso);
        }}
        placeholder="zz/ll/aaaa"
        inputMode="numeric"
        style={{ ...inputStyle, paddingRight: 32, ...style, width: "100%" }}
      />
      <button
        type="button"
        disabled={disabled}
        tabIndex={-1}
        onClick={() => pickerRef.current?.showPicker?.()}
        style={{
          position: "absolute",
          right: 6,
          top: "50%",
          transform: "translateY(-50%)",
          border: 0,
          background: "transparent",
          cursor: disabled ? "default" : "pointer",
          color: color.mutedLight,
          padding: 4,
          lineHeight: 0,
          fontSize: 13,
        }}
      >
        📅
      </button>
      <input
        ref={pickerRef}
        type="date"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        tabIndex={-1}
        style={{ position: "absolute", inset: 0, width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
      />
    </div>
  );
}
