# Demo fallback material

There is no backup slide: if the opening demo fails, say what it would have found and move on.
The recorded answer below is what to say. The slide 5 fallback is `assets/screenshots/claudescope-session.png`, taken from the isolated demo instance.

Still to record from a full rehearsal on the presentation laptop:

- `demo-run.mp4`: a short screen recording of the run, for the case where the terminal itself is unusable.

Check every file for credentials, tokens, email addresses, employer or client names and personal data before committing.

## Recorded answer, 2026-10-29

Fresh `claude -p` in `~/src` under the `scripts/demo.sh` environment, Claude Code 2.1.312, 7 turns, 25 seconds.
Tool calls: `Skill(claudescope:history)`, `claudescope search 'Audient iD14 Raycast mic' --limit 5`,
`claudescope session bdd809e6-… --tail 12 --redact`, `claudescope session bdd809e6-… --around 9ebef932-… --radius 3 --redact`,
then a check that `~/src/micbridge` and the BlackHole cask are gone.

> Yes. We looked at this on Aug 27–28, and the conclusion was that there's no clean global mic toggle for the iD14 unless something stays running in the background. Since you didn't want that, I recommended muting inside each call app instead.
>
> **Options we looked at:**
>
> 1. **Raycast's existing mic-toggle extensions / `osascript` input volume:** these can't work. They mute by setting the input device's volume to 0, and the iD14 exposes no mute or volume controls to macOS. I checked every channel to confirm.
> 2. **Controlling the iD app over its local network port:** the iD app listens on a local TCP port (49848), and I started working out its protocol. We dropped this because the mixer's **Cut** button only mutes what you hear in your headphones. You tested it: Teams still heard you, because the signal to the computer comes straight from the preamp.
> 3. **Scripting the iD app's window, or porting the Linux USB tools** (mymixer, monix): ruled out for the same reason, and they'd also be fragile on macOS.
> 4. **Routing the mic through a virtual device you can mute** (BlackHole plus a router like LadioCast, Loopback, JACK, or a small `micbridge` program I wrote): this works as a true global mute. The catch is that macOS has no built-in way to wire one device into another, so something always has to run in the background to do it. You didn't want that.
>
> **What I recommended:**
> - **Work Mac:** the Microsoft Teams Meeting Raycast extension. Turn on the API in Teams (Settings → Privacy → Manage API) and bind a hotkey to "Toggle Microphone". This mutes the call for real, and the Teams UI shows it.
> - **Personal Mac:** the Zoom Meeting Control extension. For Google Meet in the browser, Meet's own `Cmd+D` is the best option.
> - Remove BlackHole and `~/src/micbridge`.
>
> The session ended before you confirmed the cleanup, but I just checked: `~/src/micbridge` is gone and BlackHole isn't installed through Homebrew, so nothing is left over.
