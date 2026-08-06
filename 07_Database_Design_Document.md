# 07. Database Design Document (DDD)

**Project Title:** LIGHT & SHADOW (Two Souls. One Heist.)  
**Repository Directory:** `/home/meoclavezz/Projects/P-Game`  
**Phase:** Phase 3 – Design & Planning  
**Date:** August 2026  

---

## 1. Executive Summary

The **LIGHT & SHADOW** database and data storage architecture manages level map layouts, entity configurations, user progression state, high scores, and audio preferences. Given the web client architecture, data storage is divided into two primary layers:
1. **Static Level Data Schema (JSON):** Immutable declarative structures defining level layouts, walls, optics, light sources, guards, loot, and exit coordinates.
2. **Dynamic Client State & Storage (`localStorage`):** Persistent client data storing unlocked levels, best completion times, audio mute settings, and session save states.

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
| exit_x, exit_y   |                       +-------------------+
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
         +---------------------------------+-------------------+
         |
         | 1 : N             1 : N         +-------------------+
         +-------------------------------< |     PRISM / GATE  |
         |                                 +-------------------+
         |                                 | gate_id (PK)      |
         |                                 | req_color, open   |
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
| `exit` | Point `{x, y}` | Not Null | Level exit portal coordinates |

### 3.2 `LIGHT_SOURCE` Table / Object
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `source_id` | String | Primary Key | Unique light source identifier |
| `type` | Enum | `'spotlight'`, `'lamp'` | Type of light emitter |
| `x, y` | Float | Not Null | Center emission coordinates |
| `angle` | Float | $0 \le \theta < 2\pi$ | Direction angle in radians |
| `fov` | Float | Not Null | Beam Spread Field of View in radians |
| `range` | Float | Not Null | Beam reach distance in pixels |
| `rotateSpeed`| Float | Nullable | Angular rotation velocity in rad/sec |

### 3.3 `MIRROR` & `PRISM` Objects
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `mirror_id` | String | Mirror identifier |
| `x, y` | Float | Center position |
| `angle` | Float | Surface plane angle in radians |

---

## 4. LocalStorage Persistence Schema

Player progression is cached locally using standard JSON serialization under the key `LIGHT_SHADOW_SAVEDATA`:

```json
{
  "unlockedLevelIndex": 3,
  "highScores": {
    "level_0": { "bestTimeSeconds": 14.2, "completed": true },
    "level_1": { "bestTimeSeconds": 28.5, "completed": true },
    "level_2": { "bestTimeSeconds": 42.1, "completed": true }
  },
  "audioSettings": {
    "muted": false,
    "volume": 0.8
  }
}
```
