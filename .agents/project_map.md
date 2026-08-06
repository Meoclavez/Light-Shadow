# Project Map: LIGHT & SHADOW

This workspace contains the Game Design Document (GDD), Phase 2 Requirement Analysis, Feasibility Study, Architectural Diagrams, and Playable HTML5 Canvas Game Engine for **LIGHT & SHADOW**.

## Project Directory Structure & Module Index

### Phase 2 Academic Submission Package
- [01_Project_Proposal.md](file:///home/meoclavezz/Projects/P-Game/01_Project_Proposal.md): Executive summary, problem statement, proposed dual-character traversal solution, and scope.
- [02_Work_Per_Person.md](file:///home/meoclavezz/Projects/P-Game/02_Work_Per_Person.md): Detailed individual task breakdown and team contribution matrix.
- [03_Requirement_Analysis_and_Literature_Survey.md](file:///home/meoclavezz/Projects/P-Game/03_Requirement_Analysis_and_Literature_Survey.md): System Functional Requirements (FR-1 through FR-4), Non-Functional Specs (NFR-1 through NFR-3), Literature Survey (*Robbery Bob*, *Monaco*, *Portal*, *Shadowmatic*), and research gap identification.
- [04_Feasibility_Study.md](file:///home/meoclavezz/Projects/P-Game/04_Feasibility_Study.md): Comprehensive evaluation of Technical Feasibility (2D Raycasting vs 3D NavMesh), Economic Feasibility, Operational Feasibility, and Schedule Milestones.
- [05_Work_Allocation.md](file:///home/meoclavezz/Projects/P-Game/05_Work_Allocation.md): Subsystem responsibility distribution and work allocation matrix across team members.
- [README.md](file:///home/meoclavezz/Projects/P-Game/README.md): Repository documentation and run instructions.

### Supporting Files & Visual Diagrams (`Supporting_Files/`)
- [Requirement_Diagram.md](file:///home/meoclavezz/Projects/P-Game/Supporting_Files/Requirement_Diagram.md): System architecture requirements hierarchy in Mermaid/ASCII notation.
- [Use_Case_Diagram.md](file:///home/meoclavezz/Projects/P-Game/Supporting_Files/Use_Case_Diagram.md): Player actions, environment optics interactions, and Guard AI state interactions.
- [Flowchart.md](file:///home/meoclavezz/Projects/P-Game/Supporting_Files/Flowchart.md): Complete game execution loop flowchart from raycasting to position validation and win/fail state.
- [References.md](file:///home/meoclavezz/Projects/P-Game/Supporting_Files/References.md): Academic and industry references.

### Playable Web Game Engine & Prototype
- [index.html](file:///home/meoclavezz/Projects/P-Game/index.html): Glassmorphic game user interface, top navbar, HUD, active character cards, and HTML5 canvas viewport.
- [style.css](file:///home/meoclavezz/Projects/P-Game/style.css): Custom dark noir design system, HSL color tokens, glowing light/shadow card animations, and glass overlay styling.
- [game.js](file:///home/meoclavezz/Projects/P-Game/game.js): Complete game engine implementation containing:
  - `AudioSynthesizer`: Web Audio API sound generator (chimes, bass steps, mirror clicks, prism chimes, alarms, victory fanfares).
  - `LightShadowEngine`: Main loop controller, 2D Visibility Polygon raycaster, mirror angle reflection, prism spectrum splitting into Red/Green/Blue rays.
  - Dual Character Controller: Lightwalker (light-only terrain) & Shadowweaver (dark-only terrain) with 0.5s grace period and instant rewind (`Z` key).
  - Guard AI: Lumen Guards (patrol light), Nyx Guards (patrol dark, stunned for 3s when hit by light beams).
  - Level System: 4 handcrafted levels (Basics, Timing & Spotlights, Mirrors & Shadow Bridges, Prism Spectrum Heist).

### Original Concept Assets
- [Game_Concept_Proposal.md](file:///home/meoclavezz/Projects/P-Game/Game_Concept_Proposal.md): Original GDD.
- [WhatsApp Image 2026-07-10 at 11.44.31 AM.jpeg](file:///home/meoclavezz/Projects/P-Game/WhatsApp%20Image%202026-07-10%20at%2011.44.31%20AM.jpeg): Core gameplay concept layout & character reference sheet.
- [WhatsApp Image 2026-07-10 at 11.26.51 PM.jpeg](file:///home/meoclavezz/Projects/P-Game/WhatsApp%20Image%202026-07-10%20at%2011.26.51%20PM.jpeg): Optics physics mechanics & level progression mockup.
