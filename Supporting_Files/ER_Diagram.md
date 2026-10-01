# Supporting File: ER Diagram & Data Schema

```mermaid
erDiagram
    LEVEL ||--|{ LIGHT_SOURCE : contains
    LEVEL ||--|{ WALL : contains
    LEVEL ||--|{ MIRROR : contains
    LEVEL ||--|{ PRISM : contains
    LEVEL ||--|{ GATE : contains
    LEVEL ||--|{ CRATE : contains
    LEVEL ||--|{ GUARD : contains
    LEVEL ||--|| LOOT : contains
    LEVEL ||--|| EXIT : contains
    GATE ||--|| RECEPTOR : "unlocked by"
    ACCOUNT ||--|| SAVE_DATA : owns
    ACCOUNT ||--o{ SESSION : "signed in via"
    SAVE_DATA ||--o{ LEVEL_SCORE : records
    SAVE_DATA ||--o| IN_PROGRESS_SNAPSHOT : "resumes from"
    SAVE_DATA ||--|| SETTINGS : "stores controls"
    LEVEL ||--o{ IN_PROGRESS_SNAPSHOT : "snapshot of"
    LEVEL ||--o| LEVEL_SCORE : "scored in"

    LEVEL {
        int level_id PK
        string title
        string desc
        float parTime
        string objective
        point lightStart
        point shadowStart
    }

    LIGHT_SOURCE {
        string source_id PK
        string type
        float x
        float y
        float angle
        float fov
        float range
        float rotateSpeed
        float sweepAmplitude
        float sweepSpeed
    }

    WALL {
        string wall_id PK
        float x
        float y
        float w
        float h
    }

    MIRROR {
        string mirror_id PK
        float x
        float y
        float angle
        float radius
        float spread
    }

    PRISM {
        string prism_id PK
        float x
        float y
        float angle
        float size "solid 30x30 glass block"
    }

    GATE {
        string gate_id PK
        float x
        float y
        float w
        float h
        string color
        string reqColor
        boolean open "latched once lit"
    }

    RECEPTOR {
        float x
        float y
    }

    CRATE {
        string crate_id PK
        float x
        float y
        float w
        float h
    }

    GUARD {
        string guard_id PK
        string type
        float x
        float y
        float speed
        float angle
        float stunTimer
        array patrol_points
    }

    LOOT {
        float x
        float y
        boolean taken
    }

    EXIT {
        float x
        float y
        float radius "45 px twilight zone"
    }

    ACCOUNT {
        string username PK "lowercase key, 3-16 chars A-Z a-z 0-9 _"
        string displayName "username as typed"
        string salt "random 16 bytes, hex"
        string hash "SHA-256 x2000, never the password"
        int createdAt
        int lastLogin
    }

    SESSION {
        string username FK
        string storage "sessionStorage, or localStorage if Stay signed in"
    }

    SAVE_DATA {
        string storageKey PK "LIGHT_SHADOW_SAVEDATA::username"
        string username FK
        int unlockedLevelIndex
        int lastLevelIndex "mission to open next time"
        boolean muted
        float volume
        boolean music "ambient soundtrack on/off"
    }

    SETTINGS {
        string touchControls "auto, on or off (default auto)"
        boolean tilt "tilt to move (default false)"
        string tiltSensitivity "low, medium or high (default medium)"
        boolean leftHanded "mirrored touch layout (default false)"
        boolean vibration "haptics (default true)"
    }

    IN_PROGRESS_SNAPSHOT {
        int levelIndex FK
        float levelTime
        int rewindsUsed
        string activeCharacter "LIGHT or SHADOW"
        point light
        point shadow
        array mirrors "angles"
        array crates "positions"
        array gates "open flags"
        array guards "x, y, dir, angle, stunTimer"
        array lights "angle, time"
        boolean lootTaken
        int savedAt
    }

    LEVEL_SCORE {
        string levelKey PK "level_N"
        boolean completed
        float bestTimeSeconds
        int stars "1 to 3"
    }
```
