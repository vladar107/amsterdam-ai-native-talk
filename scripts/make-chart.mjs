#!/usr/bin/env node
// Renders assets/charts/recall-bench{,-light}.svg from assets/charts/recall-bench.csv.
// Effort and accuracy use different units, so they get separate panels rather than a second axis.
// The slide references the dark file; assets/talk.css swaps in the light one under the paper theme.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const [header, ...lines] = readFileSync(join(root, "assets/charts/recall-bench.csv"), "utf8").trim().split("\n");
const keys = header.split(",");
const rows = lines.map((l) => Object.fromEntries(l.split(",").map((v, i) => [keys[i], isNaN(+v) ? v : +v])));
const get = (metric, label) => rows.find((r) => r.metric === metric && r.label === label);

// Series colours validated with the dataviz palette checker against each surface.
const palettes = {
  "recall-bench.svg": { bg: "#121820", ink: "#f0f3f6", muted: "#8b949e", grid: "#262c36", pilot: "#3f8fdc", pooled: "#c2842c" },
  "recall-bench-light.svg": { bg: "#ffffff", ink: "#14171c", muted: "#6b7079", grid: "#e1ded6", pilot: "#1f5fa8", pooled: "#b3530f" },
};
const W = 760, left = 150, right = 600;
const sans = "Inter, -apple-system, 'Helvetica Neue', sans-serif", mono = "'JetBrains Mono', Menlo, monospace";

function render({ bg, ink, muted, grid, pilot, pooled }) {
  const series = [
    { label: "pilot", name: "Pilot · 1 corpus", color: pilot, dy: -14 },
    { label: "pooled", name: "Pooled · 3 corpora", color: pooled, dy: 14 },
  ];
  const out = [];
  const text = (x, y, s, o = {}) =>
    out.push(`<text x="${x}" y="${y}" font-family="${o.font ?? sans}" font-size="${o.size ?? 22}" fill="${o.fill ?? ink}"` +
      ` text-anchor="${o.anchor ?? "start"}"${o.weight ? ` font-weight="${o.weight}"` : ""}>${s}</text>`);

  function panel({ top, title, min, max, ticks, ref, refLabel, fmt, rowsSpec }) {
    const x = (v) => left + ((v - min) / (max - min)) * (right - left);
    const bottom = top + 40 + rowsSpec.length * 84;
    text(12, top, title, { size: 28, weight: 600 });
    for (const t of ticks) {
      out.push(`<line x1="${x(t)}" y1="${top + 22}" x2="${x(t)}" y2="${bottom}" stroke="${grid}" stroke-width="1"/>`);
      text(x(t), bottom + 30, fmt(t), { anchor: "middle", size: 21, fill: muted, font: mono });
    }
    out.push(`<line x1="${x(ref)}" y1="${top + 22}" x2="${x(ref)}" y2="${bottom}" stroke="${muted}" stroke-width="2" stroke-dasharray="5 5"/>`);
    text(x(ref) + 8, top + 44, refLabel, { size: 19, fill: muted });
    rowsSpec.forEach(({ metric, name }, i) => {
      const cy = top + 92 + i * 84;
      text(left - 24, cy + 9, name, { anchor: "end", size: 26 });
      for (const s of series) {
        const r = get(metric, s.label), y = cy + s.dy;
        out.push(`<line x1="${x(r.low)}" y1="${y}" x2="${x(r.high)}" y2="${y}" stroke="${s.color}" stroke-width="3" stroke-linecap="round"/>`);
        out.push(`<circle cx="${x(r.value)}" cy="${y}" r="9" fill="${s.color}" stroke="${bg}" stroke-width="2"/>`);
        text(x(r.high) + 12, y + 8, fmt(r.value, true), { size: 21, font: mono });
      }
    });
    return bottom + 30;
  }

  let y = 44;
  series.forEach((s, i) => {
    const lx = 22 + i * 300;
    out.push(`<circle cx="${lx}" cy="${y - 8}" r="9" fill="${s.color}"/>`);
    text(lx + 20, y, s.name, { size: 24 });
  });
  y = panel({
    top: y + 64, title: "Effort: raw search ÷ indexed", min: 0.5, max: 4.5, ticks: [1, 2, 3, 4], ref: 1,
    refLabel: "no difference", fmt: (v, exact) => `${exact ? v.toFixed(2) : v}×`,
    rowsSpec: [{ metric: "latency_ratio", name: "Time" }, { metric: "cost_ratio", name: "Cost" }],
  });
  y = panel({
    top: y + 64, title: "Accuracy: indexed − raw", min: -5, max: 20, ticks: [0, 10, 20], ref: 0,
    refLabel: "no difference", fmt: (v, exact) => `${v > 0 ? "+" : ""}${exact ? v.toFixed(1) : v} pp`,
    rowsSpec: [{ metric: "accuracy_pp", name: "Correct" }],
  });
  const H = y + 50;
  text(12, H - 16, "Dots: estimate · lines: 95% bootstrap CI · recall-bench @ 66dc060", { size: 18, fill: muted });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img"` +
    ` aria-label="recall-bench: raw search took 2.4 to 2.9 times longer and cost 1.8 to 2.3 times more than indexed search;` +
    ` accuracy gain +8.9 pp in the pilot, +2.3 pp pooled with a CI crossing zero">` +
    `<rect width="${W}" height="${H}" rx="14" fill="${bg}"/>${out.join("")}</svg>\n`;
}

for (const [file, palette] of Object.entries(palettes)) {
  writeFileSync(join(root, "assets/charts", file), render(palette));
  console.log(`assets/charts/${file}`);
}
