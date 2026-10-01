# Supporting File: UI/UX Wireframes Blueprint

```
===================================================================================
                                LIGHT & SHADOW UI WIREFRAME
===================================================================================

+---------------------------------------------------------------------------------+
| [LOGO] LIGHT & SHADOW | LEVEL 1: The Basics | [💎 LOOT 0/1] [⏱️ 0:12.4 / 0:25.0] |
|                                               [⚠️ GRACE 100%] [🔊][↩️][🔄][Levels]|
+---------------------------------------------------------------------------------+
| OBJECTIVE: <level objective>  ->  after loot: "Loot secured! The exit portal..."|
+---------------------------------------------------------------------------------+
| SIDEBAR (320px)                   | MAIN VIEWPORT CANVAS (900x650)              |
|                                   |                                             |
| +-------------------------------+ | +-----------------------------------------+ |
| | ☀️ LIGHTWALKER  [LIGHT ONLY]  | | | (Lamp)                                  | |
| | Move in illuminated light     | | |  \                                      | |
| | beams. Shadow is a void.      | | |   \ (Light Cone)                        | |
| +-------------------------------+ | |    \                                     | |
|                                   | |     [☀️ Player]                           | |
| +-------------------------------+ | |      \                                    | |
| | 🌙 SHADOWWEAVER [DARK ONLY]   | | |       \                                   | |
| | Move in dark areas.           | | |========(Wall)===========================| |
| | Light is a solid wall.        | | |                [🌙 Player]              | |
| +-------------------------------+ | |                 (Shadow Area)           | |
|                                   | |                                [💎 Loot]| |
| +-------------------------------+ | | [🔒 EXIT] grey -> green after loot       | |
| |   [ SWAP CHARACTER (TAB) ]    | | +-----------------------------------------+ |
| +-------------------------------+ |                                             |
|                                   | +-----------------------------------------+ |
| | CONTROLS                        | | MISSION ACCOMPLISHED! / HEIST COMPLETE! | |
| | W A S D : Move                  | | Time      0:14.2 (new best!)            | |
| | TAB     : Swap Soul             | | Target    0:25.0 ✔                      | |
| | E       : Rotate Mirror         | | Best      0:14.2                        | |
| | Z       : Undo Step             | | Rewinds   0                             | |
| | R       : Restart Level         | | Rating    ★★★                           | |
| | ENTER   : Next Level (win)      | | (final level adds: Heist total (best),  | |
| | ESC     : Close Level Select    | |  Campaign stars X / 12)                 | |
|                                   | | [Next Level ➔] [Replay Level] [Levels]  | |
|                                   | | (Play Again ⟲ on HEIST COMPLETE;        | |
|                                   | |  Try Again / Levels on failure)         | |
|                                   | +-----------------------------------------+ |
+---------------------------------------------------------------------------------+
```

### Level Select Modal

```
+---------------------------------------------------------------------------------+
| SELECT HEIST MISSION                                                       [×]  |
+---------------------------------------------------------------------------------+
| [01 THE BASICS           ] [02 TIMING & GUARDS      ] [03 MIRRORS & ...      ]  |
| <desc>                     <desc>                     🔒 Locked — clear the     |
| ★★★  Best 0:14.2 ·         ☆☆☆  Target time 0:45.0    previous mission          |
|      Target 0:25.0                                                              |
+---------------------------------------------------------------------------------+
| ★ 3 / 12 | Beat target time w/o rewinding for ★★★ | [Reset Progress]            |
+---------------------------------------------------------------------------------+
```
