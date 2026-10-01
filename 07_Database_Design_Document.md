# 07. Database Design Document (DDD)

**Project Title:** LIGHT & SHADOW (Two Souls. One Heist.)  
**Repository Directory:** `/home/meoclavezz/Projects/P-Game`  
**Phase:** Phase 3 – Design & Planning  
**Date:** August 2026  
**Last Updated:** October 1, 2026 (level schema & `localStorage` persistence implemented)  

---

## 1. Executive Summary

The **LIGHT & SHADOW** database and data storage architecture manages level map layouts, entity configurations, user progression state, high scores, and audio preferences. Given the web client architecture, data storage is divided into two primary layers:
1. **Static Level Data Schema (JSON):** Immutable declarative structures defining level layouts, walls, optics, light sources, guards, loot, and exit coordinates. In `game.js` these live in a single `LEVELS` constant; `loadLevel()` deep-copies a level and adds runtime-only state (see §3.6).
2. **Dynamic Client State & Storage (`localStorage`):** Persistent client data storing unlocked levels, best completion times, star ratings, and audio mute settings.

---

## 2. Logical Data Model & ER Diagram

```
+------------------+         1 : N         +-------------------+
|      LEVEL       | --------------------< |    LIGHT SOURCE   |
+------------------+                       +-------------------+
| level_id (PK)    |                       | source_id (PK)    |
| title            |                       | type, x, y        |
| light_start_x, y |                       | angle, fov, range |
| shadow_start_x,y |                       | rotate_speed      |
| exit_x, exit_y   |                       | sweep {amp, speed}|
| desc, par_time   |                       +-------------------+
+------------------+
         |
         | 1 : N             1 : N         +-------------------+
         +-------------------------------< |       WALL        |
         |                                 +-------------------+
         |                                 | wall_id (PK)      |
         |                                 | x, y, w, h        |
         |                                 +-------------------+
         |
         | 1 : N             1 : N         +-------------------+
         +-------------------------------< |      MIRROR       |
         |                                 +-------------------+
         |                                 | mirror_id (PK)    |
         |                                 | x, y, angle       |
         |                                 | spread            |
         +---------------------------------+-------------------+
         |
         | 1 : N             1 : N         +-------------------+
         +-------------------------------< |     PRISM / GATE  |
         |                                 +-------------------+
         |                                 | gate_id (PK)      |
         |                                 | req_color, open   |
         |                                 | receptor {x, y}   |
         |                                 | prism: 30x30 solid|
         |                                 +-------------------+
         |
         | 1 : N             1 : N         +-------------------+
         +-------------------------------< |     GUARD AI      |
                                           +-------------------+
                                           | guard_id (PK)     |
                                           | type, x, y, speed |
                                           | patrol_points     |
                                           +-------------------+
```

---

## 3. Data Dictionary & Field Specifications

### 3.1 `LEVEL` Table / Object
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `level_id` | Integer | Primary Key | Unique level index (0, 1, 2, 3...) |
| `title` | String | Not Null | Descriptive level title |
| `lightStart` | Point `{x, y}` | Not Null | Initial spawn coordinates for Lightwalker |
| `shadowStart`| Point `{x, y}` | Not Null | Initial spawn coordinates for Shadowweaver |
| `loot` | Object | Not Null | Location `{x, y}` and `taken` boolean status |
| `exit` | Point `{x, y}` | Not Null | Level exit portal coordinates (twilight zone, radius 45 px) |
| `desc` | String | Not Null | Short mission blurb shown on the Level Select card |
| `objective` | String | Not Null | Objective banner text shown while the loot is not yet taken |
| `parTime` | Float | Not Null, > 0 | Target (par) completion time in seconds (L1 25, L2 45, L3 45, L4 60); drives the star rating |

### 3.2 `LIGHT_SOURCE` Table / Object
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `source_id` | String | Primary Key | Unique light source identifier |
| `type` | Enum | `'spotlight'`, `'lamp'` | Type of light emitter |
| `x, y` | Float | Not Null | Center emission coordinates |
| `angle` | Float | $0 \le \theta < 2\pi$ | Direction angle in radians |
| `fov` | Float | Not Null | Beam Spread Field of View in radians |
| `range` | Float | Not Null | Beam reach distance in pixels |
| `rotateSpeed`| Float | Nullable | Angular rotation velocity in rad/sec (continuous spin) |
| `sweep` | Object `{amplitude, speed}` | Nullable | Pendulum swing: $\theta = \theta_{\text{base}} + \text{amplitude}\cdot\sin(t \cdot \text{speed})$ |

