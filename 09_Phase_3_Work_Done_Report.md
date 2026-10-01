# 09. Phase 3 Work Done Report

**Project Title:** LIGHT & SHADOW (Two Souls. One Heist.)  
**Repository Directory:** `/home/meoclavezz/Projects/P-Game`  
**Phase:** Phase 3 – Design & Planning  
**Submission Timeline:** July 22, 2026 – August 5, 2026  

---

## 1. Executive Work Summary

During Phase 3 (Design & Planning), the team focused on establishing the complete software architectural blueprint, data schema, user interface design system, supporting visual diagrams, and refining the core playable web engine prototype.

Key achievements during Phase 3 include:
1. Completion of the **System Architecture Document (SAD)**, detailing the 2D Raycasting pipeline, optics physics solver, entity state machine, and audio engine.
2. Completion of the **Database Design Document (DDD)**, defining level schema JSON structures and `localStorage` state persistence.
3. Completion of the **UI/UX Design Document**, establishing the Glassmorphism Dark Noir design system and interaction flows.
4. Creation of supporting visual design artifacts: `Architecture_Diagram`, `ER_Diagram`, and `Wireframes`.
5. Significant game engine logic polish: bug fixes for audio frame spam, dynamic raycast gate evaluation, rewind state history optimization, wall sliding movement physics, particle visual effects, and guard alert feedback.

---

## 2. Team Member Work Contribution Breakdown

| Team Member Role | Phase 3 Contributions & Tasks Completed | Delivered Artifacts |
| :--- | :--- | :--- |
| **Lead Architect & Engine Developer** | Authored System Architecture Document (SAD); Refactored 2D Raycasting ray-bounce optics math; Fixed per-frame audio spam bugs in `game.js`. | `06_System_Architecture_Document.md`, `game.js` optics updates, `Supporting_Files/Architecture_Diagram.md` |
| **Gameplay & AI Programmer** | Authored Database Design Document (DDD); Implemented dynamic color-gate ray evaluation, smooth wall sliding, and rewind history checkpointing. | `07_Database_Design_Document.md`, `game.js` physics & AI updates, `Supporting_Files/ER_Diagram.md` |
| **UI/UX & Audio Specialist** | Authored UI/UX Design Document; Enhanced glassmorphic layout, navbar status indicators, particle canvas rendering, and Web Audio SFX. | `08_UI_UX_Design_Document.md`, `index.html` (the game page; renamed `game.html` in the post-Phase 3 update, §4.5), `style.css`, `Supporting_Files/Wireframes.md` |
| **Level Designer & QA Lead** | Compiled Phase 3 Work Done Report; Tested level progression, edge cases, wall collision sliding, and updated main README. | `09_Phase_3_Work_Done_Report.md`, `README.md`, Level QA verification |

---

## 3. Detailed Activity Log (Phase 3 Timeline)

- **July 22 – July 26, 2026:** Architecture design sessions; defined component boundaries for Raycaster, Entity State Machine, and Web Audio Synthesizer.
- **July 27 – July 30, 2026:** Data modeling & schema definition; structured static Level JSON schemas and `localStorage` high score persistence.
- **July 31 – August 2, 2026:** UI/UX wireframing and design token specification; finalized color palettes and Glassmorphism styling rules.
- **August 3 – August 5, 2026:** Code refactoring & bug fixing in `game.js`; verified 60 FPS performance benchmark; compiled final documentation package.

---

## 4. Post-Phase 3 Addendum — Engine Fixes & Game Completion (October 1, 2026)

After the Phase 3 submission, the playable prototype was audited end-to-end. The audit found a start-up crash, an unwinnable final level, and missing end-of-game logic. All three were fixed, and the design documents (SAD, DDD, UI/UX, requirements, README and supporting diagrams) were updated to match. A second round of work on the same date added player accounts, resume-where-you-left-off, pause, an adaptive soundtrack (later removed, see §4.6) and Vercel hosting (§4.5), and a third round made the game playable on phones and tablets with touch and tilt controls (§4.6).

