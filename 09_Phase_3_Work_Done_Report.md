# 09. Phase 3 Work Done Report

**Project Title:** LIGHT & SHADOW (Two Souls. One Heist.)  
**Repository Directory:** `/home/meoclavezz/Projects/P-Game`  
**Phase:** Phase 3 – Design & Planning  
**Submission Timeline:** July 22, 2026 – August 5, 2026  

---

## 1. Executive Work Summary

During Phase 3 (Design & Planning), the team focused on establishing the complete software architectural blueprint, data schema, user interface design system, supporting visual diagrams, and refining the core playable web engine prototype.

Key achievements during Phase 3 include:
1. Completion of the **System Architecture Document (SAD)**, detailing the 2D Raycasting pipeline, optics physics solver, entity state machine, and audio engine.
2. Completion of the **Database Design Document (DDD)**, defining level schema JSON structures and `localStorage` state persistence.
3. Completion of the **UI/UX Design Document**, establishing the Glassmorphism Dark Noir design system and interaction flows.
4. Creation of supporting visual design artifacts: `Architecture_Diagram`, `ER_Diagram`, and `Wireframes`.
5. Significant game engine logic polish: bug fixes for audio frame spam, dynamic raycast gate evaluation, rewind state history optimization, wall sliding movement physics, particle visual effects, and guard alert feedback.

---

## 2. Team Member Work Contribution Breakdown

| Team Member Role | Phase 3 Contributions & Tasks Completed | Delivered Artifacts |
| :--- | :--- | :--- |
| **Lead Architect & Engine Developer** | Authored System Architecture Document (SAD); Refactored 2D Raycasting ray-bounce optics math; Fixed per-frame audio spam bugs in `game.js`. | `06_System_Architecture_Document.md`, `game.js` optics updates, `Supporting_Files/Architecture_Diagram.md` |
| **Gameplay & AI Programmer** | Authored Database Design Document (DDD); Implemented dynamic color-gate ray evaluation, smooth wall sliding, and rewind history checkpointing. | `07_Database_Design_Document.md`, `game.js` physics & AI updates, `Supporting_Files/ER_Diagram.md` |
| **UI/UX & Audio Specialist** | Authored UI/UX Design Document; Enhanced glassmorphic layout, navbar status indicators, particle canvas rendering, and Web Audio SFX. | `08_UI_UX_Design_Document.md`, `index.html`, `style.css`, `Supporting_Files/Wireframes.md` |
| **Level Designer & QA Lead** | Compiled Phase 3 Work Done Report; Tested level progression, edge cases, wall collision sliding, and updated main README. | `09_Phase_3_Work_Done_Report.md`, `README.md`, Level QA verification |

---

## 3. Detailed Activity Log (Phase 3 Timeline)

- **July 22 – July 26, 2026:** Architecture design sessions; defined component boundaries for Raycaster, Entity State Machine, and Web Audio Synthesizer.
- **July 27 – July 30, 2026:** Data modeling & schema definition; structured static Level JSON schemas and `localStorage` high score persistence.
- **July 31 – August 2, 2026:** UI/UX wireframing and design token specification; finalized color palettes and Glassmorphism styling rules.
- **August 3 – August 5, 2026:** Code refactoring & bug fixing in `game.js`; verified 60 FPS performance benchmark; compiled final documentation package.
