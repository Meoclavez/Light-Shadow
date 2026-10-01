# LIGHT & SHADOW (Two Souls. One Heist.)

![Game Theme](WhatsApp%20Image%202026-07-10%20at%2011.44.31%20AM.jpeg)

**LIGHT & SHADOW** is a top-down, puzzle-stealth heist game built around a dual-character traversal mechanic centered on the physical manipulation of light and shadow.

---

## 📁 Repository Structure & Submission Package

### Phase 3 Deliverables (Design & Planning)
- **`06_System_Architecture_Document.md`**: System Architecture Document (SAD) detailing component decomposition, 2D raycasting pipeline, optics physics solver, entity state machine, and Web Audio engine.
- **`07_Database_Design_Document.md`**: Database Design Document (DDD) specifying static level JSON schemas, player progress data structures, and `localStorage` persistence.
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
- `Wireframes.md`: UI Layout wireframe blueprint.
- `Flowchart.md`: Game loop flowchart.
- `Requirement_Diagram.md`: Requirements hierarchy diagram.
- `Use_Case_Diagram.md`: Player & Guard AI use cases.
- `References.md`: Academic & industry references.

### Automated Tests (`tests/`)
- `playthrough.test.js`: Dependency-free Node.js playthrough test suite that drives the real `game.js` engine (see **Running the tests** below).

---

## 🎮 Playable Web Engine Prototype

A complete HTML5 Canvas & Web Audio interactive game engine is included in this repository.

### How to Run:
Simply open `index.html` in any browser, or run a local HTTP server:
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

### Key Game Controls:
* **`WASD` / Arrow Keys**: Move selected character (with smooth wall sliding)
* **`Tab` / `Space` / UI Button**: Swap active control between **Lightwalker** and **Shadowweaver**
* **`E` / UI Button**: Rotate selected mirror ($22.5^\circ$ angle increment)
* **`Z` / UI Button**: Undo movement step / rewind (reverts to the previous checkpoint)
* **`R` / UI Button**: Reset level
* **`Enter`**: Next level (after a win)
* **`Esc`**: Close the Level Select modal

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
* On page load the game resumes at the first unlocked mission that is not yet finished.
* Winning Mission 4 ends the campaign with a **HEIST COMPLETE!** screen showing the heist total (sum of best times) and campaign stars, with **Play Again ⟲** (restarts at Mission 1), **Replay Level** and **Levels** buttons.

### Save Data
Progress (unlocked missions, best times, stars) and the mute setting are stored in the browser's `localStorage` under the key `LIGHT_SHADOW_SAVEDATA`. Corrupt or blocked storage falls back to a fresh profile. See `07_Database_Design_Document.md` §4 for the schema.

---

## 🧪 Running the Tests

```bash
node tests/playthrough.test.js
```

No dependencies are required. The suite loads `game.js` in a Node `vm` sandbox with a stubbed DOM/canvas/`localStorage` and drives the real update loop at 60 FPS with simulated key presses. Its 8 tests cover: idle start-up survival on every level, level locking on a fresh profile, a full 4-level campaign playthrough (saving, unlocking, campaign-end screen, Play Again), the sealed exit, the grace-swap exploit, the Level 3 crate bridge, the Level 4 prism gates and Nyx freeze, and star rules / corrupt save / resume. Current result: **8/8 passing**.

For debugging in the browser, the running engine is exposed as `window.lightShadowGame`.

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