### 4.1 Bug Fixes
| # | Issue | Resolution |
| :--- | :--- | :--- |
| 1 | **Start-up crash:** Lightwalker spawned just outside its spotlight cone, so "CAUGHT IN INVALID TERRAIN" appeared ~0.5 s after loading with no input. | All 4 levels redesigned with spawns on valid terrain; lighting is baked in `loadLevel()` before the first frame. |
| 2 | **Level 4 unwinnable:** prism beams were blocked by a wall, and gate activation sampled a point inside the closed gate. | Gates now open via separate colour receptors and stay open (latched) until restart. |
| 3 | **Distance-hack optics:** mirrors/prisms reacted within 400/450 px of a light even if unlit; Nyx Guards were stunned near any mirror. | Mirrors/prisms react only when a beam hits them; reflections use the real incidence angle and can chain; Nyx Guards are stunned (3 s, refreshed while lit) by any light that touches them. |
| 4 | **Guards saw through walls;** vision-angle test lacked ±π wrap-around. | Line-of-sight check (walls, closed gates, crates block it) with a normalised angle; vision cones rendered with the raycaster. |
| 5 | Guard patrol speed was per-frame (frame-rate dependent). | Scaled by `dt`. |
| 6 | Crates could be pushed through walls/out of the map; characters walked through them. | Crates are solid and move (at 60% walking speed) only into free space. |
| 7 | **Grace-swap exploit:** swapping souls reset the grace timer. | Separate per-soul grace meters that drain only while that soul is controlled on forbidden terrain. |
| 8 | Misc input/audio issues. | First-frame `dt` clamp, held keys cleared on blur, no key auto-repeat on swap/rewind, actions only in `PLAYING`, pause while Level Select is open, master gain node with Web Audio guards, mirrors rotate in 22.5° steps over 0–180° (nearest mirror within 50 px only). |

### 4.2 End Logic & Progression
* **Win condition:** loot taken (either soul, 30 px) **and** both souls inside the exit portal (radius 45 px). The exit is sealed until the loot is taken and is twilight (neutral) ground.
* **Target times & stars:** L1 25 s, L2 45 s, L3 45 s, L4 60 s; ★ completed, ★★ within target, ★★★ within target with zero rewinds (campaign max 12).
* **Overlays:** `MISSION ACCOMPLISHED!` with Time/Target/Best/Rewinds/Rating; fail overlay with Try Again / Levels; `HEIST COMPLETE!` campaign screen after Level 4 with heist total and campaign stars (the game previously looped silently back to Level 1).
* **Unlocking & persistence:** `SaveManager` now implements the DDD `localStorage` schema (plus `stars`); only Mission 1 is unlocked on a fresh profile, the Level Select shows lock state, stars and times, and offers Reset Progress.
* **Game states:** `PLAYING`, `WIN`, `FAIL`, `CAMPAIGN_COMPLETE`.

### 4.3 Level Redesign
1. **The Basics** — Light walks a static spotlight beam to the loot; Shadow circles a pillar through the dark lower wing; the exit sits on the light/dark boundary.
2. **Timing & Guards** — Cross a vertical Lumen Guard patrol while it faces away; Shadow dashes under a pendulum spotlight in its ~2.3 s dark window; a Nyx Guard patrols near the exit.
3. **Mirrors & Shadow Bridges** — Rotate the mirror twice to bend the beam down a shaft; Shadow avoids a Nyx sentry and pushes a crate into the beam to cast a shadow bridge.
4. **Prism Spectrum Heist** — Tilt the mirror once onto the prism; the red band unlocks the vault door, the blue band unlocks Shadow's cell and freezes a Nyx Guard; both souls escape with the loot.

### 4.4 Verification
* **Automated test suite:** `node tests/playthrough.test.js` (no dependencies) runs `game.js` in a Node `vm` sandbox with a stubbed DOM/canvas/`localStorage`, driving the real update loop at 60 FPS with simulated key presses. Result: **8/8 tests passing** at the time (12/12 after §4.5, 16/16 after §4.6) (idle start on every level, fresh-profile locks, full campaign playthrough, sealed exit, grace-swap exploit, L3 crate bridge, L4 prism gates & Nyx freeze, star rules/corrupt save/resume).
* **Reference bot completion times:** L1 8.9 s, L2 16.0 s, L3 13.7 s, L4 13.0 s (all within target times).
* **Browser check:** headless Google Chrome showed no console exceptions, and the game stays in `PLAYING` while idle.

### 4.5 Player Accounts, Resume & Vercel Hosting
**Goal:** let several players share one device with their own progress, let a player leave mid-mission and come back to the exact same situation, and publish the game on the web as a static site.

