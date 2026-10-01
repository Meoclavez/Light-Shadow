# LIGHT & SHADOW (Two Souls. One Heist.)

![Game Theme](WhatsApp%20Image%202026-07-10%20at%2011.44.31%20AM.jpeg)

**LIGHT & SHADOW** is a top-down, puzzle-stealth heist game built around a dual-character traversal mechanic centered on the physical manipulation of light and shadow.

---

## 📁 Repository Structure & Submission Package

### Phase 3 Deliverables (Design & Planning)
- **`06_System_Architecture_Document.md`**: System Architecture Document (SAD) detailing component decomposition, 2D raycasting pipeline, optics physics solver, entity state machine, and Web Audio engine.
- **`07_Database_Design_Document.md`**: Database Design Document (DDD) specifying static level JSON schemas, player accounts & sessions, per-account progress (with mid-level snapshots), and `localStorage` persistence.
- **`08_UI_UX_Design_Document.md`**: UI/UX Design Document defining the Glassmorphism Dark Noir visual design system, color tokens, and user interaction flows.
- **`09_Phase_3_Work_Done_Report.md`**: Detailed team contributions and activity log for Phase 3.

### Phase 2 Documents
- `01_Project_Proposal.md`: Concept overview, problem statement, and scope.
- `02_Work_Per_Person.md`: Technical responsibilities and work allocation matrix.
- `03_Requirement_Analysis_and_Literature_Survey.md`: System Functional/Non-Functional Specs & Literature Survey (*Robbery Bob*, *Monaco*, *Portal*, *Shadowmatic*).
- `04_Feasibility_Study.md`: Technical (2D Raycasting vs 3D NavMesh), Economic, Operational, and Schedule Feasibility.
- `05_Work_Allocation.md`: Task responsibility matrix.

### Supporting Files & Visual Diagrams (`Supporting_Files/`)
- `Architecture_Diagram.md`: High-level system architecture flowchart in Mermaid format.
- `ER_Diagram.md`: Entity-Relationship diagram for level maps, game objects, and player state.
- `Wireframes.md`: UI Layout wireframe blueprint (desktop, phone portrait & landscape, Settings modal).
- `Flowchart.md`: Login, resume, pause, settings and game loop flowchart.
- `Requirement_Diagram.md`: Requirements hierarchy diagram.
- `Use_Case_Diagram.md`: Player (keyboard, touch & tilt) & Guard AI use cases.
- `References.md`: Academic & industry references.

### Game Source (static web app)
- `index.html` + `login.css` + `login.js`: **Login screen** (entry point): sign in / create account, saved-player picker, animated light-and-shadow background and UI sounds.
- `game.html` + `style.css` + `game.js`: **The game page** (canvas engine, HUD, overlays, Level Select, Settings). It loads `auth.js` first and redirects to `index.html` if nobody is signed in.
- `mobile.js`: **Responsive playfield, touch controls, tilt steering & Settings** (`MobileControls`, loaded before `game.js`; the engine creates it if present). Also exposes `window.MobileControlsUtil` for the tests.
- `auth.js`: Browser-only player accounts and sessions (`window.LightShadowAuth`), salted & iterated SHA-256 password hashes.
- `vercel.json`: Vercel hosting config (clean URLs + security headers).
- `.vercelignore`: Keeps docs, tests and diagrams out of the deployment (only the static game is published).

### Automated Tests (`tests/`)
- `playthrough.test.js`: Dependency-free Node.js playthrough test suite that drives the real `game.js` engine, `auth.js` and the `mobile.js` tilt maths (see **Running the tests** below).

---

## 🎮 Playable Web Engine Prototype

A complete HTML5 Canvas & Web Audio interactive game engine is included in this repository.

### How to Run:
Open `index.html` (the **login page**) in any browser, or run a local HTTP server:
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser. Create an account (or sign in), and you are taken to the game page `game.html`. Opening `game.html` directly without being signed in redirects back to the login page.

