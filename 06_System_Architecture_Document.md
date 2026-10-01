# 06. System Architecture Document (SAD)

**Project Title:** LIGHT & SHADOW (Two Souls. One Heist.)  
**Repository Directory:** `/home/meoclavezz/Projects/P-Game`  
**Phase:** Phase 3 – Design & Planning  
**Date:** August 2026  
**Last Updated:** October 1, 2026 (post-Phase 3 engine fixes & game completion)  

---

## 1. Executive Architecture Summary

The **LIGHT & SHADOW** system is designed as a high-performance, component-based, decoupled client architecture. Built using standard web technology (HTML5 Canvas, CSS Glassmorphic Styling, JavaScript ES6+, Web Audio API), the engine relies on a custom 2D Visibility Polygon Raycaster that computes optical paths and dynamic walkable geometry in real-time ($<1.0\text{ms}$ per frame), maintaining a rock-solid 60+ FPS performance target.

---

## 2. High-Level Architectural View

The system architecture comprises six main modules interacting through event-driven and frame-based loops:

```
+-------------------------------------------------------------------------+
|                               GAME CLIENT                               |
+-------------------------------------------------------------------------+
       |                                                    |
       v                                                    v
+-----------------------------+                  +------------------------+
|    INPUT & EVENT MANAGER    |                  |  UI & GLASSMORPHIC HUD |
| - Keyboard (WASD, Tab, E, Z)|                  | - Character Cards      |
| - Touch / UI Click Events   |                  | - Loot/Timer/Grace     |
+-----------------------------+                  +------------------------+
       |                                                    |
       v                                                    |
+--------------------------------------------------+        |
|               GAME ENGINE CONTROLLER             | <------+
| - Level Manager                                  |
| - Game Loop & State Evaluator                    |     +-----------------------+
| - Progression / Campaign Controller              | --> | SAVE MANAGER          |
+--------------------------------------------------+     | - localStorage JSON   |
       |                         |                       +-----------------------+
       v                         v
+--------------------+   +-------------------+   +------------------------+
| OPTICS & RAYCASTER |   | ENTITY & AI ENGINE|   | AUDIO SYNTHESIZER      |
| - 2D Visibility    |   | - Dual Characters |   | - Web Audio Oscillators|
| - Mirrors & Prisms |   | - Guard State Mch |   | - Dynamic SFX Engine   |
+--------------------+   +-------------------+   +------------------------+
```

---

## 3. Subsystem Breakdown & Component Specifications

### 3.1 Input & Event Manager
* Captures player input events asynchronously (`keydown`, `keyup`, mouse/touch clicks).
* Normalizes direction vectors for movement (`WASD` / Arrow keys) and triggers discrete actions for soul swapping (`Tab`/`Space`), mirror rotation (`E`), tactical step undo (`Z`), level restart (`R`), next level after a win (`Enter`), and closing Level Select (`Esc`).
* Discrete actions ignore key auto-repeat and are only accepted in the `PLAYING` state; held keys are cleared on window blur.

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
* All output is routed through a master gain node (mute toggle); audio calls are guarded when Web Audio is unavailable.

### 3.6 Progression, Campaign Controller & SaveManager
* **Win Evaluation:** Each frame in `PLAYING`, the controller checks loot pickup (either soul within 30 px) and then whether both souls are inside the exit portal. The exit is sealed until the loot is taken, and the objective banner switches to the escape instruction.
* **Scoring:** Tracks elapsed level time against the level's `parTime` and the number of rewinds used; star rating = ★ completed, ★★ within target, ★★★ within target with zero rewinds.
* **Progression:** On a win, the result is saved (best time, best stars), the next mission is unlocked, and the next level becomes available via **Next Level ➔** / `Enter`. Winning the final level moves to `CAMPAIGN_COMPLETE` and shows the campaign summary (heist total, campaign stars) with **Play Again ⟲** restarting at Mission 1.
* **Level Select:** Mission cards are generated from level data (lock state, stars, best time, target time); the game pauses while the modal is open.
* **SaveManager:** Reads/writes the `LIGHT_SHADOW_SAVEDATA` JSON in `localStorage` (schema in DDD §4). Corrupt or blocked storage falls back to a fresh profile. On page load, the game resumes at the first unlocked-but-unfinished mission.

### 3.7 Game State Machine
| State | Entered When | Exits To |
| :--- | :--- | :--- |
| `PLAYING` | Level loaded / restarted | `WIN`, `FAIL`, `CAMPAIGN_COMPLETE` |
| `WIN` | Loot taken and both souls in the exit (levels 1–3) | `PLAYING` (Next Level / Replay Level / Levels) |
| `FAIL` | Grace meter empty or spotted by a guard | `PLAYING` (Try Again / Levels) |
| `CAMPAIGN_COMPLETE` | Final level (4) won | `PLAYING` (Play Again from Mission 1 / Replay Level / Levels) |

---

## 4. Software Design Patterns Employed

1. **Game Loop Pattern:** Frame-decoupled update/render loop driven by `requestAnimationFrame`.
2. **State Pattern:** Encapsulates character states (`LIGHT`, `SHADOW`), guard states (`PATROL`, `STUNNED`), and game state (`PLAYING`, `WIN`, `FAIL`, `CAMPAIGN_COMPLETE`).
3. **Command Pattern:** Encapsulates player interactions (`rotateMirror`, `pushCrate`, `rewindStep`) for state undo support.
4. **Observer Pattern:** Dispatches UI updates whenever loot state, grace meter, timer, objective, or active character changes.
