# 06. System Architecture Document (SAD)

**Project Title:** LIGHT & SHADOW (Two Souls. One Heist.)  
**Repository Directory:** `/home/meoclavezz/Projects/P-Game`  
**Phase:** Phase 3 – Design & Planning  
**Date:** August 2026  

---

## 1. Executive Architecture Summary

The **LIGHT & SHADOW** system is designed as a high-performance, component-based, decoupled client architecture. Built using standard web technology (HTML5 Canvas, CSS Glassmorphic Styling, JavaScript ES6+, Web Audio API), the engine relies on a custom 2D Visibility Polygon Raycaster that computes optical paths and dynamic walkable geometry in real-time ($<1.0\text{ms}$ per frame), maintaining a rock-solid 60+ FPS performance target.

---

## 2. High-Level Architectural View

The system architecture comprises five main modules interacting through event-driven and frame-based loops:

```
+-------------------------------------------------------------------------+
|                               GAME CLIENT                               |
+-------------------------------------------------------------------------+
       |                                                    |
       v                                                    v
+-----------------------------+                  +------------------------+
|    INPUT & EVENT MANAGER    |                  |  UI & GLASSMORPHIC HUD |
| - Keyboard (WASD, Tab, E, Z)|                  | - Character Cards      |
| - Touch / UI Click Events   |                  | - Loot & Grace Status  |
+-----------------------------+                  +------------------------+
       |                                                    |
       v                                                    |
+--------------------------------------------------+        |
|               GAME ENGINE CONTROLLER             | <------+
| - Level Manager                                  |
| - Game Loop & State Evaluator                    |
+--------------------------------------------------+
       |                         |
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
* Normalizes direction vectors for movement (`WASD` / Arrow keys) and triggers discrete actions for soul swapping (`Tab`/`Space`), mirror rotation (`E`), tactical step undo (`Z`), and level restart (`R`).

### 3.2 2D Visibility Polygon & Raycasting Engine
* **Algorithm:** For each active light source (lamps, rotating spotlights), the raycaster projects 60+ radial rays bounded by field-of-view ($FOV$) and range.
* **Segment Intersection:** Computes closest line-segment intersections against all environmental boundaries, solid walls, gates, and pushable crates.
* **Optics Pipeline:**
  - **Mirrors:** Calculates angle of reflection $\theta_{\text{reflect}} = 2\theta_{\text{mirror}} - \theta_{\text{incident}}$, casting secondary light polygons.
  - **Prisms:** Refracts white light into distinct Red, Green, and Blue spectrum beams, evaluating color-gated receptor activations.
* **Output:** Generates closed polygon vertex arrays representing active illuminated terrain ($T_{\text{light}}$) and inverse shadow terrain ($T_{\text{shadow}} = U \setminus T_{\text{light}}$).

### 3.3 Entity Controller & Dual Character State Machine
* **Lightwalker Entity:** Constrained to $T_{\text{light}}$. Stepping outside triggers a 0.5s grace period before failing.
* **Shadowweaver Entity:** Constrained to $T_{\text{shadow}}$. Touching light beams triggers grace countdown.
* **Movement Physics:** Features smooth wall sliding (axis decomposition) to prevent sticking against corners.
* **Rewind Manager:** Pushes discrete movement snapshots onto a double-ended stack, allowing seamless tactical steps undo without breaking game state consistency.

### 3.4 Guard AI Engine
* **Lumen Guards (Daywatch):** Patrol lit corridors with directional vision cones ($R=160\text{px}$, $\theta=\pm 0.4\text{rad}$). Detects Lightwalker upon line-of-sight entry.
* **Nyx Guards (Nightwatch):** Patrol unlit rooms with night-vision cones. Detects Shadowweaver in darkness. If hit by reflected light rays, enters a 3.0s `STUNNED` state.

### 3.5 Audio Synthesizer Engine
* Procedural sound generation via Web Audio API (`AudioContext`).
* Synthesizes distinct harmonic tones:
  - Lightwalker step: High sine wave pitch ramp ($587\text{Hz} \rightarrow 880\text{Hz}$).
  - Shadowweaver step: Deep bass triangle tone ($110\text{Hz} \rightarrow 65\text{Hz}$).
  - Prism refraction: Arpeggiated chime sequence.
  - Guard stun: Sawtooth frequency sweep.

---

## 4. Software Design Patterns Employed

1. **Game Loop Pattern:** Frame-decoupled update/render loop driven by `requestAnimationFrame`.
2. **State Pattern:** Encapsulates character states (`LIGHT`, `SHADOW`), guard states (`PATROL`, `STUNNED`), and game state (`PLAYING`, `WIN`, `FAIL`).
3. **Command Pattern:** Encapsulates player interactions (`rotateMirror`, `pushCrate`, `rewindStep`) for state undo support.
4. **Observer Pattern:** Dispatches UI updates whenever loot state, grace meter, or active character changes.
