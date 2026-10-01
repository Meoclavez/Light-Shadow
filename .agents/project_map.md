# Project Map: LIGHT & SHADOW

This workspace contains the Game Design Document (GDD), Phase 2 Requirement Analysis, Phase 3 Design & Planning documentation, Architectural Diagrams, and Playable HTML5 Canvas Game Engine for **LIGHT & SHADOW**.

## Project Directory Structure & Module Index

### Phase 3 Academic Submission Package (Design & Planning)
- [06_System_Architecture_Document.md](file:///home/meoclavezz/Projects/P-Game/06_System_Architecture_Document.md): System Architecture Document (SAD) covering component decomposition, 2D raycasting pipeline, optics physics solver, entity state machine, and Web Audio engine.
- [07_Database_Design_Document.md](file:///home/meoclavezz/Projects/P-Game/07_Database_Design_Document.md): Database Design Document (DDD) specifying static level JSON schemas, player progress data structures, and `localStorage` persistence.
- [08_UI_UX_Design_Document.md](file:///home/meoclavezz/Projects/P-Game/08_UI_UX_Design_Document.md): UI/UX Design Document defining the Glassmorphism Dark Noir visual design system, color tokens, and user interaction flows.
- [09_Phase_3_Work_Done_Report.md](file:///home/meoclavezz/Projects/P-Game/09_Phase_3_Work_Done_Report.md): Detailed team contributions and activity log for Phase 3.

### Phase 2 Academic Submission Package
- [01_Project_Proposal.md](file:///home/meoclavezz/Projects/P-Game/01_Project_Proposal.md): Executive summary, problem statement, proposed dual-character traversal solution, and scope.
- [02_Work_Per_Person.md](file:///home/meoclavezz/Projects/P-Game/02_Work_Per_Person.md): Detailed individual task breakdown and team contribution matrix.
- [03_Requirement_Analysis_and_Literature_Survey.md](file:///home/meoclavezz/Projects/P-Game/03_Requirement_Analysis_and_Literature_Survey.md): System Functional Requirements, Non-Functional Specs, Literature Survey, and research gap identification.
- [04_Feasibility_Study.md](file:///home/meoclavezz/Projects/P-Game/04_Feasibility_Study.md): Comprehensive evaluation of Technical Feasibility, Economic, Operational, and Schedule Milestones.
- [05_Work_Allocation.md](file:///home/meoclavezz/Projects/P-Game/05_Work_Allocation.md): Subsystem responsibility distribution and work allocation matrix across team members.
- [README.md](file:///home/meoclavezz/Projects/P-Game/README.md): Repository documentation and run instructions.

### Supporting Files & Visual Diagrams (`Supporting_Files/`)
- [Architecture_Diagram.md](file:///home/meoclavezz/Projects/P-Game/Supporting_Files/Architecture_Diagram.md): System Architecture component diagram in Mermaid.
- [ER_Diagram.md](file:///home/meoclavezz/Projects/P-Game/Supporting_Files/ER_Diagram.md): Entity-Relationship diagram for level maps, game objects, and player progress.
- [Wireframes.md](file:///home/meoclavezz/Projects/P-Game/Supporting_Files/Wireframes.md): UI Layout wireframe blueprint.
- [Requirement_Diagram.md](file:///home/meoclavezz/Projects/P-Game/Supporting_Files/Requirement_Diagram.md): System architecture requirement hierarchy.
- [Use_Case_Diagram.md](file:///home/meoclavezz/Projects/P-Game/Supporting_Files/Use_Case_Diagram.md): Player actions, environment optics interactions, and Guard AI interactions.
- [Flowchart.md](file:///home/meoclavezz/Projects/P-Game/Supporting_Files/Flowchart.md): Complete game execution loop flowchart.
- [References.md](file:///home/meoclavezz/Projects/P-Game/Supporting_Files/References.md): Academic and industry references.

### Playable Web Game Engine & Prototype
- [index.html](file:///home/meoclavezz/Projects/P-Game/index.html) + [login.css](file:///home/meoclavezz/Projects/P-Game/login.css) + [login.js](file:///home/meoclavezz/Projects/P-Game/login.js): animated login page (Sign In / Create Account, saved-player chips, Continue-as, UI sound effects, animated spotlight background). Entry point of the site.
- [auth.js](file:///home/meoclavezz/Projects/P-Game/auth.js): `window.LightShadowAuth` — browser-only accounts in localStorage `LIGHT_SHADOW_ACCOUNTS` (salted, 2000× SHA-256), session key `LIGHT_SHADOW_SESSION` (sessionStorage, + localStorage when "stay signed in"), `saveKeyFor(user)` → `LIGHT_SHADOW_SAVEDATA::<user>`.
- [game.html](file:///home/meoclavezz/Projects/P-Game/game.html): game UI (moved from index.html); loads auth.js first and redirects to index.html when nobody is signed in. Header: player badge, pause, music, sound, rewind, restart, levels, sign out.
- [style.css](file:///home/meoclavezz/Projects/P-Game/style.css): dark noir design system + game animations (intro card, toast, page transitions) + responsive breakpoints (1200/1100/900/480 px, landscape ≤600 px tall) and the `body.touch-ui` touch layout.
- [mobile.js](file:///home/meoclavezz/Projects/P-Game/mobile.js): `MobileControls` — fits the 900×650 canvas to its panel, floating analog joystick + SWAP/ROTATE/UNDO buttons, optional DeviceOrientation tilt steering (orientation-aware mapping, calibration, sensitivity), full screen, haptics and the ⚙️ Settings modal. Input priority: keyboard > joystick > tilt (engine.analogInput).
- [vercel.json](file:///home/meoclavezz/Projects/P-Game/vercel.json) / [.vercelignore](file:///home/meoclavezz/Projects/P-Game/.vercelignore): static Vercel hosting (cleanUrls, security headers; deploy excludes docs/tests/.agents).
- [game.js](file:///home/meoclavezz/Projects/P-Game/game.js): Complete game engine implementation featuring:
  - `LEVELS` constant: static level data (walls, light sources incl. `sweep` pendulums, mirrors with `spread`, solid prisms, gates with colour `receptor`, crates, guards, loot, exit, `parTime`, `desc`).
  - `SaveManager`: localStorage persistence under `LIGHT_SHADOW_SAVEDATA` (`unlockedLevelIndex`, `highScores.level_N {completed, bestTimeSeconds, stars}`, `audioSettings`).
  - `AudioSynthesizer`: Web Audio API sound generator routed through a master gain node (chimes, bass steps, mirror clicks, prism chimes, alarms, victory fanfares).
  - `LightShadowEngine`: main loop, 2D visibility-polygon raycaster, honest optics (mirrors/prisms react only when actually lit; prisms emit R/G/B 40 px laser bands; receptors latch gates open), guard line-of-sight vision, solid pushable crates.
  - Dual Character Controller: Lightwalker (light-only) & Shadowweaver (dark-only), per-soul 0.5 s grace meter, step rewind (`Z`). Exit portal is neutral "twilight" ground.
  - End logic: win = loot + both souls in exit; target time + 1–3 stars (★★★ = under target with no rewinds); next level unlocks on win; final level shows the "HEIST COMPLETE!" campaign screen (state `CAMPAIGN_COMPLETE`).
  - Continue-where-you-left-off: per-account save holds `lastLevelIndex` + `inProgress` mid-level snapshot (autosaved every 2 s, on pause/tab hide/pagehide/sign out; cleared on win/fail/fresh load); restored PAUSED with a "WELCOME BACK" overlay. PAUSED state via P/Esc.
  - Ambient Web Audio soundtrack crossfading Light/Shadow voicings on swap; intro card, toasts, portal swirl, loot bob, victory burst.
  - Debug handle: `window.lightShadowGame`.
- [tests/playthrough.test.js](file:///home/meoclavezz/Projects/P-Game/tests/playthrough.test.js): dependency-free headless regression suite (Node `vm` sandbox + stubbed DOM; a bot plays every level with simulated key presses).

## How to Run & Verify
- Play: open `index.html` (login) or `python3 -m http.server 8000` → http://localhost:8000; the game itself is `game.html`.
- Deploy: Vercel, Framework Preset "Other", no build command, output dir = repo root (static site, no env vars). Accounts are browser-only by team decision (no backend).
- Test: `node tests/playthrough.test.js` (must print `16/16 tests passed`).
- Mobile check: headless Chrome with touch + device-orientation emulation over `python3 -m http.server` (no project script; see session notes in brain). Run it after any change to `LEVELS` or engine rules — the reference bot solutions in the test encode each level's intended route, so geometry changes must keep them valid.

## Conventions
- Level geometry is designed against the real raycaster: canvas 900×650, character radius 14, speed 170 px/s, grace 0.5 s (≈85 px of forbidden terrain), exit radius 45, guard vision 160 px / ±0.4 rad.
- Spawns must be on valid terrain (Light lit, Shadow dark) — the idle-start test enforces this (the Oct 2026 start-up crash was Lightwalker spawning outside its spotlight cone).

## Status (October 1, 2026)
- Start-up crash fix + end logic merged to main (695cc10).
- Login page, browser-only multi-account system, continue-where-you-left-off, pause, soundtrack/animations and Vercel config implemented and verified (headless Chrome end-to-end flow).
- Mobile: responsive layout, touch joystick/buttons (primary), optional tilt, settings modal (per-account `settings`), haptics — verified 16/16 tests + phone emulation. Committed and pushed to main.
