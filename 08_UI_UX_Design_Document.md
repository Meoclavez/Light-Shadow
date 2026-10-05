# 08. UI/UX Design Document

**Project Title:** LIGHT & SHADOW (Two Souls. One Heist.)  
**Repository Directory:** `/home/meoclavezz/Projects/P-Game`  
**Phase:** Phase 3 – Design & Planning  
**Date:** August 2026  
**Last Updated:** October 1, 2026 (end-of-level, progression & campaign UI; login screen, accounts, pause & welcome-back overlays, audio feedback and animations; responsive playfield, touch & tilt controls, Settings modal)  

---

## 1. Design Philosophy & Aesthetics

**LIGHT & SHADOW** utilizes a high-contrast **Glassmorphism Dark Noir** visual design. The design communicates the dual spectral nature of the characters through strong color coding, vibrant neon accents, translucent frosted glass overlays, and dynamic glow lighting.

### Color Palette Tokens
- **Background Base (`--bg-dark`):** `#0b0d14` (Deep Space Obsidian)
- **Glass Panel Surface (`--panel-bg`):** `rgba(18, 22, 34, 0.75)` with `backdrop-filter: blur(16px)`
- **Lightwalker Theme (`--light-color`):** `#ffb830` (Radiant Amber Gold) with glowing aura `#ffb83059`
- **Shadowweaver Theme (`--shadow-color`):** `#9d4edd` (Deep Spectral Violet) with glowing aura `#9d4edd59`
- **Optics & Receptors:**
  - Red Spectrum: `#ff0055`
  - Green Spectrum: `#38b000`
  - Blue Spectrum: `#3a86ff`
  - Cyan Accent: `#00f5d4`

---

## 2. User Interface Layout Architecture

The game is split into two pages: the **login page** (`index.html`, the entry point) and the **game page** (`game.html`). On desktop the game page consists of four distinct layout regions (navbar, objective banner, sidebar, and canvas viewport); on touch screens the sidebar is replaced by a touch-controls region (§2.2):

```
+-------------------------------------------------------------------------+
| TOP NAVBAR: Brand Logo | Level Title | Loot | Timer | Grace |           |
| 👤 Player | ⏸️ | ⚙️ | (⛶ touch) | 🔊 | ↩️ | 🔄 | Levels | Sign Out        |
+-------------------------------------------------------------------------+
| OBJECTIVE BANNER: level objective -> "Loot secured! ..." escape prompt  |
+-------------------------------------------------------------------------+
| SIDEBAR (Left)             | MAIN VIEWPORT (Center Canvas)              |
| - Character HUD Cards      |                                            |
|   * Lightwalker (Gold)     |  +--------------------------------------+   |
|   * Shadowweaver (Purple)  |  |                                      |   |
| - Soul Swap Action Button  |  |       900 x 650 Canvas Playfield     |   |
| - Controls Cheatsheet      |  |                                      |   |
|                            |  +--------------------------------------+   |
|                            |  [ Intro title card / Toast (on canvas) ]  |
|                            |  [ Pause / Welcome Back / Victory /        |
|                            |    Defeat / Campaign Overlay ]             |
+-------------------------------------------------------------------------+
```

### 2.1 Login Page Layout
A full-screen animated canvas background sits behind a single centred glassmorphic card (see `Supporting_Files/Wireframes.md`):

```
+-------------------------------------------------------------------------+
| (animated background: golden spotlight, dust motes, soul orbs)    [🔊]  |
|                 +-------------------------------------+                 |
|                 |   ✨  LIGHT & SHADOW                 |                 |
|                 |   TWO SOULS. ONE HEIST.             |                 |
|                 |  [ Sign In | Create Account ]       |                 |
|                 |  Username / Password (/ Confirm)    |                 |
|                 |  [x] Stay signed in on this device  |                 |
|                 |  <error line>                       |                 |
|                 |  [ Enter the Heist ➔ ]              |                 |
|                 |  PLAYERS ON THIS DEVICE (chips)     |                 |
|                 |  note: saved only in this browser   |                 |
|                 +-------------------------------------+                 |
+-------------------------------------------------------------------------+
```

### 2.2 Touch Layouts (Phones & Tablets)
When touch mode is on (`body.touch-ui`), the page fills the dynamic viewport (`100dvh`) with safe-area padding for notches, the sidebar is hidden and a **touch-controls** region is added (see `Supporting_Files/Wireframes.md`):

