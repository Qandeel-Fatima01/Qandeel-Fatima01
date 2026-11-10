// Fetches the last year of contributions and writes assets/telemetry.svg (+ dark).
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

// Intensity levels from quartiles of non-zero days, so a quiet year still shows shape.
const counts = weeks.flatMap((w) => w.contributionDays.map((d) => d.contributionCount)).filter((c) => c > 0).sort((a, b) => a - b);
const q = (p) => counts[Math.min(counts.length - 1, Math.floor(p * counts.length))] ?? 1;
const cuts = [q(0.25), q(0.5), q(0.75)];
const level = (c) => (c === 0 ? 0 : 1 + cuts.filter((x) => c > x).length);
const OPACITY = [0, 0.3, 0.5, 0.75, 1];

const CELL = 13, GAP = 4, X0 = 48, Y0 = 56, STEP = CELL + GAP;
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const telemetry = (t) => {
  const cells = [], labels = [];
  let lastMonth = -1;
  weeks.forEach((w, wi) => {
    const x = X0 + wi * STEP;
    const m = new Date(w.contributionDays[0].date + "T00:00:00Z").getUTCMonth();
    if (m !== lastMonth && wi < weeks.length - 2) {
      labels.push(`<text class="mono" x="${x}" y="${Y0 + 7 * STEP + 16}" font-size="10" letter-spacing="1.5" fill="var(--muted)">${MONTHS[m]}</text>`);
      lastMonth = m;
    }
    w.contributionDays.forEach((d) => {
      const y = Y0 + new Date(d.date + "T00:00:00Z").getUTCDay() * STEP;
      const lv = level(d.contributionCount);
      cells.push(lv === 0
        ? `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" stroke="var(--rule)"/>`
        : `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" fill="var(--bone)" fill-opacity="${OPACITY[lv]}"><title>${d.date}: ${d.contributionCount}</title></rect>`);
    });
  });
  const h = Y0 + 7 * STEP + 52;
  return svg(1000, h, `${totalContributions} contributions in the last year`, t, `
  <g class="fade a1">
    <text class="mono" x="48" y="28" font-size="11" letter-spacing="3.5" fill="var(--muted)">CONTRIBUTION TELEMETRY</text>
    <text class="mono" x="952" y="28" font-size="11" letter-spacing="2" fill="var(--muted)" text-anchor="end">${totalContributions} CONTRIBUTIONS · LAST 12 MONTHS</text>
  </g>
  <line class="draw a1" x1="48" y1="40" x2="952" y2="40" stroke="var(--rule)"/>
  <g class="fade a2">
    ${cells.join("\n    ")}
    ${labels.join("\n    ")}
  </g>
  <g class="fade a3">
    <text class="mono" x="48" y="${h - 8}" font-size="10" letter-spacing="1.5" fill="var(--dim)">refreshed daily · private client work counts when enabled in profile settings</text>
    <text class="mono" x="830" y="${h - 8}" font-size="10" letter-spacing="1.5" fill="var(--dim)" text-anchor="end">less</text>
    ${[0, 1, 2, 3, 4].map((lv, i) => {
      const x = 837 + i * 15;
      return lv === 0
        ? `<rect x="${x}" y="${h - 18}" width="11" height="11" stroke="var(--rule)"/>`
        : `<rect x="${x}" y="${h - 18}" width="11" height="11" fill="var(--bone)" fill-opacity="${OPACITY[lv]}"/>`;
    }).join("\n    ")}
    <text class="mono" x="952" y="${h - 8}" font-size="10" letter-spacing="1.5" fill="var(--dim)" text-anchor="end">more</text>
  </g>`);
};

for (const [theme, dir] of [["light", "assets"], ["dark", "assets/dark"]]) {
  mkdirSync(new URL(dir, import.meta.url), { recursive: true });
  writeFileSync(new URL(`${dir}/telemetry.svg`, import.meta.url), telemetry(THEMES[theme]));
}
console.log(`telemetry: ${totalContributions} contributions across ${weeks.length} weeks`);