### Key Game Controls:
| Action | Keyboard / Mouse | Touch screen (phones & tablets) |
| :--- | :--- | :--- |
| Move selected character (smooth wall sliding) | `WASD` / Arrow Keys | Drag in the left **DRAG TO MOVE** zone (floating analog joystick; a small push walks slowly), or tilt the phone if **Tilt to move** is on |
| Swap control between **Lightwalker** and **Shadowweaver** | `Tab` / `Space` / **Swap Soul** button | Big **SWAP** button (shows ☀️ / 🌙 of the active soul) |
| Rotate the nearest mirror ($22.5^\circ$ steps) | `E` | **ROTATE** button (glows and pulses when a mirror is in reach) |
| Undo movement step / rewind (previous checkpoint) | `Z` / ↩️ button | **UNDO** button (replaces the header ↩️ in touch mode) |
| Reset level | `R` / 🔄 button | 🔄 button |
| Next level (after a win) / Continue (while paused) | `Enter` | Overlay buttons |
| Pause / resume | `P` / `Esc` / ⏸️ button (`Esc` closes an open modal first) | ⏸️ button |
| Settings (touch controls, tilt, left-handed, vibration) | ⚙️ button (`Esc` closes it) | ⚙️ button |
| Full screen | — | ⛶ button (touch mode only; hidden if the browser cannot do it) |
| Mute / unmute all sound (saved per account) | 🔊 button | 🔊 button |
| Save the mission snapshot, sign out, return to the login page | **Sign Out** button (🚪 on narrow screens) | 🚪 button |

If a key is held, the keyboard overrides the joystick and tilt.

All sound is short procedural sound effects (footsteps, swap, mirror click, prism chime, loot, stun/alarm, victory fanfare, mission-start and pause cues); there is no background music.

---

## 📱 Playing on Phones & Tablets

The game page adapts to any screen. The canvas keeps its 900×650 internal resolution and `mobile.js` scales it to the largest size that fits the window (up to 1.4× on desktop), so the playfield is never distorted or cut off. Below 1200 px wide the header compacts (Levels / Sign Out become 🗺️ / 🚪), below 1100 px the sidebar is hidden, and below 900 px the result/pause cards become full-screen and Level Select uses one column.

### Touch Controls
* **Shown automatically** on touch screens (coarse pointer, touch points, or the first real touch). Force them **On** or **Off** in ⚙️ Settings.
* **Left thumb – floating joystick:** touch anywhere in the **DRAG TO MOVE** zone and the stick appears under your thumb. 52 px of travel is full speed; a partial push walks proportionally slower (good for narrow beams). A small dead zone ignores accidental touches.
* **Right thumb – action buttons:** **SWAP** (☀️ gold / 🌙 violet glow of the active soul), **ROTATE** (glows when a mirror is in reach) and **UNDO**. Buttons react on touch-down for instant response.
* **Left-handed layout** (Settings) swaps the joystick and buttons.
* **Vibration** (Android; iOS Safari has no vibration API): short buzzes on swap, mirror turn, stepping onto forbidden terrain, loot, win and fail. Can be switched off in Settings.

### Tilt to Move (optional)
* Turn on **Settings → Tilt to move** to steer by tilting the phone. The angle you hold it at when tilt starts is "standing still"; tap **Calibrate** to reset it at any time (it also re-calibrates after the screen rotates).
* **Tilt sensitivity** Low / Med / High = full speed at 28° / 18° / 11° of tilt (2.5° dead zone). The resting joystick knob shows what the sensor is doing and a **📱 TILT** label appears under it.
* Touching the joystick always overrides tilt.
* **iPhone / iPad:** Safari asks for motion permission when you switch tilt on. On later visits it shows **📱 TAP TO ENABLE TILT**; the first tap re-grants it. Android starts straight away.
* Tilt needs HTTPS (the Vercel deployment provides it). Turn on your phone's **rotation lock** so tilting does not rotate the screen.
* **Why the joystick is the default:** the souls must follow narrow light beams with only a 0.5 s grace window, and tilt is less precise, drifts with your holding posture, needs per-session permission on iOS and can trigger screen rotation. Tilt is therefore offered as an option with calibration, sensitivity and joystick override.

### Layout Tips
* **Portrait:** the playfield sits on top and the controls fill the bottom of the screen.
* **Landscape** (recommended, biggest view): a compact one-row header and one-line objective; the joystick and buttons float in the side gutters left and right of the playfield.
* **⛶ Full screen** hides the browser bars. With tilt on, Android also locks the current orientation while in full screen.
* Notches and rounded corners are respected; pull-to-refresh, text selection and long-press menus are disabled while playing.

All control settings are saved per account (see **Save Data**).

---

## 🏆 How to Win / Progression

### Mission Objective
1. **Steal the loot:** either soul can grab the loot by moving within 30 px of it.
2. **Escape together:** bring **both** Lightwalker and Shadowweaver inside the exit portal (radius 45 px).

The exit portal is drawn **sealed** (grey, dashed, `🔒 EXIT`) until the loot is taken, then turns **green**. The portal is *twilight*: neutral ground where neither soul's terrain rule applies, so both souls can stand in it safely. The objective banner updates once the loot is secured.

### Target Times & Star Rating
| Mission | Target (par) time |
| :--- | :--- |
| 1. The Basics | 25 s |
| 2. Timing & Guards | 45 s |
| 3. Mirrors & Shadow Bridges | 45 s |
| 4. Prism Spectrum Heist | 60 s |

