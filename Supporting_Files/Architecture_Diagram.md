# Supporting File: System Architecture Diagram

```mermaid
graph TD
    Client["LIGHT & SHADOW Web Client Application"]

    subgraph User Interface Layer
        HUD["Glassmorphic HUD (index.html / style.css)"]
        CharCards["Character HUD Cards (Lightwalker & Shadowweaver)"]
        LevelModal["Level Selector Modal (Locks, Stars, Best Times, Reset Progress)"]
        Overlay["Victory / Defeat / Campaign Complete Overlay (Stats & Stars)"]
        TimerPill["HUD Timer Pill (Elapsed / Target) & Objective Banner"]
    end

    subgraph Input & Controllers
        InputMgr["Input & Event Manager (WASD, Tab, Space, E, Z, R, Enter, Esc)"]
        GameLoop["Game Loop Controller (requestAnimationFrame)"]
        Progression["Progression / Campaign Controller (PLAYING, WIN, FAIL, CAMPAIGN_COMPLETE)"]
    end

    subgraph Core Physics & Optics Engine
        Raycaster["2D Visibility Polygon Raycaster"]
        Mirrors["Rotatable Mirror Reflection Solver"]
        Prisms["Prism RGB Spectrum Refraction Solver"]
        Crates["Dynamic Shadow-Casting Crates Solver"]
        Receptors["Colour Receptor & Gate Latch"]
    end

    subgraph Entity & AI Subsystem
        CharController["Dual Character Controller (Light & Shadow)"]
        GraceSystem["Per-Soul Grace Meters & Rewind State Manager"]
        GuardAI["Guard AI Engine (Lumen & Nyx Guards, Line of Sight)"]
    end

    subgraph Persistence Layer
        SaveMgr["SaveManager"]
        Storage[("Browser localStorage: LIGHT_SHADOW_SAVEDATA")]
    end

    subgraph Audio Engine
        AudioSynth["Procedural Web Audio Synthesizer"]
    end

    Client --> HUD
    Client --> InputMgr
    InputMgr --> GameLoop
    
    GameLoop --> Raycaster
    Raycaster --> Mirrors
    Raycaster --> Prisms
    Raycaster --> Crates
    Prisms --> Receptors
    Raycaster --> GuardAI
    
    GameLoop --> CharController
    CharController --> GraceSystem
    GameLoop --> GuardAI
    
    GameLoop --> AudioSynth
    GameLoop --> HUD
    HUD --> CharCards
    HUD --> TimerPill

    GameLoop --> Progression
    Progression --> Overlay
    Progression --> LevelModal
    Progression --> SaveMgr
    LevelModal --> SaveMgr
    SaveMgr --> Storage
```
