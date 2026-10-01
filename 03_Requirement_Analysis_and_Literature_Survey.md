# 03. Requirement Analysis & Literature Survey

**Project Title:** LIGHT & SHADOW (Two Souls. One Heist.)  
**Repository Directory:** `/home/meoclavezz/Projects/P-Game`  
**Phase:** Phase 2 – Requirement Analysis & Feasibility Review  
**Last Updated:** October 1, 2026 (added FR-5 player accounts & session continuity, pause, audio-visual feedback, static hosting; FR-6 mobile, touch & tilt play)  

---

## 1. Functional Requirements

The core functional capabilities of **LIGHT & SHADOW** are categorized into six major subsystems:

### 1.1 Character & Navigation Subsystem (FR-1)
* **FR-1.1 (Dual Control):** System shall allow switching active control between **Light** and **Shadow** using keyboard (`Tab`/`Space`), UI buttons, or the touch **SWAP** button (FR-6.2).
* **FR-1.2 (Light Traversal Constraint):** **Light** character can only move within active illuminated polygons. Entering shadowed terrain triggers a 0.5s grace period before failing.
* **FR-1.3 (Shadow Traversal Constraint):** **Shadow** character can only move within unlit/shadowed polygons. Touching active light beams triggers a 0.5s grace period before failing.
* **FR-1.4 (Grace Period & Rewind):** When an invalid terrain condition occurs, player receives visual feedback (flashing aura and a `GRACE` percentage pill) and can trigger an instant Rewind (`Z` key) to revert to the previous movement checkpoint. Checkpoints are taken every ~50 px of movement, on every soul swap, and on every mirror turn; repeated presses step further back.
  * Each soul has its **own** 0.5s grace meter. It drains only while that soul is controlled and standing on forbidden terrain, and refills only when that soul is back on valid terrain, so swapping souls does not reset it.

### 1.2 Dynamic Optics & Physics Engine (FR-2)
* **FR-2.1 (Dynamic Light Sources):** System shall support static lamps, rotating spotlights, and swinging pendulums emitting continuous 2D light cones.
* **FR-2.2 (Mirror Reflection):** Players can interact with mounted mirrors to reflect light beams at arbitrary angles, re-routing Light's path and casting new shadow walls.
* **FR-2.3 (Prism Spectrum Splitting):** Aligning a white light beam into a triangular prism refracts the light into primary Red, Green, and Blue rays.
* **FR-2.4 (Color-Coded Gates):** Red, Green, and Blue light rays activate corresponding color-coded optical receptors to unlock doors. Each gate has a separate receptor placed outside the closed door; a gate opens when a band of its required colour covers the receptor and then stays open (latched) until the level restarts.
* **FR-2.5 (Dynamic Shadow Casting):** Solid props (movable crates, pillars) cast realistic shadows when hit by light beams, creating "shadow bridges" for Shadow.

### 1.3 Guard AI & Stealth Subsystem (FR-3)
* **FR-3.1 (Lumen Guards - Daywatch):** Patrol lit areas with vision cones. Detect Light instantly if in line of sight; cannot see Shadow hidden in dark zones. Guard vision (both guard types) requires a clear line of sight: walls, closed gates, and crates block it.
* **FR-3.2 (Nyx Guards - Nightwatch):** Patrol dark rooms with night-vision cones. Spot Shadow in darkness. If touched by any light (direct, reflected, or a spectrum band), Nyx Guards become stunned for 3 seconds, refreshed while they remain lit.
* **FR-3.3 (Flashlight Guards):** Patrol with sweeping flashlights. Flashlight beam provides a moving path for Light, but acts as a moving hazard for Shadow.