The HUD timer pill shows `elapsed / target` and turns amber once you are over the target.
* ★ = mission completed
* ★★ = completed within the target time
* ★★★ = within the target time with **zero rewinds** (`Z`) used

The campaign maximum is **12 stars**.

### Unlocking & Campaign End
* A fresh profile starts with only Mission 1 unlocked; clearing a mission unlocks the next.
* The Level Select modal shows each mission's lock state (🔒), stars, best time and target time, the campaign star total, and a **Reset Progress** button (with confirmation).
* On page load the game resumes where you left off (see **Accounts & Continue Where You Left Off** below).
* Winning Mission 4 ends the campaign with a **HEIST COMPLETE!** screen showing the heist total (sum of best times) and campaign stars, with **Play Again ⟲** (restarts at Mission 1), **Replay Level** and **Levels** buttons.

### Save Data
Progress (unlocked missions, best times, stars, last mission, mid-level snapshot), audio settings (mute, volume) and control settings (touch controls, tilt, tilt sensitivity, left-handed layout, vibration) are stored in the browser's `localStorage` under a per-account key `LIGHT_SHADOW_SAVEDATA::<lowercase username>`. (The shared key `LIGHT_SHADOW_SAVEDATA` is only used when no account/session exists, e.g. in the headless tests.) Corrupt or blocked storage falls back to a fresh profile. See `07_Database_Design_Document.md` §4–§5 for the schemas.

---

## 👤 Accounts & Continue Where You Left Off

