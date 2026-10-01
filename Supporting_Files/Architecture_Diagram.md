# Supporting File: System Architecture Diagram

```mermaid
graph TD
    Vercel["Vercel Static Hosting (vercel.json: cleanUrls + Security Headers; .vercelignore)"]
    Client["LIGHT & SHADOW Game Page (game.html + game.js)"]

    subgraph LoginLayer["Login Page & Accounts"]
        LoginPage["Login Page (index.html / login.css / login.js)"]
        LoginFx["Animated Light & Shadow Background + UI Sounds"]
        AccountPicker["Players on this Device (Progress Chips, Remove with Password)"]
        Auth["Auth Module (auth.js, window.LightShadowAuth): Salted SHA-256 x2000"]
        Guard["Session Guard on game.html (location.replace to Login)"]
        AccStore[("localStorage: LIGHT_SHADOW_ACCOUNTS")]
        SessStore[("sessionStorage / localStorage: LIGHT_SHADOW_SESSION")]
    end

    subgraph User Interface Layer
        HUD["Glassmorphic HUD (game.html / style.css)"]
        HeaderCtrls["Header: Player Badge, Pause, Settings, Full Screen, Music, Sound, Sign Out"]
        SettingsModal["Settings Modal (Touch Controls, Tilt, Sensitivity, Calibrate, Left-Handed, Vibration)"]
        TouchUI["Touch Controls UI (Joystick Zone, SWAP / ROTATE / UNDO, Portrait & Landscape Layouts)"]
        Feedback["Intro Title Card, Toasts, Page Fades"]
        CharCards["Character HUD Cards (Lightwalker & Shadowweaver)"]
        LevelModal["Level Selector Modal (Locks, Stars, Best Times, Reset Progress)"]
        Overlay["Pause / Welcome Back / Victory / Defeat / Campaign Complete Overlay"]
        TimerPill["HUD Timer Pill (Elapsed / Target) & Objective Banner"]
    end

    subgraph Input & Controllers
        InputMgr["Input & Event Manager (WASD, Tab, Space, E, Z, R, Enter, P, Esc, Tab Hidden)"]
        GameLoop["Game Loop Controller (requestAnimationFrame)"]
        Progression["Progression / Campaign Controller (PLAYING, PAUSED, WIN, FAIL, CAMPAIGN_COMPLETE)"]
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

    subgraph MobileLayer["Mobile Controls (mobile.js)"]
        Mobile["MobileControls (Optional Module, update every frame)"]
        Joystick["Floating Analog Joystick (Pointer Events, 52 px = Full Speed)"]
        Tilt["Tilt Steering (Orientation Mapping, Calibration, Dead Zone, Smoothing)"]
        CanvasFit["Responsive Canvas Fit (900x650 Scaled, ResizeObserver)"]
        DevOrient[["DeviceOrientation API (iOS Permission on Tap)"]]
        Vibrate[["Vibration API (navigator.vibrate)"]]
        Fullscreen[["Fullscreen API + Orientation Lock"]]
    end

    subgraph Persistence Layer
        SaveMgr["SaveManager (Per-Account Save Key)"]
        Snapshot["Snapshot Autosave & Restore (Every 2 s, Pause, Tab Hidden, Page Hide, Sign Out)"]
        Storage[("Browser localStorage: LIGHT_SHADOW_SAVEDATA::username")]
    end

    subgraph Audio Engine
        AudioSynth["Procedural Web Audio Synthesizer"]
        Soundtrack["Adaptive Ambient Soundtrack (Light / Shadow Crossfade)"]
    end

    Vercel --> LoginPage
    Vercel --> Client
    LoginPage --> LoginFx
    LoginPage --> AccountPicker
    LoginPage --> Auth
    AccountPicker --> Auth
    Auth --> AccStore
    Auth --> SessStore
    LoginPage -->|"signed in"| Client
    Client --> Guard
    Guard --> Auth
    Guard -. "no session" .-> LoginPage
    HeaderCtrls -. "Sign Out" .-> LoginPage

    Client --> HUD
    HUD --> HeaderCtrls
    HUD --> Feedback
    Client --> InputMgr
    InputMgr -->|"engine.keys (priority 1)"| GameLoop
    Client --> Mobile
    Mobile --> TouchUI
    TouchUI --> Joystick
    DevOrient --> Tilt
    Mobile --> Tilt
    Joystick -->|"engine.analogInput (priority 2)"| GameLoop
    Tilt -->|"engine.analogInput (priority 3)"| GameLoop
    TouchUI -->|"swap / interact / rewind"| GameLoop
    Mobile --> CanvasFit
    CanvasFit --> HUD
    HeaderCtrls --> SettingsModal
    HeaderCtrls -. "full screen" .-> Fullscreen
    SettingsModal --> Mobile
    SettingsModal -->|"settings"| SaveMgr
    GameLoop -. "haptic(pattern)" .-> Vibrate
    
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
    AudioSynth --> Soundtrack
    CharController -. "soul swap" .-> Soundtrack
    GameLoop --> HUD
    HUD --> CharCards
    HUD --> TimerPill

    GameLoop --> Progression
    Progression --> Overlay
    Progression --> LevelModal
    Progression --> SaveMgr
    LevelModal --> SaveMgr
    GameLoop --> Snapshot
    Snapshot --> SaveMgr
    SaveMgr -->|"saveKeyFor(user)"| Auth
    SaveMgr --> Storage
```
