// Generates assets/*.svg (light) and assets/dark/*.svg (dark). Run: node build.mjs
import { mkdirSync, writeFileSync } from "node:fs";

const THEMES = {
  light: { bone: "#1F1F1F", muted: "#6B6B6B", dim: "#999999", rule: "#C8C8C8", accent: "#3A3A3A", ghost: "#E2E2E2" },
  dark:  { bone: "#E0E0E0", muted: "#888888", dim: "#666666", rule: "#333333", accent: "#AAAAAA", ghost: "#2A2A2A" },
};

const MONO = `ui-monospace, "SFMono-Regular", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const base = (t) => `
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

const svg = (w, h, label, t, body, extraCss = "") =>
  `<svg viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(label)}">
  <style>${base(t)}${extraCss}
  </style>
${body}
</svg>
`;

// ---------- header ----------
const header = (t) => {
  // graticule motif: Islamabad pin on a faint lat/long grid
  const xs = [760, 808, 856, 904, 952], ys = [96, 144, 192, 240, 288];
  const grid = [
    ...xs.map((x) => `<line x1="${x}" y1="84" x2="${x}" y2="300" stroke="var(--rule)" stroke-dasharray="2 4"/>`),
    ...ys.map((y) => `<line x1="748" y1="${y}" x2="952" y2="${y}" stroke="var(--rule)" stroke-dasharray="2 4"/>`),
  ].join("\n    ");
  return svg(1000, 400, "Qandeel Fatima — Web GIS Developer at Metavystic, Islamabad", t, `
  <line class="draw a1" x1="48" y1="58" x2="952" y2="58" stroke="var(--rule)"/>
  <g class="fade a1">
    <text class="mono" fill="var(--muted)" x="48" y="44" font-size="11" letter-spacing="3.5">WORK PROFILE — INDEX Nº 002</text>
    <text class="mono" fill="var(--muted)" x="952" y="44" font-size="11" letter-spacing="3.5" text-anchor="end">ISLAMABAD — 33.68° N</text>
  </g>

  <g class="fade a3">
    ${grid}
    <path d="M748 250 C790 230 812 262 850 238 S910 200 952 214" stroke="var(--rule)"/>
    <path d="M748 170 C786 150 820 182 858 160 S918 128 952 140" stroke="var(--rule)"/>
    <circle class="ring" cx="856" cy="192" r="6" stroke="var(--accent)"/>
    <circle class="pulse" cx="856" cy="192" r="4" fill="var(--accent)"/>
    <text class="mono" fill="var(--dim)" x="868" y="186" font-size="10" letter-spacing="1.5">ISB</text>
    <text class="mono" fill="var(--dim)" x="952" y="318" font-size="10" letter-spacing="1.5" text-anchor="end">33.68° N · 73.04° E</text>
  </g>

  <g class="rise a2"><text class="mono" fill="var(--bone)" x="46" y="176" font-size="64" letter-spacing="-2">Qandeel Fatima</text></g>
  <g class="fade a3"><text class="mono" fill="var(--muted)" x="48" y="214" font-size="19">Web GIS Developer @ Metavystic — Islamabad.</text></g>

  <g class="fade a4">
    <text class="mono" fill="var(--dim)" x="48" y="274" font-size="12.5" letter-spacing="1">focus  ▸</text>
    <text class="mono" fill="var(--accent)" x="128" y="274" font-size="12.5" letter-spacing="1">location intelligence · interactive maps · data dashboards</text>
  </g>
  <g class="fade a5"><text class="mono" fill="var(--dim)" x="48" y="300" font-size="12.5" letter-spacing="1">personal &amp; open-source work → github.com/Qandeel-01</text></g>

  <line class="draw a5" x1="48" y1="342" x2="952" y2="342" stroke="var(--rule)"/>
  <g class="fade a6">
    <text class="mono" fill="var(--muted)" x="48" y="374" font-size="11.5" letter-spacing="3">WEB GIS</text>
    <text class="mono" fill="var(--accent)" x="146" y="374" font-size="11.5">·</text>
    <text class="mono" fill="var(--muted)" x="172" y="374" font-size="11.5" letter-spacing="3">LOCATION INTELLIGENCE</text>
    <text class="mono" fill="var(--accent)" x="402" y="374" font-size="11.5">·</text>
    <text class="mono" fill="var(--muted)" x="428" y="374" font-size="11.5" letter-spacing="3">FULL-STACK</text>
    <text class="mono" fill="var(--muted)" x="952" y="374" font-size="11.5" letter-spacing="3" text-anchor="end">METAVYSTIC — 2026 / PRESENT</text>
  </g>`,
    `
    .ring { transform-origin: 856px 192px; animation: ring 2.4s ease-out infinite; }
    @keyframes ring { 0%{transform:scale(.4);opacity:.8} 80%,100%{transform:scale(2.8);opacity:0} }`);
};

