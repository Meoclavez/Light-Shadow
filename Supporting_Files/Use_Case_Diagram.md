# Supporting File: Use Case Diagram

```mermaid
graph LR
    subgraph Actors
        Player(("Player / Co-op Players"))
        GuardAI(("Guard AI Engine"))
    end
    
    subgraph LIGHT & SHADOW Game System
        UC1(["Select / Swap Active Character"])
        UC2(["Move Active Character (WASD)"])
        UC3(["Rotate Mirror / Push Crate"])
        UC4(["Refract Light through Prism"])
        UC5(["Steal Loot Artifact"])
        UC6(["Trigger Grace Period / Rewind"])
        UC7(["Reach Exit Portal"])
        
        UC8(["Patrol Designated Path"])
        UC9(["Detect Player in Vision Cone"])
        UC10(["Get Stunned by Any Light"])
        UC11(["Trigger Alarm / Level Reset"])
        
        UC12(["View Mission Results & Stars"])
        UC13(["Select Unlocked Mission"])
        UC14(["Reset Progress"])
        UC15(["Replay Campaign (Play Again)"])

        UC16(["Create Account"])
        UC17(["Sign In"])
        UC18(["Switch Account / Sign Out"])
        UC19(["Remove Account (Password Required)"])
        UC20(["Continue Saved Heist (Welcome Back)"])
        UC21(["Pause / Resume"])
        UC22(["Toggle Music"])

        UC23(["Move with Touch Joystick"])
        UC24(["Steer by Tilt"])
        UC25(["Calibrate Tilt"])
        UC26(["Change Settings"])
        UC27(["Toggle Full Screen"])
        UC28(["Tap SWAP / ROTATE / UNDO"])
    end
    
    Player --> UC1
    Player --> UC2
    Player --> UC3
    Player --> UC4
    Player --> UC5
    Player --> UC6
    Player --> UC7
    Player --> UC12
    Player --> UC13
    Player --> UC14
    Player --> UC15
    Player --> UC16
    Player --> UC17
    Player --> UC18
    Player --> UC19
    Player --> UC20
    Player --> UC21
    Player --> UC22
    Player --> UC23
    Player --> UC24
    Player --> UC25
    Player --> UC26
    Player --> UC27
    Player --> UC28
    
    GuardAI --> UC8
    GuardAI --> UC9
    GuardAI --> UC10
    
    UC9 --> UC11
    UC10 -. Stuns AI .-> UC8
    UC7 -.->|"requires loot (exit sealed)"| UC5
    UC7 -.->|"both souls escape"| UC12
    UC20 -.->|"requires signed-in account"| UC17
    UC16 -.->|"signs in"| UC17
    UC20 -.->|"opens paused"| UC21
    UC18 -.->|"saves snapshot first"| UC20
    UC23 -.->|"analog move"| UC2
    UC24 -.->|"analog move"| UC2
    UC28 -.->|"same actions"| UC1
    UC28 -.-> UC3
    UC28 -.-> UC6
    UC24 -.->|"requires tilt on"| UC26
    UC25 -.->|"extends"| UC24
    UC23 -.->|"overrides"| UC24
```
