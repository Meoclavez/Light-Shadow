# 06. System Architecture Document (SAD)

**Project Title:** LIGHT & SHADOW (Two Souls. One Heist.)  
**Repository Directory:** `/home/meoclavezz/Projects/P-Game`  
**Phase:** Phase 3 – Design & Planning  
**Date:** August 2026  
**Last Updated:** October 1, 2026 (post-Phase 3 engine fixes & game completion; player accounts, resume snapshots, pause, adaptive soundtrack & Vercel hosting; mobile, touch & tilt controls, responsive playfield & Settings)  

---

## 1. Executive Architecture Summary

The **LIGHT & SHADOW** system is designed as a high-performance, component-based, decoupled client architecture. Built using standard web technology (HTML5 Canvas, CSS Glassmorphic Styling, JavaScript ES6+, Web Audio API, Web Storage, Pointer Events, DeviceOrientation and Vibration APIs) and deployed as a plain static site (two pages: a login page and the game page), the engine relies on a custom 2D Visibility Polygon Raycaster that computes optical paths and dynamic walkable geometry in real-time ($<1.0\text{ms}$ per frame), maintaining a rock-solid 60+ FPS performance target.

---

## 2. High-Level Architectural View

The system architecture comprises a login page with an account module, and the game client's main modules, interacting through event-driven and frame-based loops:

```
+-------------------------------------------------------------------------+
|           LOGIN PAGE  (index.html + login.css + login.js)               |
| - Sign In / Create Account forms   - Players-on-this-device picker      |
| - Animated light/shadow background - UI sound effects (Web Audio)       |
+-------------------------------------------------------------------------+
       |  register / login / logout             ^ no session: redirect
       v                                        | (location.replace)
+-----------------------------+                 |
| AUTH MODULE (auth.js)       |-----------------+
| window.LightShadowAuth      |   session check runs first on game.html
| - LIGHT_SHADOW_ACCOUNTS     |
| - LIGHT_SHADOW_SESSION      |   saveKeyFor(user)
| - salted SHA-256 x2000      |-------------------------------+
+-----------------------------+                               |
       | session OK                                           |
       v                                                      |
+-------------------------------------------------------------------------+
|                    GAME CLIENT  (game.html + game.js)                    |
+-------------------------------------------------------------------------+
       |                                                    |
       v                                                    v
+-----------------------------+                  +------------------------+
|    INPUT & EVENT MANAGER    |                  |  UI & GLASSMORPHIC HUD |
| - Keyboard (WASD,Tab,E,Z,P) |                  | - Character Cards      |
|   -> engine.keys            |                  | - Loot/Timer/Grace     |
| - UI Click Events           |                  | - Player badge, toasts |
| - visibilitychange/pagehide |                  | - Pause/Welcome/Intro  |
+-----------------------------+                  | - Settings modal (⚙️)  |
       |          ^ engine.analogInput {x, y}    +------------------------+
       |          | + swap / interact / rewind              |
       |  +-------------------------------------------+     |
       |  | MOBILE CONTROLS (mobile.js, optional)     |     |
       |  | - Floating joystick + SWAP/ROTATE/UNDO    |     |
       |  | - Tilt (DeviceOrientation), calibration   |     |
       |  | - Responsive canvas fit (ResizeObserver)  |     |
       |  | - Settings modal, full screen             |     |
       |  +-------------------------------------------+     |
       v                                                    |
+--------------------------------------------------+        |
|               GAME ENGINE CONTROLLER             | <------+
| - Level Manager                                  |
| - Game Loop & State Evaluator (incl. PAUSED)     |     +-----------------------+
| - Progression / Campaign Controller              | --> | SAVE MANAGER          |
| - Snapshot autosave / restore                    |     | - per-account key     |
+--------------------------------------------------+     | - localStorage JSON   |
       |                         |                       +-----------------------+
       v                         v
+--------------------+   +-------------------+   +------------------------+
| OPTICS & RAYCASTER |   | ENTITY & AI ENGINE|   | AUDIO SYNTHESIZER      |
| - 2D Visibility    |   | - Dual Characters |   | - Web Audio Oscillators|
| - Mirrors & Prisms |   | - Guard State Mch |   | - Dynamic SFX Engine   |
+--------------------+   +-------------------+   | - Adaptive soundtrack  |
                                                 +------------------------+
```

---

## 3. Subsystem Breakdown & Component Specifications