// ---------- section dividers ----------
const section = (n, label, path) => (t) => {
  const labelEnd = 128 + label.length * (14 * 0.6 + 6);
  const pathStart = 952 - path.length * (11 * 0.6 + 2);
  return svg(1000, 92, `Section ${n} — ${label}`, t, `
  <g class="fade a1">
    <text class="mono" x="48" y="68" font-size="52" fill="var(--ghost)">${n}</text>
    <text class="mono" x="128" y="58" font-size="14" fill="var(--accent)" letter-spacing="6">${esc(label)}</text>
    <text class="mono" x="952" y="58" font-size="11" fill="var(--muted)" letter-spacing="2" text-anchor="end">${esc(path)}</text>
  </g>
  <line class="draw a2" x1="${Math.round(labelEnd + 14)}" y1="53" x2="${Math.round(pathStart - 20)}" y2="53" stroke="var(--rule)"/>`);
};

// ---------- whoami ----------
const whoami = (t) => svg(1000, 236, "whoami — bio, focus, status, reach", t, `
  <text class="mono rise a1" x="48" y="32" font-size="16" fill="var(--bone)">building location-intelligence tooling for a retail analytics platform at Metavystic.</text>
  <text class="mono rise a2" x="48" y="60" font-size="16" fill="var(--bone)">map layers, outlet performance, customer catchments — from stored procedure to pixel.</text>
  <text class="mono rise a3" x="48" y="88" font-size="15" fill="var(--muted)">client repos are private, so most commits stay off this graph — the work shows in the product.</text>

  <line class="rise a4" x1="48" y1="116" x2="952" y2="116" stroke="var(--rule)"/>

  <text class="mono rise a4" x="48" y="148" font-size="11" fill="var(--muted)" letter-spacing="2.5">FOCUS</text>
  <text class="mono rise a4" x="154" y="148" font-size="15" fill="var(--bone)">Web GIS · Mapbox · Next.js · TypeScript APIs · Python services · SQL</text>
  <text class="mono rise a5" x="48" y="182" font-size="11" fill="var(--muted)" letter-spacing="2.5">STATUS</text>
  <text class="mono rise a5" x="154" y="182" font-size="15" fill="var(--accent)">shipping client work · happy to talk maps, GIS and data</text>
  <text class="mono rise a6" x="48" y="216" font-size="11" fill="var(--muted)" letter-spacing="2.5">REACH</text>
  <text class="mono rise a6" x="154" y="216" font-size="15" fill="var(--bone)">qandeelfatima@metavystic.com · qandeel-fatima.vercel.app</text>`);

// ---------- on the desk (workstreams) ----------
const DESK = [
  ["LOCATION INTELLIGENCE MAPS",
    ["Interactive map layers for outlets, customer catchments and candidate expansion sites.",
     "Country-aware views and tightly scoped data, so each business sees exactly its own geography."],
    "MAPBOX · GEOJSON · NEXT.JS · SPATIAL QUERIES"],
  ["KPI & PERFORMANCE DASHBOARDS",
    ["KPI cards and outlet-performance charts built on honest baselines — averages, not flattering spikes.",
     "Every number is traced back to its stored procedure before it reaches a chart."],
    "REACT · TYPESCRIPT · DATA VISUALIZATION · SQL STORED PROCEDURES"],
  ["DATA PIPELINES & UPLOADS",
    ["Versioned customer-data uploads, sync jobs and relationship fixes across services.",
     "UTC-first date handling end to end, so a sale never lands on the wrong day."],
    "NODE.JS · TYPESCRIPT · DATA VERSIONING · ETL"],
  ["MODEL SERVICES",
    ["Python services for KNN model training and location scoring behind the dashboards.",
     "Kept small, testable and boring — the interesting part is the data going in."],
    "PYTHON · KNN · ML SERVICES · REST APIS"],
  ["DATA QUALITY AUDITS",
    ["Tracing anomalies down to the row — stray test data, scoping bugs, inflated counts.",
     "Each fix ships with a written report, a repro and a test matrix."],
    "SQL · AUDITING · QA · TECHNICAL WRITING"],
];
const desk = (t) => svg(1000, 40 + DESK.length * 110, "Current workstreams", t, `
  <g class="mono">
${DESK.map(([title, copy, meta], i) => `    <g transform="translate(0 ${20 + i * 110})"><g class="rise a${i + 1}">
      <text x="48" y="24" font-size="17" font-weight="700" letter-spacing=".8" fill="var(--bone)">${String(i + 1).padStart(2, "0")} / ${esc(title)}</text>
      <text x="48" y="49" font-size="12" fill="var(--bone)">${esc(copy[0])}</text>
      <text x="48" y="68" font-size="12" fill="var(--bone)">${esc(copy[1])}</text>
      <text x="48" y="87" font-size="11" letter-spacing=".4" fill="var(--muted)">${esc(meta)}</text>
      <line x1="48" y1="104" x2="952" y2="104" stroke="var(--rule)"/>
    </g></g>`).join("\n")}
  </g>`);

