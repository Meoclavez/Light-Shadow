# 07. Database Design Document (DDD)

**Project Title:** LIGHT & SHADOW (Two Souls. One Heist.)  
**Repository Directory:** `/home/meoclavezz/Projects/P-Game`  
**Phase:** Phase 3 – Design & Planning  
**Date:** August 2026  
**Last Updated:** October 1, 2026 (level schema & `localStorage` persistence implemented; player accounts, sessions, per-account saves & mid-level snapshots; per-account control settings for touch, tilt & vibration)  

---

## 1. Executive Summary

The **LIGHT & SHADOW** database and data storage architecture manages level map layouts, entity configurations, user progression state, high scores, and audio preferences. Given the web client architecture, data storage is divided into two primary layers:
1. **Static Level Data Schema (JSON):** Immutable declarative structures defining level layouts, walls, optics, light sources, guards, loot, and exit coordinates. In `game.js` these live in a single `LEVELS` constant; `loadLevel()` deep-copies a level and adds runtime-only state (see §3.6).
2. **Dynamic Client State & Storage (`localStorage` / `sessionStorage`):** Persistent client data storing player accounts and sessions, and, per account, unlocked levels, best completion times, star ratings, the last mission played, a mid-level snapshot for "continue where you left off", audio settings (mute, volume), and control settings (touch controls, tilt, tilt sensitivity, left-handed layout, vibration).

There is no server-side database: the game is deployed as a static site, so all dynamic data lives in the player's browser and exists only on the device where it was created.

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

Player-side data (browser storage, one save slot per account):

