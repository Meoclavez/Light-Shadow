# LIGHT & SHADOW (Two Souls. One Heist.)
### Game Concept & Technical Proposal

**Prepared by:** Senior AAA Game Designer, Creative Director, Narrative Designer, and GDD Writer  
**Repository/Workspace:** `/home/meoclavezz/Projects/P-Game`  
**Date:** July 10, 2026  

---

## Abstract

**LIGHT & SHADOW** is a premium top-down, puzzle-stealth heist game designed for PC and consoles. Inspired by the responsive movement mechanics, tactile level design, and immediate spatial awareness of *Robbery Bob*, the game introduces a highly original dual-character traversal mechanic centered entirely on the physical manipulation of light and shadow. 

Players control two spectral thief entities: **Light** (who can only walk within illuminated light beams) and **Shadow** (who can only traverse dark, shadowed areas). A light beam is literally a physical path for one and an impassable wall for the other. By manipulating dynamic light sources, rotating mirrors, and applying refraction physics (prisms and lenses), players must coordinate both characters to bypass advanced guard systems, steal high-value loot, and escape the level.

---

## 1. Problem Statement

Traditional stealth-puzzle games often suffer from several mechanical and narrative shortcomings:
1. **Binary Stealth Predictability:** In most stealth games, light is merely a visibility modifier (e.g., hiding in a bush or dark corner makes you invisible). Traversal remains identical regardless of lighting, leading to static "wait-for-guard-to-turn-around" gameplay loops.
2. **Passive Environmental Interaction:** Puzzle-stealth environments are frequently static. Players rarely interact with the environment to *physically construct* their own paths of navigation.
3. **Asymmetric Co-op Limitations:** Cooperative puzzle games often feature characters with minor stat differences or generic keys/switches, rather than fundamentally asymmetric navigation systems where one player's floor is the other player's hazard.

**LIGHT & SHADOW** resolves these problems by transforming light and shadow into dynamic, physical terrain. Traversal meshes are updated in real-time as light sources swing, rotate, reflect, and refract, forcing players to actively sculpt the navigation paths of both characters to bypass security.

---

## 2. Proposed Solution

The proposed solution is a highly stylized, top-down puzzle-stealth experience where players switch between (or cooperatively control) two characters with mutually exclusive navigation rules.

```
       [Light Source]
             |
             v  (Light Beam)
   +---------|---------+  ==========================
   |   (LIGHT CHARACTER)  |                          |
   |   Moves only here  |   (SHADOW CHARACTER)     |
   |                     |   Moves only in dark     |
   +---------------------+  ==========================
        (Shadow Wall)         (Impassable Light Wall)
```

### 2.1 Character-Specific Workflows & Abilities

The players must orchestrate the movements of two characters who must work in tandem to unlock doors, distract guards, and secure loot:

*   **Light (The Lightwalker):**
    *   **Traversal Constraint:** Can only stand and move within areas illuminated by active light sources. Stepping into shadow is physically impossible (treated as an endless void or an instant-fail state).
    *   **Passive Interaction:** Because they exist in the light, they are highly visible to standard cameras and guards patrolling illuminated zones.
    *   **Special Abilities:** Can absorb light energy to create temporary flares, blinding guards or activating light-sensitive sensors.
*   **Shadow (The Shadowweaver):**
    *   **Traversal Constraint:** Can only stand and move within shadowed/unlit areas. Light beams act as solid, impassable barriers (like physical walls or laser grids).
    *   **Passive Interaction:** They are completely invisible in dark zones, but entering a light beam instantly reveals them, triggering alarms or causing physical damage.
    *   **Special Abilities:** Can project localized shadow cloaks or physically move lightweight obstacles to cast new shadows, opening up paths for themselves or blocking light paths to secure Light's safety.

### 2.2 Dynamic Light & Refraction Mechanics

Levels are designed as intricate physics puzzles where the geometry of light dictates the flow of play:

