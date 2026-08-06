# 03. Requirement Analysis & Literature Survey

**Project Title:** LIGHT & SHADOW (Two Souls. One Heist.)  
**Repository Directory:** `/home/meoclavezz/Projects/P-Game`  
**Phase:** Phase 2 – Requirement Analysis & Feasibility Review  

---

## 1. Functional Requirements

The core functional capabilities of **LIGHT & SHADOW** are categorized into four major subsystems:

### 1.1 Character & Navigation Subsystem (FR-1)
* **FR-1.1 (Dual Control):** System shall allow switching active control between **Light** and **Shadow** using keyboard (`Tab`/`Space`) or UI buttons.
* **FR-1.2 (Light Traversal Constraint):** **Light** character can only move within active illuminated polygons. Entering shadowed terrain triggers a 0.5s grace period before failing.
* **FR-1.3 (Shadow Traversal Constraint):** **Shadow** character can only move within unlit/shadowed polygons. Touching active light beams triggers a 0.5s grace period before failing.
* **FR-1.4 (Grace Period & Rewind):** When an invalid terrain condition occurs, player receives visual feedback (flashing aura) and can trigger an instant Rewind (`Z` key) to revert 3 seconds of movement.

### 1.2 Dynamic Optics & Physics Engine (FR-2)
* **FR-2.1 (Dynamic Light Sources):** System shall support static lamps, rotating spotlights, and swinging pendulums emitting continuous 2D light cones.
* **FR-2.2 (Mirror Reflection):** Players can interact with mounted mirrors to reflect light beams at arbitrary angles, re-routing Light's path and casting new shadow walls.
* **FR-2.3 (Prism Spectrum Splitting):** Aligning a white light beam into a triangular prism refracts the light into primary Red, Green, and Blue rays.
* **FR-2.4 (Color-Coded Gates):** Red, Green, and Blue light rays activate corresponding color-coded optical receptors to unlock doors.
* **FR-2.5 (Dynamic Shadow Casting):** Solid props (movable crates, pillars) cast realistic shadows when hit by light beams, creating "shadow bridges" for Shadow.

### 1.3 Guard AI & Stealth Subsystem (FR-3)
* **FR-3.1 (Lumen Guards - Daywatch):** Patrol lit areas with vision cones. Detect Light instantly if in line of sight; cannot see Shadow hidden in dark zones.
* **FR-3.2 (Nyx Guards - Nightwatch):** Patrol dark rooms with night-vision cones. Spot Shadow in darkness. If hit by a reflected light beam, Nyx Guards become stunned for 3 seconds.
* **FR-3.3 (Flashlight Guards):** Patrol with sweeping flashlights. Flashlight beam provides a moving path for Light, but acts as a moving hazard for Shadow.

### 1.4 Level Progression & Win/Loss Conditions (FR-4)
* **FR-4.1 (Loot Collection):** Players must steal the target artifact (diamond/gold key) in each level.
* **FR-4.2 (Coordinated Exit):** Both characters must reach the exit portal after securing loot to complete the level.
* **FR-4.3 (Level Select & Restart):** Players can restart the level at any time or navigate between unlocked levels.

---

## 2. Non-Functional Requirements

### 2.1 Performance & Responsiveness (NFR-1)
* Real-time 2D raycasting and visibility polygon calculation must complete in under **1.0 millisecond per frame**, ensuring a smooth **60+ FPS** rendering speed on standard PC and web browsers.

### 2.2 Usability & Accessibility (NFR-2)
* Intuitive grid/analog movement controls (`WASD` / Arrow keys).
* High-contrast visual feedback distinguishing Light paths (glowing golden hue) from Shadow zones (deep obsidian velvet tone).
* Colorblind accessibility using distinct icon patterns on Red, Green, and Blue color-coded gates.

### 2.3 Maintainability & Modular Architecture (NFR-3)
* Modular C#/JS architecture separating Physics Engine, NavMesh Generator, Entity Controller, and UI Manager.
* Clean JSON data structures for level layout loading and custom level creation.

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