```
+------------------+  1 : 1  +--------------------+  1 : 0..1  +----------------------+
|     ACCOUNT      | ------- |     SAVE_DATA      | ---------- | IN_PROGRESS_SNAPSHOT |
+------------------+         +--------------------+            +----------------------+
| username (PK,    |         | storageKey (PK)    |            | levelIndex (FK LEVEL)|
|  lowercase key)  |         | unlockedLevelIndex |            | levelTime, rewinds   |
| salt, hash       |         | lastLevelIndex     |            | activeCharacter      |
| createdAt        |         | audioSettings      |            | positions, mirrors,  |
| lastLogin        |         | settings (controls)|            | crates, gates,       |
+------------------+         +--------------------+            | guards, lights, loot |
                                      |                        +----------------------+
                                      | 1 : N
                                      v
                             +--------------------+
                             |    LEVEL_SCORE     |
                             | level_N, completed |
                             | bestTime, stars    |
                             +--------------------+
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

Player progression is cached locally using standard JSON serialization. Each signed-in account has its own save slot under the key **`LIGHT_SHADOW_SAVEDATA::<lowercase username>`** (e.g. `LIGHT_SHADOW_SAVEDATA::nightfox`), built by `LightShadowAuth.saveKeyFor()`. The original shared key `LIGHT_SHADOW_SAVEDATA` is used only when no auth module or session exists (e.g. the headless Node tests). Example of an account that has cleared Mission 1 and left Mission 2 mid-heist:

```json
{
  "unlockedLevelIndex": 1,
  "lastLevelIndex": 1,
  "highScores": {
    "level_0": { "completed": true, "bestTimeSeconds": 14.2, "stars": 3 }
  },
  "inProgress": {
    "levelIndex": 1,
    "levelTime": 12.4,
    "rewindsUsed": 0,
    "activeCharacter": "SHADOW",
    "light": { "x": 810, "y": 255 },
    "shadow": { "x": 260, "y": 590 },
    "mirrors": [],
    "crates": [],
    "gates": [],
    "guards": [
      { "x": 380, "y": 120, "dir": 1, "angle": 1.57, "stunTimer": 0 },
      { "x": 760, "y": 400, "dir": 0, "angle": -1.57, "stunTimer": 0 }
    ],
    "lights": [ { "angle": 0, "time": 12.4 }, { "angle": 2.1, "time": 12.4 } ],
    "lootTaken": true,
    "savedAt": 1759300000000
  },
  "audioSettings": {
    "muted": false,
    "volume": 0.8
  },
  "settings": {
    "touchControls": "auto",
    "tilt": false,
    "tiltSensitivity": "medium",
    "leftHanded": false,
    "vibration": true
  }
}
```

| Field | Type | Description |
| :--- | :--- | :--- |
| `unlockedLevelIndex` | Integer (0–3) | Highest unlocked mission index (clamped to the valid range on load) |
| `lastLevelIndex` | Integer or `null` | Mission to open next time: set on every fresh level load; after a win, the next mission (0 after the final win) |
| `highScores` | Object `level_N → {completed, bestTimeSeconds, stars}` | Per-mission best result (see §4.1) |
| `inProgress` | Snapshot object or `null` | Mid-level snapshot for "continue where you left off" (§4.2) |
| `audioSettings.muted` | Boolean | 🔊 master mute |
| `audioSettings.volume` | Float 0–1 | Master volume (default 0.8) |
| `settings` | Object | Control preferences from the ⚙️ Settings modal (§4.3) |

#### `inProgress` Snapshot Fields
| Field | Type | Description |
| :--- | :--- | :--- |
| `levelIndex` | Integer | Mission being played |
| `levelTime` | Float (s, 0.01 precision) | Elapsed mission time |
| `rewindsUsed` | Integer | Rewinds so far (affects ★★★) |
| `activeCharacter` | `'LIGHT'` / `'SHADOW'` | Soul in control |
| `light`, `shadow` | Point `{x, y}` | Positions of both souls |
| `mirrors` | Array of Float | Mirror angles, in level order |
| `crates` | Array of Point `{x, y}` | Crate positions, in level order |
| `gates` | Array of Boolean | Gate `open` flags (latched), in level order |
| `guards` | Array of `{x, y, dir, angle, stunTimer}` | Guard position, patrol index, facing and stun time left |
| `lights` | Array of `{angle, time}` | Light-source angle and animation phase (rotating / pendulum lights) |
| `lootTaken` | Boolean | Whether the loot has been stolen |
| `savedAt` | Integer (epoch ms) | When the snapshot was written |

### 4.1 Persistence Rules
| Rule | Behaviour |
| :--- | :--- |
| **Fresh profile** | `{"unlockedLevelIndex": 0, "lastLevelIndex": null, "highScores": {}, "inProgress": null, "audioSettings": {"muted": false, "volume": 0.8}, "settings": {"touchControls": "auto", "tilt": false, "tiltSensitivity": "medium", "leftHanded": false, "vibration": true}}` — only Mission 1 is playable. Each new account starts with a fresh profile. |
| **When written** | On every level win and fail, on every fresh level load/restart, on mute toggle, on every Settings change, on **Reset Progress**, and whenever the snapshot is saved (§4.2). |
| **Score update** | `completed` is set to `true`; `bestTimeSeconds` keeps the lower of the old and new time (rounded to 0.1 s); `stars` keeps the higher of the old and new rating. |
| **Star rating** | 1 = completed; 2 = within `parTime`; 3 = within `parTime` with zero rewinds. Campaign maximum 12. |
| **Unlock rule** | Clearing level *i* sets `unlockedLevelIndex = max(unlockedLevelIndex, min(i + 1, lastLevelIndex))`. |
| **Corrupt / blocked data** | Unparseable JSON or an unavailable `localStorage` falls back to a fresh profile (the game still runs); `unlockedLevelIndex` is clamped to the valid level range. If writing fails, progress lasts for the current session only. |
| **Resume rule** | On page load: (1) a valid `inProgress` snapshot is restored and the game opens `PAUSED` on *WELCOME BACK, NAME!*; (2) otherwise `lastLevelIndex` is opened if it is unlocked; (3) otherwise the first unlocked mission that is not yet completed (or Mission 1 if every unlocked mission is completed). Cases 2–3 show a welcome toast. |
| **Reset Progress** | Level Select button (with confirmation) that restores the fresh profile (keeping audio and control settings) for the signed-in account only and reloads Mission 1. |
| **Account isolation** | Every read/write goes to the signed-in account's key, so accounts on the same device never share unlocks, stars, times or snapshots. Removing an account deletes its save key. |

### 4.2 Snapshot (`inProgress`) Rules
| Event | Effect on `inProgress` |
| :--- | :--- |
| Every 2 s while `PLAYING` | Written (fresh snapshot) |
| Pause (`P` / `Esc` / ⏸️) | Written |
| Browser tab hidden | Game auto-pauses; written |
| `pagehide` (tab closed / navigated away) | Written while `PLAYING` or `PAUSED` |
| **Sign Out** | Written, then the session ends |
| Level win | Cleared (`null`); `lastLevelIndex` → next mission (0 after the final win) |
| Level fail | Cleared (`null`): a failed attempt restarts the mission fresh next time |
| Fresh level load / restart / Level Select pick | Cleared (`null`); `lastLevelIndex` → that level |
| **Restore check** | Used only if the level exists and is unlocked, both soul positions exist, and the `mirrors` / `crates` / `gates` / `guards` / `lights` array lengths still match the level data (otherwise ignored, so a level redesign can never load a broken state) |

### 4.3 Control Settings (`settings`)
Written by the ⚙️ Settings modal (`mobile.js`) through `engine.saveSettings()`, into the same per-account save slot, so each player on a device keeps their own control preferences.

| Field | Type | Allowed Values | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `touchControls` | Enum String | `'auto'`, `'on'`, `'off'` | `'auto'` | On-screen joystick and buttons: *auto* shows them only on touch screens |
| `tilt` | Boolean | `true` / `false` | `false` | Tilt to move (DeviceOrientation). Saved as `true` only after tilt was successfully enabled (iOS permission granted) |
| `tiltSensitivity` | Enum String | `'low'`, `'medium'`, `'high'` | `'medium'` | Tilt needed for full speed: 28° / 18° / 11° |
| `leftHanded` | Boolean | `true` / `false` | `false` | Mirrors the touch layout (joystick right, buttons left) |
| `vibration` | Boolean | `true` / `false` | `true` | Haptic feedback via `navigator.vibrate` (ignored where unsupported, e.g. iOS Safari) |

| Rule | Behaviour |
| :--- | :--- |
| **Load / migration** | Saves written before this field existed get the defaults; stored keys are merged over the defaults (`Object.assign`), so missing keys keep their default value. |
| **Not stored** | The tilt calibration (neutral pose) is session-only: it is re-taken from the first sensor reading after tilt starts, after every orientation change, or via **Calibrate**. iOS motion permission is granted by the browser per session, not stored by the game. |
| **Reset Progress** | Restores the fresh profile but carries over `audioSettings` and `settings` (control preferences are kept, and the same object stays linked to the open Settings panel) (§4.1). |

---

## 5. Accounts & Session Storage

### 5.1 `LIGHT_SHADOW_ACCOUNTS` (`localStorage`)
```json
{
  "users": {
    "nightfox": {
      "username": "NightFox",
      "salt": "9f2c4e1a7b3d5f60a1b2c3d4e5f60718",
      "hash": "<64 hex chars>",
      "createdAt": 1759290000000,
      "lastLogin": 1759300000000
    }
  }
}
```

| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| *(map key)* | String | Primary Key, lowercase | Case-insensitive account id (`username.toLowerCase()`) |
| `username` | String | 3–16 chars `[A-Za-z0-9_]`, unique ignoring case | Display name as typed at sign-up |
| `salt` | String (32 hex) | Not Null | Random 16-byte salt (`crypto.getRandomValues`) |
| `hash` | String (64 hex) | Not Null | SHA-256 of `salt:password`, then re-hashed with the salt for 2000 rounds in total. The password itself is never stored. Password minimum length: 4 |
| `createdAt` | Integer (epoch ms) | Not Null | Account creation time |
| `lastLogin` | Integer (epoch ms) | Not Null | Last sign-in; the login screen lists accounts most recent first |

Each account **owns exactly one** save slot `LIGHT_SHADOW_SAVEDATA::<map key>` (§4).

### 5.2 Session & UI Keys
| Key | Storage | Value | Purpose |
| :--- | :--- | :--- | :--- |
| `LIGHT_SHADOW_SESSION` | `sessionStorage` | `{"username": "NightFox"}` | Signed-in player for this tab (always written on sign-in) |
| `LIGHT_SHADOW_SESSION` | `localStorage` | `{"username": "NightFox"}` | Written only when *Stay signed in on this device* is ticked (default); removed otherwise and on Sign Out |
| `LIGHT_SHADOW_SAVEDATA::<user>` | `localStorage` | Save JSON (§4) | Per-account progress |
| `LIGHT_SHADOW_SAVEDATA` | `localStorage` | Save JSON (§4) | Legacy/shared slot, used only without auth/session (headless tests) |
| `LIGHT_SHADOW_UI_MUTED` | `localStorage` | `"1"` / `"0"` | Login-page UI sound toggle |

### 5.3 Account Rules
| Rule | Behaviour |
| :--- | :--- |
| **Register** | Validates username/password, rejects a name already taken (case-insensitive), stores salt + hash, starts a session. |
| **Login** | Recomputes the hash with the stored salt and compares; on success updates `lastLogin` and starts a session. Errors never reveal which part was wrong (*"Wrong username or password."*). |
| **Current user** | `sessionStorage` first, then `localStorage`; a session whose account no longer exists is ignored. |
| **Remove account** | Requires that account's password; deletes the account entry and its save key, and ends the session if it was the signed-in account. |
| **Logout** | Removes `LIGHT_SHADOW_SESSION` from both storages (progress is kept). |
| **Blocked storage** | Registration reports that the browser blocks storage; corrupt account data falls back to an empty account list. |
| **Security limitation** | Browser-only convenience login for a static site: anyone with access to the browser storage can delete or reset accounts. Players should not reuse a real password. |
