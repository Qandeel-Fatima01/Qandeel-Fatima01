// Shared palette and SVG scaffolding for build.mjs and telemetry.mjs.
// Every SVG paints its own background: GitHub picks the light/dark file from the OS
// color scheme, not the GitHub theme, so a mismatch must still stay readable.
export const THEMES = {
  light: { bg: "#FFFFFF", bone: "#1F1F1F", muted: "#4D4D4D", dim: "#707070", rule: "#C8C8C8", accent: "#3A3A3A", ghost: "#E2E2E2" },
  dark:  { bg: "#0D1117", bone: "#E0E0E0", muted: "#A6A6A6", dim: "#858585", rule: "#333333", accent: "#AAAAAA", ghost: "#2A2A2A" },
};

export const MONO = `ui-monospace, "SFMono-Regular", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`;
export const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const base = (t) => `
    :root { --bone:${t.bone}; --muted:${t.muted}; --dim:${t.dim}; --rule:${t.rule}; --accent:${t.accent}; --ghost:${t.ghost}; }
    .mono { font-family: ${MONO}; }
    .draw { stroke-dasharray: 1200; stroke-dashoffset: 1200; animation: draw 1.4s cubic-bezier(.6,0,.2,1) forwards; }
    @keyframes draw { to { stroke-dashoffset: 0; } }
    .rise { opacity: 0; animation: rise .7s cubic-bezier(.2,.7,.2,1) forwards; }
    @keyframes rise { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
    .fade { opacity: 0; animation: fade .7s ease forwards; }
    @keyframes fade { to { opacity: 1; } }
    .pulse { animation: pulse 2.4s ease-in-out infinite; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
    .a1{animation-delay:.1s} .a2{animation-delay:.25s} .a3{animation-delay:.4s} .a4{animation-delay:.55s} .a5{animation-delay:.7s} .a6{animation-delay:.85s} .a7{animation-delay:1s}
    @media (prefers-reduced-motion: reduce) {
      .draw,.rise,.fade,.pulse,.ring { animation: none; } .draw{stroke-dashoffset:0} .rise,.fade{opacity:1} .ring{opacity:0}
    }`;

export const svg = (w, h, label, t, body, extraCss = "") =>
  `<svg viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(label)}">
  <style>${base(t)}${extraCss}
  </style>
  <rect width="${w}" height="${h}" fill="${t.bg}"/>
${body}
</svg>
`;