| Layout | Header | Playfield | Controls |
| :--- | :--- | :--- | :--- |
| **Portrait** | At most 2 rows, centred; player badge hidden at ≤ 480 px wide (the name still appears on the welcome/pause cards) | Full width on top; its panel is only as tall as the 900:650 canvas needs | Fill the bottom (150–280 px tall): joystick zone left (max 260 px wide, *DRAG TO MOVE*), UNDO / ROTATE column and big SWAP right |
| **Landscape phone** (height ≤ 600 px) | One compact row (brand text and *MISSION* label hidden, 30 px buttons); objective on one line with ellipsis | Takes the full remaining height, centred | Float over the side gutters: invisible joystick zone (34 % width, 72 % height) on the left, semi-transparent buttons bottom-right |
| **Left-handed** (either orientation) | — | — | Sides swapped: joystick right, buttons left |

### 2.3 Responsive Breakpoints
| Breakpoint | Change |
| :--- | :--- |
| All sizes | Canvas keeps its 900×650 resolution and is scaled to the largest size that fits its panel (max 1.4× on desktop) |
| ≤ 1200 px wide | Header wraps tidily; subtitle hidden; **Levels / Sign Out** become 40 px 🗺️ / 🚪 icon buttons (fixes the old header overflow at ~1024 px) |
| ≤ 1100 px wide | Sidebar hidden; the canvas takes the full width |
| ≤ 900 px wide | Compact header (34 px buttons, player avatar hidden), smaller banner; result/pause overlays become fixed full-screen cards (max 92 vw × 92 dvh, scrollable) so the small canvas never clips them; Level Select uses one column |
| ≤ 520 px wide | Settings rows wrap (control under its label) |
| Portrait (touch) | Portrait touch layout (§2.2); at ≤ 480 px wide the player badge is hidden |
| Landscape, ≤ 600 px high (touch) | Landscape phone layout (§2.2) |

---

## 3. Key Interaction Flows & UX Mechanics

### 3.1 Character Swapping Flow (`Tab` / `Space`)
1. Player presses `Tab`, `Space`, clicks the **Swap Character** button, or taps the touch **SWAP** button.
2. Active focus toggles between Lightwalker and Shadowweaver.
3. Left sidebar character card highlights with a glowing border transition (Golden glow for Light, Violet glow for Shadow).
4. Audio synthesizer plays a rising pitch swap tone.
5. Canvas rendering applies high-intensity aura glow to the currently controlled character.

### 3.2 Mirror & Optics Interaction (`E` Key)
1. Player moves active character within 50px of a rotatable mirror.
2. Interactive indicator `[E] Rotate Mirror` lights up on screen.
3. Pressing `E` (or tapping the touch **ROTATE** button, which glows while a mirror is in reach) rotates mirror angle by $22.5^\circ$ ($\pi/8$ rad).
4. Raycaster updates reflected light beam in real-time.
5. Sound engine triggers a crisp mechanical click.

### 3.3 Grace Period & Anti-Frustration Warning
1. If Lightwalker steps into shadow or Shadowweaver touches a light beam, a warning pill `⚠️ GRACE: 100% -> 0%` appears in the navbar.
2. The player's aura flashes rapidly in bright red.
3. Player has 0.5 seconds to step back or press `Z` to undo movement before game over is triggered.
4. Each soul has its own grace meter; the pill shows the meter of the currently controlled soul, so swapping does not refill it.

### 3.4 HUD Timer Pill & Dynamic Objective Banner
1. The navbar shows a timer pill `⏱️ elapsed / target` (e.g. `0:12.4 / 0:25.0`) next to the loot pill.
2. The pill turns **amber** once the elapsed time exceeds the level's target time (the ★★ / ★★★ threshold).
3. The objective banner first shows the level objective; once the loot is taken it switches to: *"Loot secured! The exit portal is open: bring BOTH Lightwalker and Shadowweaver into it to escape."*

### 3.5 Exit Portal & Colour Receptors (Canvas)
* **Sealed exit:** Before the loot is taken the exit portal is drawn grey with a dashed outline and the label `🔒 EXIT`.
* **Open exit:** After the loot is taken the portal turns green and is labelled `EXIT`. It is twilight ground, safe for both souls.
* **Receptors:** Each colour gate has a small round receptor in its colour. It is drawn dark with a coloured outline while inactive and fills with a glowing colour once lit; the gate then opens and stays open.
* **Guard vision cones** are raycast, so they visibly stop at walls.

