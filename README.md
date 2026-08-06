# LIGHT & SHADOW (Two Souls. One Heist.)

![Game Theme](WhatsApp%20Image%202026-07-10%20at%2011.44.31%20AM.jpeg)

**LIGHT & SHADOW** is a top-down, puzzle-stealth heist game built around a dual-character traversal mechanic centered on the physical manipulation of light and shadow.

---

## 📁 Phase 2 Repository Structure

```
P-Game/
├── 01_Project_Proposal.md                       # Project proposal & concept overview
├── 02_Work_Per_Person.md                        # Individual team member task breakdown
├── 03_Requirement_Analysis_and_Literature_Survey.md # Functional/Non-Functional Specs & Literature Survey
├── 04_Feasibility_Study.md                      # Technical, Economic, Operational, Schedule Feasibility
├── 05_Work_Allocation.md                        # Work Allocation Matrix
├── Supporting_Files/
│   ├── Requirement_Diagram.md                   # System Architecture Requirement Diagram
│   ├── Use_Case_Diagram.md                      # Player & System Use Case Diagram
│   ├── Flowchart.md                             # Game Engine Execution Flowchart
│   └── References.md                            # Comprehensive Academic & Industry Citations
├── index.html                                   # Playable Game Prototype UI Entry Point
├── style.css                                    # Glassmorphic UI & Dark Noir Stylesheet
├── game.js                                      # 2D Raycasting Engine, AI & Gameplay Logic
├── Game_Concept_Proposal.md                     # Original Game Design Document
└── README.md                                    # Repository Documentation (This File)
```

---

## 🎮 Playable Web Engine Prototype

A complete HTML5 Canvas & Web Audio interactive game prototype is included in this repository.

### How to Run:
Simply open `index.html` in any web browser (Chrome, Firefox, Edge, Safari), or start a local HTTP server:
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

### Key Game Controls:
* **`WASD` / Arrow Keys**: Move selected character
* **`Tab` / `Space` / UI Button**: Switch active control between **Light** and **Shadow**
* **`R` / UI Button**: Rotate selected mirror
* **`Z` / UI Button**: Rewind movement step
* **`Esc`**: Pause / Menu

---

## 🌟 Core Gameplay Features

1. **Dual Traversal Constraints**:
   - **Light (The Lightwalker)**: Can only step in light beams emitted by lamps or spotlights.
   - **Shadow (The Shadowweaver)**: Can only step in dark, unlit areas.
2. **Optics Physics Engine**:
   - **Rotatable Mirrors**: Redirect light beams across room corners.
   - **Prisms**: Refract white light into RGB color beams to unlock matching color receptors.
   - **Movable Crates**: Cast dynamic shadow bridges across brightly lit zones.
3. **Interactive Guard AI**:
   - **Lumen Guards (Daywatch)**: Patrol light zones.
   - **Nyx Guards (Nightwatch)**: Patrol dark zones; stunned for 3s if light is reflected into their vision cone.