| Area | Delivered |
| :--- | :--- |
| **Login page** | `index.html` (+ `login.css`, `login.js`) is now the entry point; the game moved to `game.html`, which loads `auth.js` first and redirects to the login page (`location.replace`) when nobody is signed in. Animated canvas background (sweeping golden spotlight, gold/violet dust motes, two orbiting soul orbs, violet mist), glassmorphic card, Sign In / Create Account tabs with a sliding gold/violet indicator, *Stay signed in on this device*, shake on error, launch-and-fade on success, *Players on this device* chips (missions, stars, mission in progress; × removes with password), *Continue Heist / Switch Account* when a session exists, UI sounds with a remembered mute toggle, reduced-motion and phone-width support. |
| **Accounts** (`auth.js`) | Browser-only accounts in `localStorage` (`LIGHT_SHADOW_ACCOUNTS`); usernames 3–16 `[A-Za-z0-9_]` (unique ignoring case), passwords ≥ 4; random 16-byte salt + SHA-256 iterated 2000 times (dependency-free implementation verified against Node's `crypto`). Session in `sessionStorage`, plus `localStorage` when *Stay signed in* is ticked. Documented limitation: convenience login only; anyone with access to the browser storage can delete or reset accounts. |
| **Per-account progress** | `SaveManager` uses `LIGHT_SHADOW_SAVEDATA::<lowercase username>`; new save fields `lastLevelIndex`, `inProgress` (mid-level snapshot) and `audioSettings.music` (removed again with the soundtrack, see §4.6). |
| **Continue where you left off** | Snapshot written every 2 s, on pause, when the tab is hidden (auto-pause), on `pagehide` and on Sign Out; cleared on win, fail and fresh level load. A valid snapshot restores positions, active soul, timer, rewinds, mirrors, crates, gates, guards, pendulum phase and loot, and opens paused on *WELCOME BACK, NAME!*; otherwise the last mission opens with a welcome toast. |
| **Pause** | New `PAUSED` state (`P` / `Esc` / ⏸️) with Continue / Restart Level / Levels. Game states are now `PLAYING`, `PAUSED`, `WIN`, `FAIL`, `CAMPAIGN_COMPLETE`. |
| **Header** | Player badge, Pause, Music (later removed) and Sign Out buttons. |
| **Sound** | Adaptive ambient soundtrack (bright Light voicing / deep Shadow voicing that crossfade on every swap, realising the concept document's dynamic soundtrack), 🎵 toggle saved per account, mission-start and pause cues. The soundtrack was later removed (§4.6). |
| **Animations** | Mission intro title card, toasts, page fade transitions, overlay pop-in, loot bob and glow pulse, swirling exit portal, pulsing ring on the controlled soul, 90-particle victory burst; CSS animations respect `prefers-reduced-motion`. |
| **Hosting** | `vercel.json` (`cleanUrls`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` headers) and `.vercelignore` (only `index.html`, `game.html`, `*.js`, `*.css` are deployed). Deploy by importing `Meoclavez/Light-Shadow` in Vercel (preset *Other*, no build command, output = repository root) or with `npx vercel --prod`; no environment variables or database. |

**Verification**
* **Automated tests:** `node tests/playthrough.test.js` now runs **12/12 passing**. New tests: accounts (register, case-insensitive duplicate, length validation, wrong password, password not stored in plain text, multiple accounts, removal requires the password); per-account progress isolation on one device (alpha clears Mission 1, bravo starts fresh, alpha continues at Mission 2, per-account save keys exist); continue where you left off (snapshot restores level, loot, active soul, positions and timer, opens `PAUSED` with WELCOME BACK, Continue resumes, the mission can be finished, and the snapshot is cleared after the win); a failed attempt restarts fresh.
* **End-to-end browser check** (headless Google Chrome over HTTP): `game.html` without a session redirects to the login page; register → game with the player badge and intro card; play → reload resumes paused at the same position; Sign Out → the login page shows the account chip with *Mission 1 in progress*; a wrong password shows an error; a second account starts fresh; a remembered session shows *Continue as*; no horizontal overflow at 390 px; zero console errors.
* **Documentation updated:** README (structure, how to run, accounts, controls, Vercel deployment, changelog), Requirements (FR-5, NFR-4, NFR-5), SAD (auth module, page flow, `PAUSED`, snapshot lifecycle, soundtrack, deployment), DDD (accounts & session keys, per-account save, snapshot schema & rules), UI/UX (login screen, header, pause & welcome-back overlays, animations, audio, accessibility), and the supporting diagrams (flowchart, architecture, ER, requirements, use cases, wireframes).

### 4.6 Mobile, Touch & Tilt Controls
**Goal:** make the game fully playable on phones and tablets (no keyboard), fit every screen size, and offer tilt steering without making the precise beam-walking puzzles harder.

| Area | Delivered |
| :--- | :--- |
| **New module** | `mobile.js` (`MobileControls`), loaded by `game.html` before `game.js`; the engine creates it if present and calls `mobile.update(dt)` every frame. `window.MobileControlsUtil` exposes the tilt maths for the tests. |
| **Responsive playfield** (all devices) | The canvas keeps its 900×650 internal resolution; the wrapper is scaled to the largest size that fits its panel (`ResizeObserver` + `resize` / `orientationchange`, max 1.4× on desktop). Header compacts below 1200 px (Levels / Sign Out → 🗺️ / 🚪) and again below 900 px; sidebar hidden below 1100 px. Fixed a pre-existing header overflow at ~1024 px. On ≤ 900 px screens result/pause overlays become fixed full-screen cards and Level Select uses one column. |
| **Touch controls** (`body.touch-ui`) | Shown automatically on touch screens (coarse pointer, touch points or first touch) or forced On/Off. Floating analog joystick in the left *DRAG TO MOVE* zone (52 px = full speed, partial deflection walks slower, dead zone 0.12; keyboard overrides). Right-thumb **SWAP** (☀️/🌙, gold/violet glow), **ROTATE** (pulses when a mirror is in reach) and **UNDO**, acting on `pointerdown`; header rewind hidden in touch mode. |
| **Phone layouts** | Portrait: playfield on top, controls fill the bottom, header ≤ 2 rows (badge hidden ≤ 480 px). Landscape (height ≤ 600 px): one-row header, one-line objective, controls float in the side gutters. Left-handed layout swaps sides. Safe-area insets, `viewport-fit=cover`, theme-color / mobile-web-app meta tags; pull-to-refresh, text selection and long-press menus disabled in touch mode. ⛶ full-screen button (also locks orientation on Android while tilt is on). |
| **Tilt steering** (optional) | DeviceOrientation β/γ mapped to screen axes for 0/90/180/270° orientations, relative to a calibrated neutral pose (first reading, orientation change or **Calibrate**); 2.5° dead zone; full speed at 28° / 18° / 11° (Low / Med / High); diagonal capped; per-frame smoothing (12/s). Knob mirrors the tilt, *📱 TILT* label, joystick overrides tilt. iOS permission requested from a tap (*📱 TAP TO ENABLE TILT* on later visits); Android starts immediately. Status messages for no sensor, denied permission and no readings (HTTPS needed). |
| **Design decision** | The joystick is the primary mobile control and tilt is optional: the puzzles need precise steering along narrow beams within a 0.5 s grace window, while tilt is less precise, drifts with posture, needs per-session permission on iOS and can trigger auto-rotation. |
| **Haptics** | `navigator.vibrate` (Android) on swap 15 ms, mirror 10 ms, first moment on forbidden terrain 25 ms, loot 40 ms, win [30, 40, 60], fail [80, 40, 120]; Settings toggle. |
| **Settings modal** | ⚙️ in the header (all devices); freezes the game like Level Select; `Esc` closes it. Touch controls Auto/On/Off, Tilt to move (+ status), Tilt sensitivity, Calibrate, Left-handed, Vibration, and a *Playing on a phone* help list. |
| **Soundtrack removed** | After user feedback that the ambient drone was uncomfortable, the adaptive soundtrack, the 🎵 Music header button and the `audioSettings.music` save field were removed on October 1, 2026 (old saves have the field stripped on load; `audioSettings` is now `{ muted, volume }`). All sound effects, the 🔊 mute toggle and all animations remain. |
| **Persistence** | New `settings` object in the per-account save (`LIGHT_SHADOW_SAVEDATA::<user>`): `touchControls` `'auto'`, `tilt` `false`, `tiltSensitivity` `'medium'`, `leftHanded` `false`, `vibration` `true` (defaults). Older saves get the defaults. |

**Verification**
* **Automated tests:** `node tests/playthrough.test.js` now runs **16/16 passing**. New tests: Reset Progress keeps audio and control settings; analog input moves the active soul (full stick ≈ 85 px in 0.5 s, half stick half as far, dead zone ignored, keyboard overrides the stick); tilt mapping per orientation (portrait, landscape 90°, landscape 270°), dead zone and diagonal cap; control settings persist per account.
* **Headless Chrome with touch & device emulation:** iPhone-size 390×844 portrait and 844×390 landscape show no horizontal or vertical overflow; a joystick drag moved Lightwalker 213 px; a SWAP tap switched souls; Settings opens and freezes the game; simulated device tilt moved Lightwalker right at full speed (vector 1.0); the results card fits the phone screen. Desktop 1400×900 and 1024×700 show no touch UI and no overflow, and the keyboard still works. Zero console errors.
* **Documentation updated:** README (Playing on Phones & Tablets, controls table with touch equivalents, structure, tests, changelog), Requirements (FR-6, NFR-2/NFR-3 notes), SAD (Mobile Controls module, input priority, tilt pipeline, canvas scaling, Settings), DDD (`settings` schema and rules), UI/UX (touch layouts, breakpoints, control sizes and states, Settings modal), and the supporting diagrams (architecture, ER, requirements, use cases, wireframes, flowchart).
