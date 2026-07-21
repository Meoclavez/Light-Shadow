# 02. Work Allocation Per Person: LIGHT & SHADOW

**Project Title:** LIGHT & SHADOW (Two Souls. One Heist.)  
**Repository Directory:** `/home/meoclavezz/Projects/P-Game`  
**Phase:** Phase 2 – Requirement Analysis & Feasibility Review  

---

## Team Role & Task Allocation Matrix

| Team Member Role | Primary Responsibilities | Key Deliverables (Phase 2 & Beyond) |
| :--- | :--- | :--- |
| **Lead Architect & Engine Developer** | Core architecture design, 2D Raycasting Light Engine, Visibility Polygon calculation, Prism/Mirror physics | `01_Project_Proposal.md`, `game.js` (Light Physics Core), `04_Feasibility_Study.md` |
| **Gameplay & AI Systems Programmer** | Dual character state machines, Guard AI behaviors (Lumen & Nyx), Grace period & Rewind systems | `game.js` (Entity & AI Controller), `03_Requirement_Analysis_and_Literature_Survey.md` |
| **UI/UX & Audio Specialist** | Glassmorphic interface design, Web Audio API sound synthesis, HUD, controls & visual indicators | `index.html`, `style.css`, `game.js` (AudioSynthesizer), `Supporting_Files/` |
| **Level Designer & QA Lead** | Level progression design (Basics -> Optics -> Prisms), puzzle balance, feasibility testing & documentation | `05_Work_Allocation.md`, Level 1–4 JSON maps, test cases & user feedback |

---

## Detailed Task Breakdown

### Member 1: Lead Architect & Engine Developer
- Researched 2D Raycasting algorithms to replace 3D NavMesh re-baking.
- Designed dynamic lighting polygon calculation supporting reflection off mirrors and spectral splitting through prisms.
- Authored Technical Feasibility Study & Architecture documentation.

### Member 2: Gameplay & AI Systems Programmer
- Implemented Lightwalker and Shadowweaver traversal rules and bounds checking.
- Developed Nyx Guard (Nightwatch) light-stun mechanics and Lumen Guard (Daywatch) line-of-sight detection.
- Authored Functional & Non-Functional Requirements and Literature Survey.

### Member 3: UI/UX & Audio Specialist
- Created high-contrast dark noir theme with glassmorphic overlay elements.
- Implemented Web Audio API procedural sound engine (chimes for Light, bass for Shadow, alarms, and portal FX).
- Created visual diagrams (Requirement Diagram, Use Case Diagram, Flowchart).

### Member 4: Level Designer & QA Lead
- Designed 4 handcrafted puzzle levels demonstrating step-by-step game progression.
- Tested edge cases (stuck states, grace periods, boundary overlaps).
- Compiled final work allocation and submission README.