### 3.1 Input & Event Manager
* Captures player input events asynchronously (`keydown`, `keyup`, mouse/touch clicks). Touch, joystick and tilt input are handled by the Mobile Controls module (§3.10) and reach the engine through `engine.analogInput` and the existing action methods.
* Normalizes direction vectors for movement (`WASD` / Arrow keys) and triggers discrete actions for soul swapping (`Tab`/`Space`), mirror rotation (`E`), tactical step undo (`Z`), level restart (`R`), next level after a win (`Enter`), pause / resume (`P` or `Esc`; `Esc` closes an open Level Select or Settings modal first), and Continue while paused (`Enter`).
* Header buttons: ⏸️ Pause, ⚙️ Settings, ⛶ Full screen (touch mode only), 🎵 Music, 🔊 Sound, ↩️ Rewind (hidden in touch mode, replaced by UNDO), 🔄 Restart, Levels, and **Sign Out** (saves the snapshot, ends the session, fades back to the login page).
* `Esc` closes an open modal (Level Select or Settings) before it toggles pause. While either modal is open, gameplay keys are ignored and the update loop is frozen.
* Discrete gameplay actions ignore key auto-repeat and are only accepted in the `PLAYING` state; held keys are cleared on window blur and on pause.
* Page lifecycle events: `visibilitychange` (tab hidden → auto-pause and save the snapshot) and `pagehide` (save the snapshot). The first key press or pointer press starts the soundtrack (browsers block audio autoplay).

### 3.2 2D Visibility Polygon & Raycasting Engine
* **Algorithm:** For each active light source (lamps, rotating spotlights), the raycaster projects 60+ radial rays bounded by field-of-view ($FOV$) and range.
* **Segment Intersection:** Computes closest line-segment intersections against all environmental boundaries, solid walls, gates, and pushable crates.
* **Light Sources:** `spotlight` (cone) or `lamp` (360°); a source may spin continuously (`rotateSpeed`, rad/s) or swing as a pendulum (`sweep`: $\theta = \theta_{\text{base}} + A\sin(t \cdot \omega)$).
* **Optics Pipeline (hit-driven, not distance-based):**
  - **Mirrors:** A mirror reacts only if a beam actually lights it. The reflection uses the real incidence angle, $\theta_{\text{reflect}} = 2\theta_{\text{mirror}} - \theta_{\text{incident}}$, casting a secondary light cone (width `spread`, default 0.25 rad). Reflections can chain into further mirrors and prisms.
  - **Prisms:** Solid 30×30 glass blocks (they block movement and white light). When lit, a prism splits white light into three parallel 40 px laser bands — Red ($-0.45$ rad), Green ($0$), Blue ($+0.45$ rad) relative to the incoming beam — with a range of 650 px. Bands count as light for both terrain rules.
  - **Receptors & Gates:** Each gate has a colour receptor; a gate opens when a band of its `reqColor` covers the receptor and stays open (latched) until the level restarts.
  - **Guard Stun:** Any light polygon or band that touches a Nyx Guard stuns it for 3.0s (refreshed while lit).
* **Initial Bake:** Lighting is computed in `loadLevel()` before the first frame, so spawn positions are validated against real lit/unlit terrain from frame one.
* **Output:** Generates closed polygon vertex arrays representing active illuminated terrain ($T_{\text{light}}$) and inverse shadow terrain ($T_{\text{shadow}} = U \setminus T_{\text{light}}$).

### 3.3 Entity Controller & Dual Character State Machine
* **Lightwalker Entity:** Constrained to $T_{\text{light}}$. Stepping outside triggers a 0.5s grace period before failing.
* **Shadowweaver Entity:** Constrained to $T_{\text{shadow}}$. Touching light beams triggers grace countdown.
* **Per-Soul Grace Meters:** Each soul owns a 0.5s grace meter that drains only while that soul is controlled and on forbidden terrain, and refills only when that soul is back on valid terrain. Swapping souls no longer resets the timer.
* **Twilight Exit:** Inside the exit portal radius (45 px) neither soul's terrain rule applies.
* **Movement Physics:** Features smooth wall sliding (axis decomposition) to prevent sticking against corners. Movement and patrols are scaled by `dt` (first-frame `dt` clamped to 0).
* **Solid Crates:** Crates block characters. Pushing moves a crate (at 60% walking speed) only if its new position is free of walls, closed gates, other crates, prisms, the parked soul, and map bounds.
* **Rewind Manager:** Pushes discrete snapshots (every ~50 px of movement, on soul swaps, and on mirror turns) onto a double-ended stack, allowing seamless tactical steps undo without breaking game state consistency. Rewinds are counted for the star rating.

