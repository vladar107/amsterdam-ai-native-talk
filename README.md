# Inside Coding Agents: Context, Memory, and What Survives Between Sessions

Deck for my talk at the AI Native Amsterdam meetup on 25 November 2026.
Speaker: Vladislav Ramazaev.

What a coding agent writes to disk during a session, how the next request is rebuilt from it, what compaction
removes, and why a small memory file can shape an agent more than a million tokens of history.

## Links

| | |
| --- | --- |
| Slides | [`slides.md`](slides.md), plain Markdown |
| Claudescope, the transcript viewer and history search used in the demos | <https://claudescope.ramazaev.dev> · [source](https://github.com/vladar107/claudescope) |
| recall-bench, the benchmark behind the retrieval chart | <https://github.com/vladar107/recall-bench> |
| Sources for every claim on a slide | [`sources.md`](sources.md) |
| Speaker | <https://www.linkedin.com/in/vladar107> · <https://ramazaev.dev> |

## Run the deck

The deck is rendered with [Deckrun](https://github.com/arpitbbhayani/deckrun), pinned as a dev dependency.

```bash
npm ci
npm run dev        # the deck on http://127.0.0.1:7890
npm run present    # the same, fullscreen on first key press
npm run notes      # Deckrun's editor: drop slides.md onto it and press Cmd+Enter to present with speaker notes
npm run lint       # deckrun lint
npm run export     # exports/deck.pdf and exports/deck.html (needs Chrome, Chromium, Edge or Brave)
npm run chart      # regenerates the recall-bench chart from assets/charts/recall-bench.csv
npm run qr         # regenerates the QR codes on the closing slide
```

## Layout

| Path | Purpose |
| --- | --- |
| `slides.md` | The deck. Speaker cues are in `<!-- notes: ... -->` comments. |
| `assets/` | Stylesheet, chart, screenshot and QR codes used by the deck. |
| `sources.md` | Every external claim and third-party visual, with its source. |
| `scripts/` | Export, chart and QR generation. |

The live demos in the talk ran against my own session history, so their setup is not part of this repository.
The slides marked `● live` carry the same content statically.