### 3.6 Result Overlays
| Overlay | Title | Stats Shown | Buttons |
| :--- | :--- | :--- | :--- |
| **Level Complete** (`WIN`) | `MISSION ACCOMPLISHED!` | Time (with "new best!"), Target ✔/✘, Best, Rewinds, Rating (★☆☆–★★★) | **Next Level ➔** (also `Enter`), Replay Level, Levels |
| **Fail** (`FAIL`) | e.g. `CAUGHT IN INVALID TERRAIN`, `SPOTTED BY LUMEN GUARD!`, `SPOTTED BY NYX GUARD!` | — | Try Again, Levels |
| **Campaign Complete** (`CAMPAIGN_COMPLETE`) | `HEIST COMPLETE!` | Level stats + Heist total (best), Campaign stars X / 18 | **Play Again ⟲** (restarts at Mission 1), Replay Level, Levels |
| **Custom Heist Win** (`WIN`, Level -1) | `CUSTOM HEIST CLEARED!` | Time, Target, Rewinds, Rating | **Workshop 🛠️**, Replay Level, Levels |
| **Paused** (`PAUSED`) | `PAUSED` | *"The heist is on hold. Press Continue, P or Esc to get back in."* | **Continue ➔** (also `P` / `Esc` / `Enter`), Restart Level, Levels |
| **Welcome Back** (`PAUSED`, resumed snapshot) | `WELCOME BACK, NAME!` | *"Mission N is exactly where you left it (m:ss.s on the clock)…"* | **Continue ➔** (also `P` / `Enter`), Restart Level, Levels |

All overlay cards pop in with a short scale/fade animation.

### 3.7 Level Select Modal
1. Mission cards are generated from level data: number, title, description, star rating (☆☆☆–★★★), and best time + target time across all 6 missions.
2. Locked missions are dimmed with `🔒 Locked — clear the previous mission` and cannot be clicked.
3. The footer shows the campaign star total (`★ X / 18`), a hint on how to earn ★★★, and a **Reset Progress** button (with a confirmation dialog).
4. The game pauses while the modal is open; `Esc` or the `×` button closes it (`Esc` only toggles pause when the modal is closed).

### 3.8 Login & Account Flow
| Screen State | When | What the Player Sees |
| :--- | :--- | :--- |
| **First visit** | No accounts in this browser | Opens on **Create Account** (violet tab): Username, Password, Confirm password, *Stay signed in*, **Create Account & Play ➔**, plus **⚡ Quick Play as Guest** button |
| **Sign In** | Accounts exist, no session | **Sign In** (gold tab): Username, Password, *Stay signed in*, **Enter the Heist ➔**, plus **⚡ Quick Play as Guest** and the **Players on this device** list |
| **Guest Play** | Click "⚡ Quick Play as Guest" | Instant frictionless authorization as `Guest`, generates ephemeral session, and navigates immediately into gameplay without credentials |
| **Continue as** | A session exists (this tab or remembered) | *"Signed in as NAME"* with **Continue Heist ➔** and **Switch Account** (logs out and shows Sign In) |
| **Error** | Validation fails, passwords don't match, name taken, wrong username/password | Red message under the form, the card shakes, two-tone error buzz; typing clears the message |
| **Success** | Sign-in / account creation / Continue | Success arpeggio, the card flashes with a gold/violet glow, then lifts, shrinks and blurs out, the page fades out, then `game.html` fades in |

### 3.14 Story Briefing & Dialogue Modal
* **Access Point:** Automatically shown on the first infiltration of any mission; accessible anytime via the **📜 Briefing** navbar button or `I` hotkey.
* **Layout:** Centred glass panel featuring two distinct speaker dialogue bubbles:
  - **Sol (Lightwalker):** Golden avatar with radiant aura, displaying tactical guidance on light coverage and optical setups.
  - **Umbra (Shadowweaver):** Deep violet avatar with spectral glow, providing commentary on unlit traversal and stealth infiltration.
  - **Security Blueprint Intel:** High-contrast tactical alert card summarizing target sectors, laser hazards, and guard vision cones.