*   **Shifting Light Sources:** Spotlights rotate on automated timers, and industrial lanterns swing like pendulums. This creates dynamic, moving walkways for Light and shifting hazard walls for Shadow, requiring precise timing to cross corridors.
*   **Mirror Reflection:** Players can manually rotate, slide, and align mirrors mounted on tracks. By reflecting light beams at various angles, players construct custom pathways for Light to cross wide open shadow voids, or redirect light away from a path to let Shadow slip through.
*   **Refraction & Prisms:** In advanced levels, white light beams can be directed through triangular prisms. This splits the light into primary colored beams (Red, Green, Blue). Color-coded gates or receptors only react to their matching light spectrum, adding a rich layer of optical logic to the puzzles.
*   **Shadow Casting:** Dynamic objects (crates, sliding walls, pillars) cast realistic shadows when hit by light beams. Shadow can push or pull these objects to create "shadow bridges" across brightly lit security rooms.

```
  [Light Beam] ---> [Rotatable Mirror] 
                            |
                            | (Reflected Beam)
                            v
                     [Triangular Prism]
                       /    |    \
                      /     |     \  (Refracted Colored Beams)
                    (Red) (Green) (Blue)
                     |      |       |
                     v      v       v
                  [RG-1]  [GG-2]  [BG-3] (Color-Coded Gates)
```

### 2.3 Stealth & Guard AI Systems

Stealth is asymmetric. The level is populated by guards who are optimized for either day or night surveillance:

1. **Lumen Guard (Daywatch):** Patrols brightly lit hallways. They cannot see into the shadows, making them completely oblivious to Shadow. However, they will instantly detect Light if they step into their line of sight.
2. **Nyx Guard (Nightwatch):** Equipped with high-tech night-vision goggles, they patrol dark rooms. They easily spot Shadow in the dark. However, they are blinded and temporarily stunned if a light beam is reflected into their eyes or if Light triggers a flash bang.
3. **Dynamic Searchlight Guards:** Guards who carry heavy, sweeping flashlights. Their flashlight cones represent a double-edged sword: they create a moving platform for Light to hitch a ride on, but act as a moving threat that can corner Shadow in the dark.

---

## 3. Features

*   **Dual-Perspective Cooperative Play:** Playable in single-player (hot-swapping between Light and Shadow with tactical pauses) or local/online co-op.
*   **Real-time Dynamic NavMesh Generator:** The game engine dynamically bakes and updates navigation meshes for both characters based on light raycasts, ensuring smooth movement.
*   **Physics-Based Optical Puzzles:** Interactive mirrors, lenses, filters, splitter prisms, and shadow-casting props that respond to real-world optical logic.
*   **Stark Premium Aesthetics:** A beautiful visual style featuring high-contrast noir atmospheres, glassmorphic UI elements with golden and neon accents, and a dynamic ambient soundtrack that shifts instruments based on which character is currently moving.
*   **Robbery Bob-Inspired Movement:** Smooth, grid-aligned analog controls, sneaking speeds, sprinting (which makes noise), and tactile hiding spots (like sliding inside cardboard boxes in shadows or stepping into glowing lamps).

---

## 4. Architecture (High Level)

The game utilizes a decoupled, component-based architecture to handle the complex interactions between light physics and pathfinding navigation:

```
+-----------------------------------------------------------------+
|                           GAME CLIENT                           |
+-----------------------------------------------------------------+
        |                                                 |
        v                                                 v
+-------------------------+                     +-----------------+
|    LIGHT PHYSICS ENGINE |                     |  INPUT MANAGER  |
| - Real-time Raycasting  |                     | - Swap/Move     |
| - Co-op Input           |                     +-----------------+
+-------------------------+                               |
        |                                                 |
        +-----------------------+                         |
                                v                         v
                     +---------------------+       +--------------+
                     |   DYNAMIC NAVMESH   | ----> | PLAYER STATE |
                     |   GENERATOR         |       | - Light Pos  |
                     | - LightNavMesh      |       | - Shadow Pos |
                     | - ShadowNavMesh     |       +--------------+
                     +---------------------+              |
                                |                         |
                                v                         v
                     +--------------------------------------------+
                     |             GAMEPLAYCONTROLLER             |
                     |  - Rule Checker (Light in Light, etc.)      |
                     |  - Win/Loss Evaluator                      |
                     |  - Guard AI State Machine                  |
                     +--------------------------------------------+
```