### 3.3 `MIRROR` & `PRISM` Objects
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `mirror_id` | String | Mirror identifier |
| `x, y` | Float | Center position |
| `angle` | Float | Surface plane angle in radians (rotated in $22.5^\circ$ steps over $0$–$180^\circ$) |
| `spread` | Float | Optional (mirror). Reflected cone width in radians, default `0.25` |
| `prism x, y` | Float | Prism center. Prisms are solid 30×30 glass blocks that block movement and white light; when lit they emit Red/Green/Blue 40 px bands (offsets −0.45 / 0 / +0.45 rad, range 650 px) |

### 3.4 `GATE` Object
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | String | Gate identifier (e.g. `gate-red`) |
| `x, y, w, h` | Float | Gate rectangle (solid while closed) |
| `color` | String | Render colour (hex) |
| `reqColor` | Enum `'RED'`, `'GREEN'`, `'BLUE'` | Spectrum band colour that unlocks the gate |
| `receptor` | Point `{x, y}` | Colour receptor; the gate opens when a band of `reqColor` covers this point and stays open (latched) until the level restarts |

### 3.5 `GUARD` & `CRATE` Objects
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `type` | Enum `'LUMEN'`, `'NYX'` | Guard type |
| `x, y` | Float | Guard start position |
| `patrol` | Array of Point | Patrol waypoints |
| `speed` | Float | Patrol speed (scaled by `dt`) |
| `crate x, y, w, h` | Float | Solid pushable crate rectangle |

### 3.6 Runtime-Only State (added by `loadLevel()`, never authored)
| Object | Fields |
| :--- | :--- |
| Gate | `open` (Boolean, latched) |
| Guard | `dir` (patrol index), `angle`, `stunTimer` |
| Loot | `taken` (Boolean) |
| Light Source | `baseAngle`, `time` (for `sweep` / `rotateSpeed` animation) |

---

## 4. LocalStorage Persistence Schema

Player progression is cached locally using standard JSON serialization under the key `LIGHT_SHADOW_SAVEDATA`:

```json
{
  "unlockedLevelIndex": 3,
  "highScores": {
    "level_0": { "completed": true, "bestTimeSeconds": 14.2, "stars": 3 },
    "level_1": { "completed": true, "bestTimeSeconds": 28.5, "stars": 2 },
    "level_2": { "completed": true, "bestTimeSeconds": 42.1, "stars": 3 }
  },
  "audioSettings": {
    "muted": false,
    "volume": 0.8
  }
}
```

### 4.1 Persistence Rules
| Rule | Behaviour |
| :--- | :--- |
| **Fresh profile** | `{"unlockedLevelIndex": 0, "highScores": {}, "audioSettings": {"muted": false, "volume": 0.8}}` — only Mission 1 is playable. |
| **When written** | On every level win (via `SaveManager.save`), on mute toggle, and on **Reset Progress**. |
| **Score update** | `completed` is set to `true`; `bestTimeSeconds` keeps the lower of the old and new time (rounded to 0.1 s); `stars` keeps the higher of the old and new rating. |
| **Star rating** | 1 = completed; 2 = within `parTime`; 3 = within `parTime` with zero rewinds. Campaign maximum 12. |
| **Unlock rule** | Clearing level *i* sets `unlockedLevelIndex = max(unlockedLevelIndex, min(i + 1, lastLevelIndex))`. |
| **Corrupt / blocked data** | Unparseable JSON or an unavailable `localStorage` falls back to a fresh profile (the game still runs); `unlockedLevelIndex` is clamped to the valid level range. If writing fails, progress lasts for the current session only. |
| **Resume rule** | On page load the game starts at the first unlocked mission that is not yet completed (or Mission 1 if every unlocked mission is completed). |
| **Reset Progress** | Level Select button (with confirmation) that restores the fresh profile (keeping audio settings) and reloads Mission 1. |