* **Footer Action:** **Begin Infiltration ➔** primary action button cleanly resumes play.

### 3.15 Heist Trophies & Achievements Modal
* **Access Point:** Click the **🏆 Trophies** button on the navbar.
* **Header Summary:** Real-time counter (`🏆 X / 10 Unlocked`) accompanied by a sleek, neon-cyan progress bar displaying completion percentage.
* **Trophy Grid:** 10 responsive glass cards featuring custom badge icons, titles, unlocked/locked criteria, and formatted date of unlock.
* **Celebratory Toast:** Unlocking any achievement during gameplay triggers an animated HUD banner toast (`🏆 TROPHY UNLOCKED: ...!`) and procedural chime audio cue.

### 3.16 Custom Heist Workshop (Level Editor)
* **Access Point:** Click the **🛠️ Workshop** button on the navbar.
* **Toolbar Architecture:**
  - **Entities Palette:** 16 tools including Wall, Spotlight, Omni-Lamp, Mirror, Prism, Pressure Plate, Security Gate, Pushable Crate, Lumen Guard, Nyx Guard, Bonus Diamond, Sol Spawn, Umbra Spawn, Loot, Exit Portal, and Erase.
  - **Inspector Bar:** Mission Title and Par Time inputs, with Clear, Export JSON Code, Import JSON Code, and Playtest Heist action buttons.
* **Interactive Canvas:**
  - Snapped 20 px blueprint grid with dynamic element rendering.
  - Interactive drag-to-create previews for walls and security gates.
  - Contextual right-click eraser tool.
  - Live Playtesting: Immediate transition into gameplay mode with custom mission parameters and achievement award (`heist_architect`).

### 3.10 Game Header & Session Controls
* **Player badge** (`👤 NAME`) shows who is signed in.
* **Top Buttons:** 📜 Briefing, 🏆 Achievements, 🛠️ Workshop, 💡 Levels, ⏸️ Pause, ⚙️ Settings, ⛶ Full screen (touch mode), 🔊 Sound, ↩️ Rewind, 🔄 Restart, and 🚪 Sign Out. Below 1200 px, icon badges compact gracefully.

### 3.11 Pause & Continue Where You Left Off
1. `P`, `Esc` or ⏸️ pauses: the pause blip plays and the **PAUSED** overlay appears; the same keys or **Continue ➔** resume.
2. Hiding the browser tab pauses automatically, so players never come back to a failed mission.
3. On sign-in, a saved mid-level snapshot reopens the exact situation **paused**, under **WELCOME BACK, NAME!**, so the player can re-orient before continuing.
4. Without a snapshot, a toast greets the player: *"Welcome back, NAME! Continuing from Mission N."* or, for a new account, *"Welcome, NAME! Your first heist awaits."*

### 3.12 Feedback Animations
* **Mission intro title card:** `MISSION 1` / `THE BASICS` zooms in over the canvas and fades out on every level load, with a mission-start arpeggio.
* **Toasts:** short notifications slide up at the bottom centre of the canvas and fade out after about 3.6 s.
* **Page transitions:** pages fade in on load and fade out before navigating between login and game.
* **Canvas:** the loot bobs and its glow pulses; the open exit portal shows swirling gold and violet rings; a pulsing ring marks the controlled soul; each win releases a 90-particle victory burst at the exit; trail and burst particles keep animating behind overlays.

### 3.13 Audio Feedback
* All sound is procedural Web Audio sound effects; there is no background music.
* 🔊 mutes all sound (saved per account).
* Event cues: Light/Shadow steps, swap, mirror click, prism chime, guard stun, win, fail, mission start, pause blip.

### 3.14 Touch Controls
| Control | Size (portrait / landscape) | Behaviour & States |
| :--- | :--- | :--- |
| **Joystick zone** | Region with dashed outline and *DRAG TO MOVE* hint (portrait); invisible in landscape | Touch anywhere: the 112 px base appears under the thumb (kept inside the zone) with a 50 px cyan knob. 52 px of travel = full speed; partial push = proportionally slower walk; tiny movements ignored. On release the base returns to its rest position |
| **📱 TILT label** | Under the stick | Shown while tilt is on; *📱 TAP TO ENABLE TILT* on iOS until the first tap re-grants motion access. The resting knob moves with the tilt so players see what the sensor reads |
| **SWAP** | 104 / 84 px round | Icon ☀️ with gold glow (Lightwalker) or 🌙 with violet glow (Shadowweaver) |
| **ROTATE** | 64 / 54 px round | Cyan border with pulsing glow (`ready`) while a mirror is within reach |
| **UNDO** | 64 / 54 px round | Rewinds a step (the header ↩️ is hidden in touch mode) |
| **All buttons** | — | Act on touch-down; shrink to 90 % while pressed (`pressed`); ignored outside `PLAYING` or while a modal is open; no long-press menu |

