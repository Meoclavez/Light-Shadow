# 08. UI/UX Design Document

**Project Title:** LIGHT & SHADOW (Two Souls. One Heist.)  
**Repository Directory:** `/home/meoclavezz/Projects/P-Game`  
**Phase:** Phase 3 – Design & Planning  
**Date:** August 2026  

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

The user interface consists of three distinct layout regions:

```
+-------------------------------------------------------------------------+
| TOP NAVBAR: Brand Logo | Level Title | Loot Status | Grace Bar | Control Buttons |
+-------------------------------------------------------------------------+
| SIDEBAR (Left)             | MAIN VIEWPORT (Center Canvas)              |
| - Character HUD Cards      |                                            |
|   * Lightwalker (Gold)     |  +--------------------------------------+   |
|   * Shadowweaver (Purple)  |  |                                      |   |
| - Soul Swap Action Button  |  |       900 x 650 Canvas Playfield     |   |
| - Controls Cheatsheet      |  |                                      |   |
|                            |  +--------------------------------------+   |
|                            |  [ Victory / Defeat Modal Overlay ]        |
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

---

## 4. Accessibility & Responsiveness

* **Colorblind Accessibility:** Color-coded gates feature unique geometric glyph icons ($\triangle$ for Red, $\square$ for Green, $\bigcirc$ for Blue) alongside color tints.
* **Font Choice:** Clean modern typography using Google Fonts (`Outfit` for headings/UI, `JetBrains Mono` for hotkeys and status counts).
* **Keyboard & Touch Controls:** Complete support for both desktop keyboard hotkeys and mobile/mouse clickable buttons.