### 3.4 Guard AI Engine
* **Lumen Guards (Daywatch):** Patrol lit corridors with directional vision cones ($R=160\text{px}$, $\theta=\pm 0.4\text{rad}$). Detects Lightwalker upon line-of-sight entry.
* **Nyx Guards (Nightwatch):** Patrol unlit rooms with night-vision cones. Detects Shadowweaver in darkness. If touched by any light, enters a 3.0s `STUNNED` state (refreshed while lit).
* **Line of Sight:** Detection requires a clear line of sight — walls, closed gates, and crates block it — and the vision-angle test uses a normalised angle difference (correct $\pm\pi$ wrap-around). Vision cones are rendered with the raycaster so they visibly stop at walls.
* **Patrol Speed:** Scaled by `dt`, making patrols frame-rate independent.

### 3.5 Audio Synthesizer Engine
* Procedural sound generation via Web Audio API (`AudioContext`).
* Synthesizes distinct harmonic tones:
  - Lightwalker step: High sine wave pitch ramp ($587\text{Hz} \rightarrow 880\text{Hz}$).
  - Shadowweaver step: Deep bass triangle tone ($110\text{Hz} \rightarrow 65\text{Hz}$).
  - Prism refraction: Arpeggiated chime sequence.
  - Guard stun: Sawtooth frequency sweep.
  - Mission start: rising triangle arpeggio (D4–A4–D5) played with the intro title card; pause: short blip.
* **Adaptive ambient soundtrack:** a continuous pad of two voicings, each with a slowly "breathing" low-pass filter (0.07 Hz LFO): a bright **Light** voicing (sine, A3–E5) and a deep **Shadow** voicing (triangle, A1–E3). On every soul swap (and level load) the pad crossfades to the controlled soul's voicing, realising the concept document's dynamic soundtrack. It starts on the first user gesture, can be toggled with 🎵 (`audioSettings.music`, saved per account), and stops on mute or Sign Out.
* All output is routed through a master gain node (🔊 mute stops everything); audio calls are guarded when Web Audio is unavailable.
* The login page has its own small UI-sound set (hover tick, click, typing ticks, tab whoosh, error buzz, success arpeggio) with a separate mute toggle.

### 3.6 Progression, Campaign Controller & SaveManager
* **Win Evaluation:** Each frame in `PLAYING`, the controller checks loot pickup (either soul within 30 px) and then whether both souls are inside the exit portal. The exit is sealed until the loot is taken, and the objective banner switches to the escape instruction.
* **Scoring:** Tracks elapsed level time against the level's `parTime` and the number of rewinds used; star rating = ★ completed, ★★ within target, ★★★ within target with zero rewinds.
* **Progression:** On a win, the result is saved (best time, best stars), the next mission is unlocked, and the next level becomes available via **Next Level ➔** / `Enter`. Winning the final level moves to `CAMPAIGN_COMPLETE` and shows the campaign summary (heist total, campaign stars) with **Play Again ⟲** restarting at Mission 1.
* **Level Select:** Mission cards are generated from level data (lock state, stars, best time, target time); the game pauses while the modal is open.
* **SaveManager:** Reads/writes the save JSON in `localStorage` under the signed-in account's key `LIGHT_SHADOW_SAVEDATA::<lowercase username>` (obtained from `LightShadowAuth.saveKeyFor()`); the shared key `LIGHT_SHADOW_SAVEDATA` is used only when no auth module/session exists (e.g. the headless tests). Schema in DDD §4. Corrupt or blocked storage falls back to a fresh profile. `lastLevelIndex` is set on every fresh level load, and after a win to the next mission (0 after the final win).
* **Snapshot lifecycle ("continue where you left off"):**
  1. **Capture:** `captureSnapshot()` records the level index, timer, rewinds, active soul, both souls' positions, mirror angles, crate positions, gate open flags, guard position/direction/angle/stun timer, light-source angle/phase, and loot state.
  2. **Write:** every 2 s while `PLAYING`, on pause, when the tab is hidden (which also pauses), on `pagehide`, and on Sign Out (`inProgress` in the save).
  3. **Clear:** set to `null` on a win, on a fail (a failed attempt restarts fresh), and whenever a level is freshly loaded or restarted.
  4. **Restore:** on page load `resumeProgress()` restores the snapshot only if the level is unlocked and its mirror/crate/gate/guard/light-source counts still match the level data; the game then opens in `PAUSED` with a *WELCOME BACK, NAME!* overlay. Otherwise it loads `lastLevelIndex` (if unlocked) or the first unfinished mission and shows a welcome toast.