### Player Accounts
* The login page (`index.html`) offers **Sign In** and **Create Account**. Usernames are 3–16 characters (`A–Z`, `a–z`, `0–9`, `_`) and unique ignoring case; passwords need at least 4 characters.
* Several players can have accounts in the same browser; each keeps **separate progress**. The **Players on this device** list shows each account with missions cleared (`x/4`), stars, and `▶ Mission N in progress` if a heist was left mid-level. Click a player to prefill the username; **×** removes the account and its progress (password required).
* **Stay signed in on this device** (ticked by default) remembers the session; otherwise you stay signed in only in this tab. If a session exists the login page shows **Continue Heist ➔ / Switch Account**.
* **How passwords are stored:** never in plain text. Each account has a random 16-byte salt and a SHA-256 hash iterated 2000 times (`auth.js`, dependency-free implementation verified against Node's `crypto`).
* **Limitation (by design):** accounts live only in the browser where they were created; there is no server or database, so the site can be hosted as plain static files. This is a *convenience* login: anyone with access to the browser storage can delete or reset accounts. **Do not reuse a real password.**

### Continue Where You Left Off
* While you play, a snapshot of the mission is saved every 2 s, when you pause, when the tab is hidden (which also pauses the game), when the page is closed, and on **Sign Out**.
* Next time you sign in, the exact situation is restored (both souls' positions, active soul, timer, rewinds used, mirror angles, crates, opened gates, guards, pendulum phase, loot) and the game opens **paused** on a **WELCOME BACK, NAME!** card (**Continue** / Restart Level / Levels; `P` or `Enter` also continue).
* Without a snapshot you start at your last mission (or the first unfinished one) with a toast such as *"Welcome back, NAME! Continuing from Mission 2."*
* Winning or failing a mission clears the snapshot: a failed attempt restarts the mission fresh next time.

---

## 🧪 Running the Tests

```bash
node tests/playthrough.test.js
```

No dependencies are required. The suite loads `auth.js` and `game.js` in a Node `vm` sandbox with a stubbed DOM/canvas/`localStorage`/`sessionStorage` and drives the real update loop at 60 FPS with simulated key presses. Its 15 tests cover: idle start-up survival on every level, level locking on a fresh profile, a full 4-level campaign playthrough (saving, unlocking, campaign-end screen, Play Again), the sealed exit, the grace-swap exploit, the Level 3 crate bridge, the Level 4 prism gates and Nyx freeze, star rules / corrupt save / resume, **accounts** (register, case-insensitive duplicates, validation, wrong password, no plain-text passwords, multiple accounts, password-protected removal), **per-account progress isolation**, **continue where you left off** (exact snapshot restore, opens paused, mission can be finished, snapshot cleared after the win), **a failed attempt restarts fresh**, **analog touch/tilt input** (full stick ≈ 85 px in 0.5 s, half stick half as far, dead zone ignored, keyboard overrides), **tilt mapping** per screen orientation (portrait, landscape 90°, landscape 270°) with dead zone and diagonal cap, and **control settings persist per account**. Current result: **16/16 passing**.

For debugging in the browser, the running engine is exposed as `window.lightShadowGame`, the account API as `window.LightShadowAuth`, and the tilt helpers as `window.MobileControlsUtil`.

---

## 🚀 Deploying to Vercel

The game is a plain static site (no build step, no server, no database, no environment variables).

1. In Vercel, **Add New → Project** and import the GitHub repository `Meoclavez/Light-Shadow`.
2. Framework Preset: **Other**. Build Command: *none*. Output Directory: the repository root.
3. Deploy. Alternatively, from the repository folder: `npx vercel` (preview) or `npx vercel --prod` (production).

* `vercel.json` enables `cleanUrls` (so `/` serves the login page and `/game` serves `game.html`) and adds security headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`.
* `.vercelignore` excludes `.agents`, `tests`, `Supporting_Files`, `*.md`, `*.docx`, `*.pdf`, `*.jpg`, `*.jpeg`, so only `index.html`, `game.html`, `*.js` and `*.css` are published.
* Vercel serves the site over HTTPS; the same files also run on `localhost` or straight from disk.

---

## 📝 Changelog — October 1, 2026

* **Start-up crash fixed:** the Lightwalker no longer spawns outside its light cone ("CAUGHT IN INVALID TERRAIN" ~0.5 s after loading). All 4 levels were redesigned and lighting is computed before the first frame.
* **Level 4 is winnable:** gates now open via colour receptors and stay open (latched).
* **Real optics:** mirrors and prisms only react when a beam actually lights them; reflections use the true incidence angle and can chain; Nyx Guards are stunned (3 s, refreshed while lit) by any light touching them.
* **Guard vision:** requires line of sight (walls, closed gates and crates block it) with correct angle wrap-around; vision cones visibly stop at walls. Patrol speed is frame-rate independent.
* **Solid crates:** crates no longer pass through walls or leave the map, and characters cannot walk through them.
* **Grace exploit closed:** each soul has its own grace meter, so swapping no longer resets it.
* **Complete end logic:** loot-gated exit, target times, star ratings, level unlocking, saved progress and a campaign completion screen (previously the game silently looped back to Mission 1).
* **Misc:** first-frame `dt` clamp, held keys cleared on window blur, no key auto-repeat on swap/rewind, game pauses while Level Select is open, safer Web Audio, mirrors rotate in 22.5° steps over 0–180°.
* **Player accounts:** new login page (`index.html`, `login.css`, `login.js`) with Sign In / Create Account, a saved-player picker and an animated light-and-shadow background with UI sounds; the game moved to `game.html`, which redirects to the login page when nobody is signed in. Accounts (`auth.js`) are browser-only with salted, iterated SHA-256 password hashes.
* **Per-account progress & resume:** each account has its own save key; a mid-level snapshot is autosaved and restored exactly (opening paused on a WELCOME BACK card); the last mission is remembered.
* **Pause:** new `PAUSED` state (`P` / `Esc` / ⏸️) with Continue / Restart Level / Levels; the game also pauses when the tab is hidden.
* **Sound & animation:** adaptive ambient soundtrack that crossfaded between Light and Shadow voicings on every swap (🎵 toggle; later removed after user feedback, along with the Music button and the `audioSettings.music` save field), mission-start and pause cues, mission intro title card, toasts, page fade transitions, loot bob, swirling exit portal, controlled-soul ring, victory particle burst.
* **Header:** player badge, Pause, Music (later removed) and Sign Out buttons.
* **Hosting:** `vercel.json` + `.vercelignore` for static Vercel deployment.
* **Tests:** 12/12 passing (4 new account/progress/resume tests).
* **Phones, tablets & any window size:** new `mobile.js`. The playfield scales to fit every screen (max 1.4× on desktop); the header compacts below 1200 px and the sidebar hides below 1100 px (fixes a header overflow at ~1024 px); result/pause cards go full-screen on small screens.
* **Touch controls:** floating analog joystick (partial push = slower walk) plus SWAP / ROTATE / UNDO thumb buttons, portrait and landscape phone layouts, left-handed layout, ⛶ full screen, safe-area (notch) support, vibration feedback (Android).
* **Tilt to move (optional):** DeviceOrientation steering mapped to the screen orientation, with calibration, Low/Med/High sensitivity, smoothing and joystick override; iOS motion permission handled from a tap. The joystick stays the primary control because tilt is less precise on narrow beams.
* **Settings modal (⚙️):** touch controls Auto/On/Off, tilt, sensitivity, calibrate, left-handed, vibration; saved per account (`settings` in the save data). The game freezes while it is open.
* **Tests:** 16/16 passing (new analog input / tilt mapping / settings persistence / Reset-Progress-keeps-settings tests); also checked in headless Chrome with touch emulation at 390×844 and 844×390 and on desktop at 1400×900 and 1024×700 with zero console errors.
