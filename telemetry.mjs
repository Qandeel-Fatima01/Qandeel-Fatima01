// Fetches recent contributions and writes assets/telemetry.svg (30-day line chart).
// Run: GITHUB_TOKEN=... node telemetry.mjs   (the daily workflow does this)
import { mkdirSync, writeFileSync } from "node:fs";
import { THEMES, svg } from "./theme.mjs";

const LOGIN = process.env.PROFILE_LOGIN || "Qandeel-Fatima01";
const token = process.env.GITHUB_TOKEN;
if (!token) throw new Error("GITHUB_TOKEN is required");

const res = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json", "User-Agent": "profile-telemetry" },
  body: JSON.stringify({
    query: `query($login: String!) { user(login: $login) { contributionsCollection { contributionCalendar {
      totalContributions weeks { contributionDays { date contributionCount } } } } } }`,
    variables: { login: LOGIN },
  }),
});
const json = await res.json();
if (!res.ok || json.errors) throw new Error(JSON.stringify(json.errors ?? json));
const { totalContributions, weeks } = json.data.user.contributionsCollection.contributionCalendar;

// Daily line chart of the last 30 days; the year total stays in the header.
const DAYS = 30;
const days = weeks.flatMap((w) => w.contributionDays).slice(-DAYS);
const recent = days.reduce((s, d) => s + d.contributionCount, 0);
const max = Math.max(...days.map((d) => d.contributionCount));

const niceStep = (m) => { const raw = Math.max(1, m) / 3, p = 10 ** Math.floor(Math.log10(raw)); return [1, 2, 5, 10].map((k) => k * p).find((s) => s >= raw); };
const STEP = niceStep(max), TOP = STEP * Math.max(1, Math.ceil(max / STEP));
const X0 = 88, X1 = 940, Y0 = 70, Y1 = 230, H = 300;
const MON = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const fmt = (iso) => { const d = new Date(iso + "T00:00:00Z"); return `${MON[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, "0")}`; };
const px = (i) => X0 + (i * (X1 - X0)) / (days.length - 1);
const py = (c) => Y1 - (c / TOP) * (Y1 - Y0);
const pts = days.map((d, i) => [px(i), py(d.contributionCount)]);
const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
const area = `${line} L${X1} ${Y1} L${X0} ${Y1} Z`;
const peak = days.reduce((b, d, i) => (d.contributionCount > days[b].contributionCount ? i : b), 0);

const telemetry = (t) => {
  const grid = [];
  for (let v = 0; v <= TOP; v += STEP) {
    grid.push(`<line x1="${X0}" y1="${py(v)}" x2="${X1}" y2="${py(v)}" stroke="var(--rule)"${v ? ' stroke-dasharray="2 4"' : ""}/>`);
    grid.push(`<text class="mono" x="${X0 - 14}" y="${py(v) + 4}" font-size="10" fill="var(--muted)" text-anchor="end">${v}</text>`);
  }
  const ticks = days.map((d, i) => (i % 5 === 0 || i === days.length - 1)
    ? `<text class="mono" x="${px(i)}" y="${Y1 + 22}" font-size="10" letter-spacing="1" fill="var(--muted)" text-anchor="middle">${fmt(d.date)}</text>` : "").filter(Boolean);
  const [pkx, pky] = pts[peak];
  const anchor = pkx > X1 - 120 ? "end" : pkx < X0 + 120 ? "start" : "middle";
  return svg(1000, H, `${recent} contributions in the last ${DAYS} days, ${totalContributions} in the last year`, t, `
  <g class="fade a1">
    <text class="mono" x="48" y="28" font-size="11" letter-spacing="3.5" fill="var(--muted)">CONTRIBUTION TELEMETRY</text>
    <text class="mono" x="952" y="28" font-size="11" letter-spacing="2" fill="var(--muted)" text-anchor="end">${recent} IN ${DAYS} DAYS · ${totalContributions} IN 12 MONTHS</text>
  </g>
  <line class="draw a1" x1="48" y1="40" x2="952" y2="40" stroke="var(--rule)"/>
  <g class="fade a2">
    ${grid.join("\n    ")}
    ${ticks.join("\n    ")}
  </g>
  <path class="fade a3" d="${area}" fill="var(--bone)" fill-opacity=".08"/>
  <path class="draw a3" d="${line}" stroke="var(--bone)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
  <g class="fade a5">
    <circle cx="${pkx}" cy="${pky}" r="4.5" fill="var(--bone)" stroke="#FFFFFF" stroke-width="2"/>
    <text class="mono" x="${pkx}" y="${pky - 14}" font-size="11" letter-spacing="1" fill="var(--bone)" text-anchor="${anchor}">peak ${days[peak].contributionCount} · ${fmt(days[peak].date)}</text>
  </g>
  <text class="mono fade a6" x="48" y="${H - 12}" font-size="10" letter-spacing="1.5" fill="var(--dim)">daily contributions · refreshed every night · private client work counts when enabled in profile settings</text>`,
    `
    .draw { stroke-dasharray: 3000; stroke-dashoffset: 3000; }`);
};

for (const [theme, dir] of [["light", "assets"]]) {
  mkdirSync(new URL(dir, import.meta.url), { recursive: true });
  writeFileSync(new URL(`${dir}/telemetry.svg`, import.meta.url), telemetry(THEMES[theme]));
}
console.log(`telemetry: ${recent} in ${DAYS} days, ${totalContributions} in 12 months, peak ${max}`);