### 3.8 Auth Module & Login Page
* **`auth.js`** exposes `window.LightShadowAuth`: `register`, `login`, `logout`, `currentUser`, `listAccounts`, `removeAccount` (password required; also deletes that account's save), `saveKeyFor`, `progressSummary`, `validate`.
* **Accounts** are stored in `localStorage` (`LIGHT_SHADOW_ACCOUNTS`); usernames are 3–16 `[A-Za-z0-9_]` characters, unique case-insensitively; passwords ≥ 4 characters. Each password is hashed with a random 16-byte salt and SHA-256 iterated 2000 times (dependency-free synchronous SHA-256, verified against Node's `crypto`).
* **Session:** `LIGHT_SHADOW_SESSION = {"username"}` is written to `sessionStorage` (this tab) and, when *Stay signed in* is ticked, also to `localStorage`. `currentUser()` checks `sessionStorage` first, then `localStorage`, and only returns users that still exist.
* **Security boundary:** browser-only convenience login for a static site; anyone with access to browser storage can delete or reset accounts (see Requirements NFR-5).
* **`login.js`** drives the login page: tab switching, validation messages, the *Players on this device* picker (using `progressSummary`), the *Continue Heist / Switch Account* panel, the animated canvas background, and UI sounds.

### 3.9 Page Flow
1. **`index.html` (login):** if a session exists, show *Signed in as NAME* (Continue Heist ➔ / Switch Account); otherwise show Sign In (or Create Account on a first visit with no accounts).
2. On successful sign-in / account creation the card animates out, the page fades, and the browser navigates to **`game.html`**.
3. **`game.html`** loads `auth.js` in the `<head>` before anything else; if `currentUser()` is `null` it calls `location.replace('index.html')` (so the back button does not return to the guarded page).
4. The engine loads the account's save and runs the resume logic (§3.6). **Sign Out** saves the snapshot, logs out and fades back to `index.html`.

### 3.10 Mobile Controls Module (`mobile.js`)
* **Loading:** `game.html` loads `mobile.js` before `game.js`. The script defines `window.MobileControls`; the engine constructor creates `this.mobile = new MobileControls(this)` only if the class exists, so the engine still runs without it (keyboard only, e.g. the headless tests). `window.MobileControlsUtil` (`mapTilt`, `tiltVector`, `screenAngle`, `TILT_FULL_DEG`, `JOY_RADIUS`) exposes the pure helpers for unit tests.
* **Per-frame hook:** the game loop calls `mobile.update(dt)` every frame. It writes the analog vector into `engine.analogInput`, mirrors the tilt on the resting joystick knob, highlights ROTATE when `engine.nearestMirrorInReach()` is true, and updates the SWAP icon/colour for the active soul.
* **Input pipeline and priority:**
  1. **Keyboard** → `engine.keys` (digital, full speed). If any movement key is held, analog input is ignored.
  2. **Touch joystick** → `engine.analogInput` while the thumb is down (Pointer Events with pointer capture; 52 px radius = 1.0).
  3. **Tilt** → `engine.analogInput` when tilt is on and the joystick is idle.
  
  `handleMovement()` ignores analog vectors shorter than 0.12 (dead zone), normalises the direction and scales the speed by the deflection (`throttle = min(1, |v|)`), so a half push walks at half speed. SWAP / ROTATE / UNDO call `swapCharacter()`, `interact()` and `rewindStep()` on `pointerdown`, only in `PLAYING` with no modal open.
* **Tilt pipeline:** `deviceorientation` (β, γ) → `mapTilt()` to screen axes using the screen-orientation angle (0 / 90 / 180 / 270) → subtract the calibrated neutral pose (first reading after enabling, after `orientationchange`, or **Calibrate**) → `tiltVector()`: 2.5° dead zone, full speed at 28° / 18° / 11° (Low / Medium / High), diagonal length capped at 1 → exponential low-pass per frame (`k = min(1, dt·12)`). iOS needs `DeviceOrientationEvent.requestPermission()` from a user gesture: the Settings toggle tap, or, for a saved "tilt on", the first tap on the page (*📱 TAP TO ENABLE TILT*). Android starts listening at once. Status messages cover no sensor, denied permission and no readings within 1.5 s (HTTPS required).
* **Responsive canvas scaling:** the canvas keeps its 900×650 backing resolution (all game maths stay in virtual pixels). `fitCanvas()` sets the `#canvas-wrapper` size to `900·s × 650·s` with `s = min(availW/900, availH/650, cap)` (cap 1.4 on desktop, 3 in touch mode), driven by a `ResizeObserver` on `#canvas-container` plus `resize` / `orientationchange`. CSS media queries handle the header, sidebar, overlays and the portrait/landscape touch layouts (UI/UX §4).
* **Touch-mode switch:** `body.touch-ui` is set when Settings → touch controls is *On*, or *Auto* and a touch screen is detected (`(pointer: coarse)`, `ontouchstart`, `maxTouchPoints`, or the first `pointerType === 'touch'`). `body.left-handed` mirrors the control layout.
* **Settings modal:** opened by ⚙️ (clears held keys); segmented controls and switches write `engine.saveData.settings` and call `engine.saveSettings()` (same `localStorage` save slot, DDD §4) and re-apply the layout. Calibrate, sensitivity and vibration test buzzes act immediately.
* **Full screen:** ⛶ calls the (webkit-prefixed if needed) Fullscreen API and, with tilt on, `screen.orientation.lock(current type)` so tilting cannot rotate the screen (Android; ignored where unsupported). The button is hidden where the API is missing.
* **Haptics:** `engine.haptic(pattern)` calls `navigator.vibrate` when available and enabled: swap 15 ms, mirror turn 10 ms, first frame on forbidden terrain 25 ms, loot 40 ms, win `[30, 40, 60]`, fail `[80, 40, 120]`. iOS Safari has no Vibration API, so it is silently skipped.
* **Design decision:** the joystick is the primary mobile control and tilt is optional, because steering along narrow beams within a 0.5 s grace window needs precision that tilt (posture drift, per-session iOS permission, accidental auto-rotation) cannot guarantee.

### 3.7 Game State Machine
| State | Entered When | Exits To |
| :--- | :--- | :--- |
| `PLAYING` | Level loaded / restarted, or Continue from `PAUSED` | `PAUSED`, `WIN`, `FAIL`, `CAMPAIGN_COMPLETE` |
| `PAUSED` | `P` / `Esc` / ⏸️, browser tab hidden, or a resumed snapshot on page load (*WELCOME BACK*) | `PLAYING` (Continue / `P` / `Esc` / `Enter`; or Restart Level / Levels, which load a fresh attempt) |
| `WIN` | Loot taken and both souls in the exit (levels 1–3) | `PLAYING` (Next Level / Replay Level / Levels) |
| `FAIL` | Grace meter empty or spotted by a guard | `PLAYING` (Try Again / Levels) |
| `CAMPAIGN_COMPLETE` | Final level (4) won | `PLAYING` (Play Again from Mission 1 / Replay Level / Levels) |

---

## 4. Software Design Patterns Employed

1. **Game Loop Pattern:** Frame-decoupled update/render loop driven by `requestAnimationFrame`.
2. **State Pattern:** Encapsulates character states (`LIGHT`, `SHADOW`), guard states (`PATROL`, `STUNNED`), and game state (`PLAYING`, `PAUSED`, `WIN`, `FAIL`, `CAMPAIGN_COMPLETE`).
3. **Command Pattern:** Encapsulates player interactions (`rotateMirror`, `pushCrate`, `rewindStep`) for state undo support.
4. **Observer Pattern:** Dispatches UI updates whenever loot state, grace meter, timer, objective, or active character changes.
5. **Memento Pattern:** The mid-level snapshot (`captureSnapshot` / `restoreSnapshot`) stores the engine's dynamic state as plain JSON, independent of the static level data, so a mission can be restored exactly on the next visit.
6. **Facade / Module Pattern:** `auth.js` hides account storage, hashing and sessions behind one global API (`window.LightShadowAuth`) used by both pages.
7. **Adapter Pattern:** `MobileControls` adapts joystick and tilt sensor input into the same analog vector (`engine.analogInput`) and the same action methods the keyboard uses, so the movement and game logic have a single input path.

---

## 5. Deployment Architecture

* **Static site, no backend:** the deployable unit is `index.html`, `game.html`, `*.js` (including `mobile.js`) and `*.css`. There is no build step, server, database or environment variable; all persistence is in the player's browser (`localStorage` / `sessionStorage`).
* **Hosting:** Vercel (import the GitHub repository `Meoclavez/Light-Shadow`, Framework Preset *Other*, no build command, output directory = repository root; or `npx vercel` / `npx vercel --prod`). Served over HTTPS, which tilt steering requires (DeviceOrientation is only delivered to secure contexts on current mobile browsers); the same files run on `localhost` or from disk.
* **`vercel.json`:** `cleanUrls: true` (`/` → login page, `/game` → `game.html`) and security headers on every route: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`.
* **`.vercelignore`:** excludes `.agents`, `tests`, `Supporting_Files`, `*.md`, `*.docx`, `*.pdf`, `*.jpg`, `*.jpeg`.
* **Consequence:** accounts and progress are per browser (not synchronised between devices), which is an accepted trade-off for zero-cost static hosting.