### 4.1 Key Architecture Modules

1.  **Light Physics Engine:** Casts high-precision 2D/3D rays from light sources, calculates reflections off mirror surfaces, and computes refraction angles through prisms. It outputs a polygon map of illuminated areas.
2.  **Dynamic NavMesh Generator:** Takes the polygon map of illuminated areas from the Light Physics Engine:
    *   Generates a `LightNavMesh` (valid walking area restricted to the illuminated polygons).
    *   Generates a `ShadowNavMesh` (valid walking area restricted to the inverse/subtracted polygons).
3.  **Gameplay Controller:** Evaluates player positions against the dynamic NavMeshes. If Light steps outside `LightNavMesh` or Shadow steps outside `ShadowNavMesh`, it triggers a localized alert or player reset.
4.  **Guard AI State Machine:** Drives guard behaviors (Patrol, Search, Chase, Blinded). Guards utilize distinct sensory suites: Lumen Guards query the `LightNavMesh` zone for targets, while Nyx Guards query the `ShadowNavMesh` zone.

---

## 5. Technology Stack (Proposed)

It is proposed to use the following state-of-the-art tech stack to deliver a premium indie experience:

*   **Game Engine:** **Unity (2022.3 LTS or later)** utilizing the **Universal Render Pipeline (URP)**. This provides excellent 2D Light/Shadow pipeline support, custom render features, and robust cross-platform compilation.
*   **Scripting & Logic:** **C#** using Assembly Definitions for clean modular code structure.
*   **Pathfinding/NavMesh:** **Unity A* Pathfinding Project** or custom grid-based pathfinding designed to update node traversability dynamically based on light intensity levels.
*   **Visual Effects & Shaders:** Custom **HLSL/Shader Graph** shaders for crisp light beams, glowing particles, glassmorphism UI overlays, and volumetric light fog.
*   **Audio Engine:** **FMOD Studio** for interactive, state-based music scoring. The soundtrack dynamically crossfades between light-themed woodwinds/chimes (for Light) and shadow-themed deep bass/pads (for Shadow) depending on player focus.
*   **Version Control:** **Git** with Git LFS for textures, audio, and FBX/sprite assets.

---

## 6. Expected Outcome

The successful implementation of this game project will yield:
1.  **Vertical Slice:** A polished 3-level prototype demonstrating basic movement, rotating spotlights, sliding mirrors, prisms, and basic guard AI patrols.
2.  **Complete Level Editor:** A developer-facing grid-based tool to rapidly design levels, place light sources, mirrors, guards, and loot.
3.  **Cross-Platform Performance:** A highly optimized engine capable of maintaining stable 60 FPS on Nintendo Switch, PS5, Xbox Series X/S, and low-spec PCs, despite real-time dynamic light recalculations.

---

## 7. References

*   [1] **Robbery Bob (Level & Sneak Mechanics):** Level structures, high-visibility stealth feedback, and intuitive stealth action gameplay.
*   [2] **Monaco: What's Yours is Mine (Asymmetric Heist Design):** Co-op heist coordination, class-based level traversal.
*   [3] **Portal (Optical/Physics Puzzle Design):** Reorienting vectors and rays using mirrors and prisms to redirect energy paths.
*   [4] **Unity URP 2D Lighting Documentation:** [https://docs.unity3d.com/Packages/com.unity.render-pipelines.universal@14.0/manual/2d-index.html](https://docs.unity3d.com/Packages/com.unity.render-pipelines.universal@14.0/manual/2d-index.html)
*   [5] **FMOD Studio Interactive Audio Guide:** [https://fmod.com/resources/documentation-studio](https://fmod.com/resources/documentation-studio)