* **⛶ Full screen** appears in the header only in touch mode (hidden where the Fullscreen API is missing).
* **Haptics** (if enabled and supported): swap 15 ms, mirror 10 ms, first moment on forbidden terrain 25 ms, loot 40 ms, win 30-40-60, fail 80-40-120.
* Pull-to-refresh / overscroll, text selection and the long-press callout are disabled in touch mode, so a missed thumb never reloads or selects the page.

### 3.15 Settings Modal (⚙️)
A glass modal like Level Select (560 px wide, at most 90 vw on phones). It freezes the game while open; `Esc`, `×` or a tap on the backdrop close it.

| Group | Row | Control |
| :--- | :--- | :--- |
| Controls | On-screen touch controls | Segmented **Auto / On / Off** |
| | Tilt to move | Switch + status line (instructions, *Calibrated*, *no tilt sensor*, *Motion access was denied…*, *No tilt readings received… (HTTPS is required)*) |
| | Tilt sensitivity | Segmented **Low / Med / High** (dimmed while tilt is off) |
| | Calibrate tilt | **Calibrate** button: *"Hold the phone the way you like to play, then tap."* (dimmed while tilt is off) |
| | Left-handed layout | Switch |
| | Vibration | Switch (dimmed where the Vibration API is missing) |
| Playing on a phone | Help list | How to drag the joystick, what SWAP / ROTATE / UNDO do, ⏸️ and ⛶, *landscape gives the biggest view* |

* Active segmented options are highlighted; changes apply instantly and are saved per account.
* **Design decision:** the joystick is the default and tilt is opt-in. Steering along narrow light beams with a 0.5 s grace window needs precision; tilt drifts with posture, needs per-session permission on iOS and can rotate the screen, so it comes with calibration, three sensitivities and a joystick override.

---

## 4. Accessibility & Responsiveness

* **Colorblind Accessibility:** Color-coded gates feature unique geometric glyph icons ($\triangle$ for Red, $\square$ for Green, $\bigcirc$ for Blue) alongside color tints.
* **Font Choice:** Clean modern typography using Google Fonts (`Outfit` for headings/UI, `JetBrains Mono` for hotkeys and status counts).
* **Keyboard & Touch Controls:** Complete support for both desktop keyboard hotkeys and mobile/mouse clickable buttons. The game is fully playable without a keyboard (joystick, SWAP / ROTATE / UNDO, header and overlay buttons); a held key overrides the joystick and tilt.
* **Handedness & comfort:** left-handed layout, large thumb targets (64–104 px), adjustable tilt sensitivity with calibration, optional vibration. The sidebar controls list includes `Enter` (next level after a win) and `P` / `Esc` (pause / resume). Account chips on the login page are keyboard-focusable (`Enter` / `Space`).
* **Reduced Motion:** With `prefers-reduced-motion: reduce`, the login card, logo, title glow, sheen, field and chip animations are disabled, the login background stops moving, and page fades, intro card, toasts and overlay pop-ins become near-instant.
* **Reduced Motion (touch):** the touch UI adds no large motion; its only looping animation is the ROTATE ready glow.
* **Responsive Login:** The login card fits phone widths (verified at 390 px with no horizontal overflow); padding and title size shrink below 480 px.
* **Responsive Game Page:** verified in headless Chrome with touch emulation at 390×844 (portrait) and 844×390 (landscape) and on desktop at 1400×900 and 1024×700: no horizontal or vertical overflow, result card fits the phone screen, no touch UI on desktop.
* **Touch Buttons:** each touch button has an `aria-label` (*Swap soul*, *Rotate mirror*, *Undo step*); the touch-controls region is `aria-hidden` while hidden.
* **Screen Readers:** The login error line uses `role="alert"`; the intro card and toasts are `aria-live="polite"`; the account tabs use `role="tab"` with `aria-selected`.
