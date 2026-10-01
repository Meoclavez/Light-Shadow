# 08. UI/UX Design Document

**Project Title:** LIGHT & SHADOW (Two Souls. One Heist.)  
**Repository Directory:** `/home/meoclavezz/Projects/P-Game`  
**Phase:** Phase 3 – Design & Planning  
**Date:** August 2026  
**Last Updated:** October 1, 2026 (end-of-level, progression & campaign UI)  

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

The user interface consists of four distinct layout regions (navbar, objective banner, sidebar, and canvas viewport):

```
+-------------------------------------------------------------------------+
| TOP NAVBAR: Brand Logo | Level Title | Loot | Timer | Grace | Buttons   |
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
|                            |  [ Victory / Defeat / Campaign Overlay ]   |
+-------------------------------------------------------------------------+
```

---

## 3. Key Interaction Flows & UX Mechanics

### 3.1 Character Swapping Flow (`Tab` / `Space`)
1. Player presses `Tab`, `Space`, or clicks the **Swap Character** button.
2. Active focus toggles between Lightwalker and Shadowweaver.
3. Left sidebar character card highlights with a glowing border transition (Golden glow for Light, Violet glow for Shadow).
4. Audio synthesizer plays a rising pitch swap tone.
5. Canvas rendering applies high-intensity aura glow to the currently controlled character.

### 3.2 Mirror & Optics Interaction (`E` Key)
1. Player moves active character within 50px of a rotatable mirror.
2. Interactive indicator `[E] Rotate Mirror` lights up on screen.
3. Pressing `E` rotates mirror angle by $22.5^\circ$ ($\pi/8$ rad).
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
| **Campaign Complete** (`CAMPAIGN_COMPLETE`) | `HEIST COMPLETE!` | Level stats + Heist total (best), Campaign stars X / 12 | **Play Again ⟲** (restarts at Mission 1), Replay Level, Levels |

### 3.7 Level Select Modal
1. Mission cards are generated from level data: number, title, description, star rating (☆☆☆–★★★), and best time + target time.
2. Locked missions are dimmed with `🔒 Locked — clear the previous mission` and cannot be clicked.
3. The footer shows the campaign star total (`★ X / 12`), a hint on how to earn ★★★, and a **Reset Progress** button (with a confirmation dialog).
4. The game pauses while the modal is open; `Esc` or the `×` button closes it.

---

## 4. Accessibility & Responsiveness

* **Colorblind Accessibility:** Color-coded gates feature unique geometric glyph icons ($\triangle$ for Red, $\square$ for Green, $\bigcirc$ for Blue) alongside color tints.
* **Font Choice:** Clean modern typography using Google Fonts (`Outfit` for headings/UI, `JetBrains Mono` for hotkeys and status counts).
* **Keyboard & Touch Controls:** Complete support for both desktop keyboard hotkeys and mobile/mouse clickable buttons. The sidebar controls list includes `Enter` (next level after a win) and `Esc` (close Level Select).