### 1.4 Level Progression & Win/Loss Conditions (FR-4)
* **FR-4.1 (Loot Collection):** Players must steal the target artifact (diamond/gold key) in each level. Either soul can grab the loot by moving within 30 px of it.
* **FR-4.2 (Coordinated Exit):** Both characters must reach the exit portal (radius 45 px) after securing loot to complete the level.
* **FR-4.3 (Level Select & Restart):** Players can restart the level at any time or navigate between unlocked levels. Only Mission 1 is unlocked on a fresh profile; clearing a mission unlocks the next. Locked missions are shown with a 🔒 icon in the Level Select modal and cannot be started.
* **FR-4.4 (Sealed Exit & Twilight Portal):** The exit portal is sealed (grey, dashed, `🔒 EXIT`) until the loot is taken, then opens (green). The portal is *twilight*: neutral ground where neither soul's terrain rule applies. The mission banner switches to an escape instruction once the loot is secured.
* **FR-4.5 (Target Time & Star Rating):** Each level has a target (par) time (L1 25s, L2 45s, L3 45s, L4 60s), shown in the HUD as `elapsed / target`. Completing a level awards ★; finishing within the target time awards ★★; finishing within the target time with zero rewinds awards ★★★ (campaign maximum 12 stars).
* **FR-4.6 (Campaign Completion Screen):** Winning the final level ends the campaign with a **HEIST COMPLETE!** screen showing the level stats, the heist total (sum of best times), and campaign stars (X / 12), with options to play again from Mission 1, replay the level, or open Level Select.
* **FR-4.7 (Local Progress Persistence):** Unlocked levels, best times, star ratings, the audio settings (mute, volume) and the control settings (FR-6.4) are saved to browser `localStorage` (one save slot per signed-in account, see FR-5.2) and restored on page load; the game resumes where the player left off (FR-5.3), otherwise at the last mission played or the first unlocked-but-unfinished mission. Corrupt or unavailable storage falls back to a fresh profile, and players can reset progress from Level Select.

### 1.5 Player Accounts & Session Continuity (FR-5)
* **FR-5.1 (Local Accounts with Salted Hashed Passwords):** The entry page (`index.html`) shall be a login screen offering **Sign In** and **Create Account**. Usernames are 3–16 characters (`A–Z`, `a–z`, `0–9`, `_`) and unique case-insensitively; passwords are at least 4 characters and must be confirmed when creating an account. Passwords shall never be stored in plain text: each account stores a random 16-byte salt and a SHA-256 hash iterated 2000 times. The game page (`game.html`) shall be reachable only with an active session; otherwise it redirects to the login page.
* **FR-5.2 (Multiple Accounts per Device with Isolated Progress):** Several accounts can exist in the same browser. Each account has its own save slot (`LIGHT_SHADOW_SAVEDATA::<lowercase username>`), so one player's unlocks, stars, best times and snapshot never affect another's. The login screen lists the **Players on this device** (missions cleared, stars, mission in progress); selecting one prefills the username, and an account (with its progress) can be removed only after entering its password.
* **FR-5.3 (Continue Where You Left Off):** While a mission is being played, the system shall save a mid-level snapshot (every 2 s, on pause, when the tab is hidden, on page close, and on sign out). On the next visit the exact situation (soul positions, active soul, timer, rewinds, mirror angles, crates, opened gates, guards, light-source phase, loot) is restored and the game opens **paused** on a *WELCOME BACK* overlay. A win or a fail clears the snapshot (a failed attempt restarts the mission fresh). Without a snapshot, the last mission played opens, with a welcome toast.
* **FR-5.4 (Sign Out / Switch Account):** The game header shows the signed-in player and a **Sign Out** button that saves the snapshot, ends the session and returns to the login page. A *Stay signed in on this device* option (default on) remembers the session across browser restarts; otherwise it lasts only for the current tab. When a session exists, the login screen offers **Continue Heist** or **Switch Account**.

