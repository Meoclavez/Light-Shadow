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
    SAVE_DATA ||--o{ LEVEL_SCORE : records
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

    SAVE_DATA {
        string storageKey PK "LIGHT_SHADOW_SAVEDATA"
        int unlockedLevelIndex
        boolean muted
        float volume
    }

    LEVEL_SCORE {
        string levelKey PK "level_N"
        boolean completed
        float bestTimeSeconds
        int stars "1 to 3"
    }
```
