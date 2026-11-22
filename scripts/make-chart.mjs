#!/usr/bin/env node
// Renders assets/charts/recall-bench{,-light}.svg from assets/charts/recall-bench.csv.
// Three measures in three units, so three small panels on their own scales rather than one shared axis.
// The slide references the dark file; assets/talk.css swaps in the light one under the paper theme.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const [header, ...lines] = readFileSync(join(root, "assets/charts/recall-bench.csv"), "utf8").trim().split("\n");
const keys = header.split(",");
const rows = lines.map((l) => Object.fromEntries(l.split(",").map((v, i) => [keys[i], isNaN(+v) ? v : +v])));
const get = (metric, approach) => rows.find((r) => r.metric === metric && r.approach === approach).value;

// Raw and indexed colours validated with the dataviz palette checker against each surface.
const palettes = {
  "recall-bench.svg": { bg: "#121820", ink: "#f0f3f6", muted: "#8b949e", grid: "#262c36", raw: "#c2842c", index: "#3f8fdc" },
  "recall-bench-light.svg": { bg: "#ffffff", ink: "#14171c", muted: "#6b7079", grid: "#e1ded6", raw: "#b3530f", index: "#1f5fa8" },
};
const approaches = [
  { key: "raw", name: "Raw files · grep", color: "raw" },
  { key: "mcp", name: "Index · MCP", color: "index" },
  { key: "skill", name: "Index · skill", color: "index" },
];
const panels = [
  { metric: "seconds", title: "Time per question", max: 70, fmt: (v) => `${Math.round(v)} s` },
  { metric: "usd", title: "Cost per question", max: 0.27, fmt: (v, base) => `$${v.toFixed(2)}` + (v < base ? ` · −${Math.round((1 - v / base) * 100)}%` : "") },
  { metric: "correct_pct", title: "Correct answers", max: 100, fmt: (v) => `${Math.round(v)}%` },
];
const W = 760, left = 250, right = 640, rowH = 46, barH = 28;
const sans = "Inter, -apple-system, 'Helvetica Neue', sans-serif", mono = "'JetBrains Mono', Menlo, monospace";

function render(p) {
  const out = [];
  const text = (x, y, s, o = {}) =>
    out.push(`<text x="${x}" y="${y}" font-family="${o.font ?? sans}" font-size="${o.size ?? 24}" fill="${o.fill ?? p.ink}"` +
      ` text-anchor="${o.anchor ?? "start"}"${o.weight ? ` font-weight="${o.weight}"` : ""}>${s}</text>`);

  let y = 48;
  for (const { metric, title, max, fmt } of panels) {
    text(16, y, title, { size: 28, weight: 600 });
    out.push(`<line x1="${left}" y1="${y + 16}" x2="${left}" y2="${y + 16 + approaches.length * rowH}" stroke="${p.grid}" stroke-width="2"/>`);
    approaches.forEach(({ key, name, color }, i) => {
      const top = y + 24 + i * rowH, v = get(metric, key), w = (v / max) * (right - left);
      text(left - 16, top + 22, name, { anchor: "end" });
      out.push(`<path d="M${left},${top} h${w - 4} a4,4 0 0 1 4,4 v${barH - 8} a4,4 0 0 1 -4,4 h${-(w - 4)} z" fill="${p[color]}"/>`);
      text(left + w + 12, top + 22, fmt(v, get(metric, "raw")), { font: mono, weight: 600 });
    });
    y += 24 + approaches.length * rowH + 56;
  }
  const H = y + 4;
  text(16, H - 22, "Agent: Claude Sonnet 5 · 3 machines · 87 questions · recall-bench @ 66dc060", { size: 18, fill: p.muted });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img"` +
    ` aria-label="recall-bench, Claude Sonnet 5 as the agent, pooled over three machines: searching raw transcript files took 62 seconds and 24 cents per question,` +
    ` an index took 27 to 30 seconds and 13 to 20 cents, 45 and 15 percent cheaper; correct answers 93 percent raw, 95 percent indexed">` +
    `<rect width="${W}" height="${H}" rx="14" fill="${p.bg}"/>${out.join("")}</svg>\n`;
}

for (const [file, palette] of Object.entries(palettes)) {
  writeFileSync(join(root, "assets/charts", file), render(palette));
  console.log(`assets/charts/${file}`);
}
