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
* **`Z` / UI Button**: Undo movement step / rewind
* **`R` / UI Button**: Reset level
