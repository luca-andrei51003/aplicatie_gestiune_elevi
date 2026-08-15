/** Faint decorative floral wallpaper for the dark sidebar — purely
 *  ornamental, so it sits behind the nav content and never intercepts clicks. */
export default function SidebarFloral() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        opacity: 0.1,
        zIndex: 0,
      }}
    >
      <svg width="100%" height="100%">
        <defs>
          <pattern id="ge-sidebar-floral" width="150" height="170" patternUnits="userSpaceOnUse" patternTransform="rotate(6)">
            <g fill="none" stroke="#8fcdf2" strokeWidth="1.1">
              <g transform="translate(74,46)">
                <g transform="rotate(0)"><ellipse cx="0" cy="-11" rx="5" ry="9.5" /></g>
                <g transform="rotate(60)"><ellipse cx="0" cy="-11" rx="5" ry="9.5" /></g>
                <g transform="rotate(120)"><ellipse cx="0" cy="-11" rx="5" ry="9.5" /></g>
                <g transform="rotate(180)"><ellipse cx="0" cy="-11" rx="5" ry="9.5" /></g>
                <g transform="rotate(240)"><ellipse cx="0" cy="-11" rx="5" ry="9.5" /></g>
                <g transform="rotate(300)"><ellipse cx="0" cy="-11" rx="5" ry="9.5" /></g>
                <circle r="3" />
              </g>
              <path d="M74,58 C72,80 77,94 74,116" />
              <path d="M74,82 C63,78 56,84 54,93 C65,95 71,90 74,82 Z" />
              <path d="M74,98 C85,94 92,100 94,109 C83,111 77,106 74,98 Z" />

              <g transform="translate(16,132) scale(0.6)">
                <g transform="rotate(15)"><ellipse cx="0" cy="-11" rx="5" ry="9.5" /></g>
                <g transform="rotate(75)"><ellipse cx="0" cy="-11" rx="5" ry="9.5" /></g>
                <g transform="rotate(135)"><ellipse cx="0" cy="-11" rx="5" ry="9.5" /></g>
                <g transform="rotate(195)"><ellipse cx="0" cy="-11" rx="5" ry="9.5" /></g>
                <g transform="rotate(255)"><ellipse cx="0" cy="-11" rx="5" ry="9.5" /></g>
                <g transform="rotate(315)"><ellipse cx="0" cy="-11" rx="5" ry="9.5" /></g>
                <circle r="3" />
              </g>
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ge-sidebar-floral)" />
      </svg>
    </div>
  );
}
