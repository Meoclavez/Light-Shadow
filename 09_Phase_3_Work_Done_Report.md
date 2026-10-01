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
| **UI/UX & Audio Specialist** | Authored UI/UX Design Document; Enhanced glassmorphic layout, navbar status indicators, particle canvas rendering, and Web Audio SFX. | `08_UI_UX_Design_Document.md`, `index.html`, `style.css`, `Supporting_Files/Wireframes.md` |
| **Level Designer & QA Lead** | Compiled Phase 3 Work Done Report; Tested level progression, edge cases, wall collision sliding, and updated main README. | `09_Phase_3_Work_Done_Report.md`, `README.md`, Level QA verification |

---

## 3. Detailed Activity Log (Phase 3 Timeline)

- **July 22 – July 26, 2026:** Architecture design sessions; defined component boundaries for Raycaster, Entity State Machine, and Web Audio Synthesizer.
- **July 27 – July 30, 2026:** Data modeling & schema definition; structured static Level JSON schemas and `localStorage` high score persistence.
- **July 31 – August 2, 2026:** UI/UX wireframing and design token specification; finalized color palettes and Glassmorphism styling rules.
- **August 3 – August 5, 2026:** Code refactoring & bug fixing in `game.js`; verified 60 FPS performance benchmark; compiled final documentation package.

---

## 4. Post-Phase 3 Addendum — Engine Fixes & Game Completion (October 1, 2026)

After the Phase 3 submission, the playable prototype was audited end-to-end. The audit found a start-up crash, an unwinnable final level, and missing end-of-game logic. All three were fixed, and the design documents (SAD, DDD, UI/UX, requirements, README and supporting diagrams) were updated to match.

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
* **Automated test suite:** `node tests/playthrough.test.js` (no dependencies) runs `game.js` in a Node `vm` sandbox with a stubbed DOM/canvas/`localStorage`, driving the real update loop at 60 FPS with simulated key presses. Result: **8/8 tests passing** (idle start on every level, fresh-profile locks, full campaign playthrough, sealed exit, grace-swap exploit, L3 crate bridge, L4 prism gates & Nyx freeze, star rules/corrupt save/resume).
* **Reference bot completion times:** L1 8.9 s, L2 16.0 s, L3 13.7 s, L4 13.0 s (all within target times).
* **Browser check:** headless Google Chrome showed no console exceptions, and the game stays in `PLAYING` while idle.
