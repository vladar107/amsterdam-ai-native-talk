# Countdown to Wednesday 25 November 2026

Status on 29 October: deck content complete (17 slides), demo moved to the work laptop and rehearsed
non-interactively, chart built from current recall-bench data, talk track written. What's left is mostly practice.

## By Wednesday 4 November: first full run

- [x] Record the live compaction session and memory fact (done 29 October, `demo/README.md`, "The live material")
- [ ] Read `notes/talk-track.md` out loud twice, slides on screen, no timer
- [ ] First timed run, standing, with the live demo (`npm run demo -- prepare`, then `npm run demo -- claude`)
- [ ] If it runs over 36 minutes, cut slide 9 to one sentence first, then slide 8
- [ ] Send the organisers the final title and the abstract if they still need them; ask about the display
      connection (HDMI or USB-C), venue Wi-Fi, microphone type, and whether there's a confidence monitor

## By Wednesday 11 November: second run, recorded

- [ ] Timed run recorded on video; watch it once and fix the three worst moments
- [ ] Record `demo/fallback/demo-run.mp4` (screen only, about 60 seconds)
- [ ] Test the laptop on an external display or TV at the presenter resolution: font sizes, Claudescope zoom, terminal font
- [ ] Set up the clean Chrome profile and terminal profile from the checklist in `demo/README.md`

## By Wednesday 18 November: dress rehearsal

- [ ] Run in front of one or two people; ask what they'd repeat to a friend (it should be slide 13)
- [ ] Re-check record shapes against the current Claude Code version (`notes/verification.md`, item 2)
- [ ] Re-run the demo on a phone hotspot to rule out venue Wi-Fi
- [ ] `npm run lint`, `npm run export`, commit, push

## Monday 23 November: freeze

- [ ] No more content changes; only fixes for things that are wrong
- [ ] Keep Claude Code on the version you rehearsed with through Wednesday (`DISABLE_AUTOUPDATER=1` in the shell
      you present from), so the demo doesn't change under you
- [ ] Final `npm run export`; copy `exports/deck.pdf` to a USB stick and to your phone

## Tuesday 24 November: the day before

- [ ] `npm run demo -- prepare`, one full demo run, then leave the windows open
- [ ] Charge everything; pack the USB-C to HDMI adapter, charger, clicker

## Wednesday 25 November

- [ ] Arrive early enough to test the projector with the deck, the terminal and Claudescope
- [ ] Focus mode on, Teams, Outlook and Slack quit
- [ ] Deck open on slide 1, Claude Code window ready in `~/src`, Claudescope on the decision turn
- [ ] Water on stage