### 1.6 Mobile & Touch Play (FR-6)
* **FR-6.1 (Responsive Layout):** The game page shall fit any window from phone to desktop without horizontal or vertical page overflow. The canvas keeps its 900×650 internal resolution and is scaled uniformly to the largest size that fits its panel (at most 1.4× on desktop), re-fitted on resize and orientation change. The header compacts below 1200 px (Levels / Sign Out become 🗺️ / 🚪 icons) and again below 900 px; the sidebar is hidden below 1100 px; below 900 px the result/pause overlays become fixed full-screen cards and Level Select uses one column. Phones in portrait show the playfield on top and the controls below; phones in landscape (height ≤ 600 px) use a single-row header and float the controls in the side gutters. Notch safe-area insets are respected.
* **FR-6.2 (Touch Joystick & Action Buttons):** On touch screens (detected automatically, or forced On/Off in Settings) the system shall show a floating analog joystick for the left thumb (the stick appears where the thumb lands; 52 px of travel = full speed; partial deflection walks proportionally slower; dead zone 0.12) and **SWAP**, **ROTATE** (highlighted when a mirror is in reach) and **UNDO** buttons for the right thumb, acting on touch-down. A **Left-handed layout** option mirrors the two sides. A ⛶ full-screen button is offered in touch mode where supported. Keyboard input overrides analog input.
* **FR-6.3 (Optional Tilt Steering):** Players may enable **Tilt to move** (DeviceOrientation). Tilt shall be mapped to the screen's axes for every screen orientation (0°/90°/180°/270°), relative to a calibrated neutral pose (auto-calibrated on the first reading and after an orientation change, or via **Calibrate**), with a 2.5° dead zone, three sensitivities (full speed at 28° / 18° / 11°), diagonal speed capped at full speed, and per-frame smoothing. Touching the joystick overrides tilt. On iOS the motion permission is requested from a tap; missing sensors, denied permission and absent readings are reported in Settings.
* **FR-6.4 (Settings Persisted per Account):** A ⚙️ **Settings** modal (all devices) shall offer touch controls Auto/On/Off, Tilt to move, Tilt sensitivity, Calibrate tilt, Left-handed layout and Vibration, plus short phone-play help. The game freezes while it is open and `Esc` closes it. The choices are stored in the signed-in account's save data (`settings`, see DDD §4).
* **FR-6.5 (Haptic Feedback):** Where the Vibration API is available (Android), the system shall vibrate briefly on soul swap, mirror turn, the first moment on forbidden terrain, loot pickup, win and fail; vibration can be switched off in Settings.
* **Design decision — joystick primary, tilt optional:** the puzzles require precise steering along narrow light beams with only a 0.5 s grace window. Tilt is less precise, drifts with the player's holding posture, needs a fresh permission per session on iOS, and can trigger the phone's auto-rotation. The touch joystick is therefore the default mobile control, and tilt is an opt-in alternative with calibration, sensitivity and joystick override.

---

## 2. Non-Functional Requirements

### 2.1 Performance & Responsiveness (NFR-1)
* Real-time 2D raycasting and visibility polygon calculation must complete in under **1.0 millisecond per frame**, ensuring a smooth **60+ FPS** rendering speed on standard PC and web browsers.

### 2.2 Usability & Accessibility (NFR-2)
* Intuitive grid/analog movement controls (`WASD` / Arrow keys, or the analog touch joystick / tilt on phones and tablets).
* **No keyboard required:** every gameplay action is reachable by touch (joystick, SWAP, ROTATE, UNDO, header buttons, overlay buttons), so the game is fully playable on phones and tablets (FR-6).
* **Comfort & handedness:** thumb-sized touch targets (SWAP 104 px, ROTATE/UNDO 64 px in portrait), a left-handed layout, adjustable tilt sensitivity, optional vibration, and disabled pull-to-refresh, text selection and long-press menus during play.
* High-contrast visual feedback distinguishing Light paths (glowing golden hue) from Shadow zones (deep obsidian velvet tone).
* Colorblind accessibility using distinct icon patterns on Red, Green, and Blue color-coded gates.
* **Pause & Resume:** The player can pause at any time with `P`, `Esc` or the ⏸️ button (Continue / Restart Level / Levels); the game also pauses automatically when the browser tab is hidden. `Esc` closes the Level Select modal first if it is open.
* **Audio-Visual Feedback:** Every important event has sound and motion feedback, synthesised with the Web Audio API (no audio files): procedural sound effects for Light/Shadow footsteps, swapping, mirror clicks, prism chimes, loot, guard stun/alarm and victory (with a 🔊 mute toggle saved per account), mission-start and pause cues, UI sounds on the login screen, a mission intro title card, toasts, page fade transitions, a swirling exit portal, a pulsing ring on the controlled soul and a victory particle burst. CSS animations respect `prefers-reduced-motion` (the touch UI adds no large motion: only a glow pulse on ROTATE when a mirror is in reach), and both the login page and the game page work down to phone width.

