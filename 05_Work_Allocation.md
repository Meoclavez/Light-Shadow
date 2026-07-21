# 05. Work Allocation Among Team Members

**Project Title:** LIGHT & SHADOW (Two Souls. One Heist.)  
**Repository Directory:** `/home/meoclavezz/Projects/P-Game`  
**Phase:** Phase 2 – Requirement Analysis & Feasibility Review  

---

## Team Responsibility Distribution

Every major component of **LIGHT & SHADOW** is explicitly assigned to ensure balanced contribution and clear accountability across all phases of the software development lifecycle.

```
                       +-----------------------------------+
                       |         PROJECT LEADERSHIP        |
                       | Overall Architecture & Design     |
                       +-----------------------------------+
                                         |
         +-------------------------------+-------------------------------+
         |                               |                               |
         v                               v                               v
+------------------+           +------------------+           +------------------+
| ENGINE & PHYSICS |           | GAMEPLAY & AI    |           | UI, UX & AUDIO   |
| Raycasting Math  |           | State Controller |           | Glassmorphism    |
| Prism Spectrum   |           | Guard Behaviours |           | Web Audio Synth  |
+------------------+           +------------------+           +------------------+
```

---

## Task Matrix & Allocation Table

| Component / Subsystem | Assigned Member | Role | Contribution (Phase 2) | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Project Proposal & Concept** | Lead Architect | Lead Author | Authored `01_Project_Proposal.md`, established core lore & mechanics. | Completed |
| **Visibility Polygon Light Engine** | Lead Architect | Technical Lead | Developed 2D raycaster ray-bounce math in `game.js`. | Completed |
| **Functional & Non-Functional Requirements** | Gameplay Programmer | Systems Analyst | Compiled system requirements & literature survey in `03_Requirement_Analysis_and_Literature_Survey.md`. | Completed |
| **Dual Character Controller & Grace Period** | Gameplay Programmer | Systems Developer | Programmed character movement rules, 0.5s grace period, and rewind logic. | Completed |
| **Guard AI (Lumen & Nyx Guards)** | Gameplay Programmer | AI Developer | Programmed vision cones and Nyx Guard light-stun state machine. | Completed |
| **Feasibility Analysis & Optimization** | Lead Architect | Feasibility Analyst | Authored `04_Feasibility_Study.md` evaluating 2D raycasting vs 3D NavMesh. | Completed |
| **UI/UX Design & Glassmorphism Theme** | UI/UX Specialist | Frontend Engineer | Designed dark noir layout, HUD overlay, and CSS animation system in `index.html` & `style.css`. | Completed |
| **Web Audio Sound Synthesizer** | UI/UX Specialist | Audio Engineer | Created procedural synth engine for Light chimes, Shadow bass, alert sirens, and portal FX. | Completed |
| **Visual Diagrams & Documentation** | UI/UX Specialist | Technical Illustrator | Created `Requirement_Diagram`, `Use_Case_Diagram`, and `Flowchart` in `Supporting_Files/`. | Completed |
| **Level Progression & Quality Assurance** | Level Designer | QA & Balance | Designed 4 playable levels (Basics, Timing, Crates/Mirrors, Prisms) and README. | Completed |

---

## Allocation Verification Checklist

- [x] All functional subsystems (Engine, Gameplay, AI, UI, Audio, Levels) have designated primary owners.
- [x] Workload is evenly distributed across technical documentation, engine development, visual design, and QA.
- [x] Submission package follows GitHub repository structure requirements.
