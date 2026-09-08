# Inside Coding Agents: Context, Memory, and What Survives Between Sessions

Deck for the AI Native Amsterdam meetup talk on 25 November 2026 (35–40 minutes plus questions).
Speaker: Vladislav Ramazaev.

## Links

| | |
| --- | --- |
| Slides (PDF) | `exports/deck.pdf` in this repository, attached to the release after the talk |
| Claudescope, the transcript viewer used in the demo | <https://github.com/vladar107/claudescope> |
| recall-bench, the retrieval comparison behind the one chart | <https://github.com/vladar107/recall-bench> |
| Sources for every claim on a slide | [`sources.md`](sources.md) |
| Speaker | <https://www.linkedin.com/in/vladar107> · <https://linktr.ee/vladar107> |

The deck is plain Markdown rendered with [Deckrun](https://github.com/arpitbbhayani/deckrun),
pinned as a dev dependency so the presentation does not depend on whatever `npx deckrun` resolves to on the day.

## Layout

| Path | Purpose |
| --- | --- |
| `slides.md` | The deck. Speaker notes live in `<!-- notes: ... -->` comments and carry per-slide timing. |
| `prototypes/` | Three-slide visual prototype and its renders in the candidate themes. |
| `assets/` | Screenshots, diagrams and charts referenced from the deck. Placeholders are labelled as such. |
| `demo/` | Opening-demo plan, synthetic fixtures modelled on real session formats, and fallback material. |
| `notes/` | Working documents: timing, verification list, demo decision. |
| `scripts/` | PDF/HTML export and prototype rendering through the local Deckrun server. |
| `sources.md` | Every external claim and third-party visual, with its source. |

## Run

```bash
npm ci
npm run dev        # editor + live preview on http://127.0.0.1:7890, saves back to slides.md
npm run present    # same deck, fullscreen on first key press
npm run lint       # deckrun lint over the deck and the prototype
npm run export     # exports/deck.pdf and exports/deck.html (needs Chrome/Chromium/Edge/Brave)
npm run proto      # renders prototypes/prototype.md in the candidate themes to prototypes/renders/
npm run qr         # regenerates the QR codes for the closing slide (assets/qr/)
```

Theme, template and transition are set in `package.json` scripts and can be overridden for exports with
`THEME=daylight npm run export`. Theme decision (2026-09-08): `paper`, `minimal` template, `fade` transition, type size `l` for the room.

## Authoring rules that bite

- `---` on its own line is the only slide separator, and it also splits inside fenced code blocks.
  Frontmatter samples on slides therefore omit their delimiter lines.
- Every fenced block needs a language tag; `deckrun lint` fails otherwise.
- Overflowing content is clipped, not scrolled. Split the slide.
- Image placement is the quoted title: `![alt](file.png "right")`.
- Mermaid node labels clipped in the headless PDF render of 1.6.0; the deck uses fenced `text` diagrams instead.
- Long lines in code blocks scroll on screen but are cut off in the PDF; keep sample lines under ~95 characters.

## Presentation day

- Present from the browser with `npm run present`; keep Terminal, Claude Code and Claudescope in separate windows.
- Export a fresh `exports/deck.pdf` after every stable revision; it is the strongest offline fallback.
  The standalone HTML export still loads fonts, highlighting, KaTeX and Mermaid from CDNs.
- The recorded-answer fallback is the last slide, reached with `End`. Return with `O` (overview) and a click.
  Claudescope is shown live in its own browser window; the screenshot on the slide is the fallback.
- Deckrun's pixel pets are hidden by a `<style>` block on the title slide, which also adds a small fixed footer.
- The reconstruction slide embeds the local Claudescope UI in an iframe (`http://127.0.0.1:4317/sessions/<id>`), so
  `claudescope start` must be running before the deck opens. The screenshot in `assets/screenshots/` is the fallback.