### 2.3 Maintainability & Modular Architecture (NFR-3)
* Modular C#/JS architecture separating Physics Engine, NavMesh Generator, Entity Controller, and UI Manager.
* Clean JSON data structures for level layout loading and custom level creation.
* Account handling (`auth.js`) and the login page (`login.js`, `login.css`) are kept separate from the game engine (`game.js`); the engine only asks the auth module for the current user and that user's save key.
* Mobile input, responsive scaling and the Settings modal live in a separate optional module (`mobile.js`, `MobileControls`). It feeds the engine one analog vector (`analogInput`) and calls existing engine actions, so `game.js` still runs (keyboard only) if the module is absent, e.g. in the headless tests.

### 2.4 Deployment & Static Hosting (NFR-4)
* The game shall run as a plain static site (HTML, CSS, JavaScript only) with no build step, server, database, or environment variables, so it can be hosted on **Vercel** (or any static host, `localhost`, or opened from disk).
* Vercel configuration (`vercel.json`) provides clean URLs (`/` = login, `/game` = game) and security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`); `.vercelignore` publishes only the game files (no docs, tests or diagrams).

### 2.5 Security & Privacy of Local Accounts (NFR-5)
* Passwords are stored only as salted, iterated SHA-256 hashes, never in plain text.
* **Known limitation (accepted design trade-off):** because there is no server, accounts and progress exist only in the browser where they were created and are not synchronised between devices. The login is a *convenience* feature, not real security: anyone with access to the browser's storage can delete or reset accounts. Players are told not to reuse a real password.

---

## 3. Literature Survey & Related Work

### 3.1 Review of Existing Works

| System / Game | Key Features | Limitations & Research Gaps | How LIGHT & SHADOW Improves Upon It |
| :--- | :--- | :--- | :--- |
| **Robbery Bob** | Top-down stealth, guard vision cones, guard distraction, loot stealing. | Light is purely visual; stealth is binary (hiding in corners); terrain is static regardless of lighting. | Light and shadow form literal physical terrain walls and paths that are dynamically sculptable. |
| **Monaco: What's Yours is Mine** | Asymmetric top-down co-op heist, class-based sightlines. | Sightlines are line-of-sight fog-of-war, not physical movement constraints for different characters. | Introduces mutually exclusive traversal constraints based on light vs shadow state. |
| **Portal** | Vector redirection via portals, beam optics, puzzle mechanics. | Puzzles involve spatial portals; does not feature stealth AI or dual shadow/light walking rules. | Integrates optical refraction (mirrors/prisms) directly with asymmetric stealth traversal and AI interactions. |
| **Shadowmatic** | 3D silhouette shadow manipulation puzzles. | Purely aesthetic matching puzzle; no character traversal, AI, or heist objectives. | Combines dynamic shadow casting with full character movement and stealth guard evasion. |

### 3.2 Identified Research & Design Gap
Existing puzzle-stealth games treat light as an auxiliary attribute (adjusting visibility percentages). No commercial title has implemented **inverse physical terrain bounds** where an illuminated area is simultaneously a floor for Player A and a physical wall for Player B, dynamically modified in real-time by mirrors and prisms.

### 3.3 Contribution of LIGHT & SHADOW
**LIGHT & SHADOW** fills this gap by introducing a real-time 2D visibility polygon engine that dynamically updates walking meshes for both characters on every light manipulation, creating a novel genre blend of optical physics, stealth, and cooperative puzzle-solving.