// ---------- stack ----------
const STACK = [
  ["LANGUAGES", "TypeScript · JavaScript · Python · SQL"],
  ["FRONT END", "Next.js · React · data visualization · responsive UI"],
  ["MAPS / GIS", "Mapbox GL · GeoJSON · QGIS · spatial SQL"],
  ["BACK END", "Node.js · REST APIs · stored procedures · microservices"],
  ["ML / DATA", "Python services · KNN models · data auditing"],
  ["TOOLING", "Git · GitHub · VS Code · Jupyter"],
];
const stack = (t) => svg(1000, 32 * STACK.length + 14, "Stack — languages, front end, GIS, back end, data, tooling", t, `
  <line x1="138" y1="8" x2="138" y2="${32 * STACK.length + 6}" stroke="var(--rule)"/>
${STACK.map(([k, v], i) => `  <text class="mono rise a${i + 1}" x="48" y="${32 + i * 32}" font-size="12" fill="var(--muted)" letter-spacing="2">${esc(k)}</text>
  <text class="mono rise a${i + 1}" x="154" y="${32 + i * 32}" font-size="15" fill="var(--bone)">${esc(v)}</text>`).join("\n")}`);

// ---------- footer ----------
const footer = (t) => svg(1000, 110, "Status: shipping. Islamabad. qandeelfatima@metavystic.com", t, `
  <line class="draw" x1="48" y1="24" x2="952" y2="24" stroke="var(--rule)"/>
  <circle class="ring" cx="60" cy="64" r="5" stroke="var(--accent)"/>
  <circle class="pulse" cx="60" cy="64" r="4" fill="var(--accent)"/>
  <text class="mono" x="82" y="62" font-size="12" letter-spacing="3" fill="var(--bone)">STATUS — SHIPPING</text>
  <text class="mono" x="82" y="82" font-size="11" letter-spacing="2" fill="var(--muted)">probably tracing a number back to its query</text>
  <text class="mono" x="952" y="66" font-size="15" text-anchor="end" fill="var(--muted)">qandeelfatima@metavystic.com  ·  Islamabad  ·  © 2026</text>`,
  `
    .ring { transform-origin: 60px 64px; animation: ring 2.4s ease-out infinite; }
    @keyframes ring { 0%{transform:scale(.4);opacity:.8} 80%,100%{transform:scale(2.6);opacity:0} }`);

const ASSETS = {
  header, whoami, desk, stack, footer,
  s01: section("01", "WHOAMI", "~/01-whoami"),
  s02: section("02", "ON THE DESK", "~/02-desk"),
  s03: section("03", "STACK", "~/03-stack"),
  s04: section("04", "TELEMETRY", "~/04-telemetry"),
};

for (const [theme, dir] of [["light", "assets"], ["dark", "assets/dark"]]) {
  mkdirSync(new URL(dir, import.meta.url), { recursive: true });
  for (const [name, fn] of Object.entries(ASSETS)) {
    writeFileSync(new URL(`${dir}/${name}.svg`, import.meta.url), fn(THEMES[theme]));
  }
}
console.log(`wrote ${Object.keys(ASSETS).length * 2} svgs`);
