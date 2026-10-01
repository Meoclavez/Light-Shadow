# Supporting File: UI/UX Wireframes Blueprint

```
===================================================================================
                                LIGHT & SHADOW UI WIREFRAME
===================================================================================

+---------------------------------------------------------------------------------+
| [LOGO] LIGHT & SHADOW | LEVEL 1: The Basics | [💎 LOOT 0/1] [⏱️ 0:12.4 / 0:25.0] |
| [⚠️ GRACE 100%]  [👤 nightfox] [⏸️][⚙️][🔊][↩️][🔄] [Levels] [Sign Out]           |
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
| | P / ESC : Pause / Resume        | |  Campaign stars X / 12)                 | |
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

### Login Screen (`index.html`, entry point)

```
+---------------------------------------------------------------------------------+
| .  *   (golden spotlight sweeping from the top-left; motes gold in the beam,  [🔊]|
|   *     violet in the dark; two soul orbs orbit the centre; violet mist)        |
|                  +-------------------------------------------+                  |
|                  |                  ✨  (floats)              |                  |
|                  |        LIGHT  &  SHADOW   (gold / violet)  |                  |
|                  |          TWO SOULS. ONE HEIST.            |                  |
|                  |                                           |                  |
|                  |   [ Sign In ]  [ Create Account ]         |                  |
|                  |   ==========  (sliding indicator:         |                  |
|                  |               gold = sign in,             |                  |
|                  |               violet = create)            |                  |
|                  |   Username  [ e.g. nightfox           ]   |                  |
|                  |   Password  [ ••••••                  ]   |                  |
|                  |   Confirm   [ ••••••   ] (Create only)    |                  |
|                  |   [x] Stay signed in on this device       |                  |
|                  |   <error line: "Wrong username or         |                  |
|                  |    password." -> card shakes>             |                  |
|                  |   [      Enter the Heist ➔      ] (sheen) |                  |
|                  |   (Create: "Create Account & Play ➔")     |                  |
|                  |                                           |                  |
|                  |   PLAYERS ON THIS DEVICE                  |                  |
|                  |   +-------------------------------------+ |                  |
|                  |   | (N) nightfox                     [×]| |                  |
|                  |   |     2/4 missions · ★ 5 ·            | |                  |
|                  |   |     ▶ Mission 3 in progress         | |                  |
|                  |   +-------------------------------------+ |                  |
|                  |   | (B) bravo   0/4 missions · ★ 0   [×]| |                  |
|                  |   +-------------------------------------+ |                  |
|                  |   Accounts and progress are saved only in |                  |
|                  |   this browser. Don't reuse a real        |                  |
|                  |   password.                               |                  |
|                  +-------------------------------------------+                  |
+---------------------------------------------------------------------------------+
  First visit (no accounts): opens on Create Account; the player list is hidden.
  Click a chip: prefill the username (Sign In). [×]: password prompt, then delete.
```

### Login Screen — Remembered Session

```
                  +-------------------------------------------+
                  |                  ✨                        |
                  |        LIGHT  &  SHADOW                   |
                  |   Signed in as nightfox                   |
                  |   [ Continue Heist ➔ ] [ Switch Account ] |
                  |   PLAYERS ON THIS DEVICE ...              |
                  +-------------------------------------------+
  Success / Continue: card glows, lifts and blurs out -> page fades -> game.html
```

### Game Header (`game.html`)

```
+---------------------------------------------------------------------------------+
| ✨ LIGHT & SHADOW | MISSION 2: Timing & Guards | 💎 0/1 | ⏱️ 0:12.4 / 0:45.0     |
|  [👤 nightfox] [⏸️] [⚙️] [🔊 Sound] [↩️] [🔄] [Levels] [Sign Out]                  |
+---------------------------------------------------------------------------------+
  🔊 -> 🔇 when muted.
  ⚙️ opens Settings. ⛶ (full screen) appears only in touch mode; ↩️ is hidden there (UNDO).
  Below 1200 px: [Levels] -> [🗺️], [Sign Out] -> [🚪]; below 1100 px the sidebar is hidden.
  Sign Out: save snapshot -> end session -> fade back to the login page.
```

### Pause / Welcome Back Overlay

```
+-----------------------------------------------------------+
|                 WELCOME BACK, NIGHTFOX!                   |
|   Mission 2 is exactly where you left it (0:12.4 on the   |
|   clock). Press Continue, P or Enter when you're ready.   |
|                                                           |
|   [ Continue ➔ ]   [ Restart Level ]   [ Levels ]         |
+-----------------------------------------------------------+
  Plain pause (P / Esc / ⏸️ / tab hidden) uses the same card titled PAUSED:
  "The heist is on hold. Press Continue, P or Esc to get back in."
```

### Canvas Feedback (Intro Card & Toast)

```
+-----------------------------------------+
|                                         |
|             MISSION 2                   |   <- zooms in, fades out
|          TIMING & GUARDS                |      on every level load
|                                         |
|  [ Welcome back, nightfox! Continuing   |   <- toast, bottom centre
|    from Mission 2. ]                    |
+-----------------------------------------+
```

### Phone — Portrait (touch mode, e.g. 390×844)

```
+--------------------------------------+
| 💎 0/1  ⏱️ 0:12.4 / 0:25.0  1: Basics |  <- header, at most 2 rows
| [⏸️][⚙️][⛶][🔊][🔄][🗺️][🚪]          |     (badge hidden <= 480 px)
+--------------------------------------+
| OBJECTIVE: Guide Lightwalker ...     |
+--------------------------------------+
| +----------------------------------+ |
| |                                  | |
| |   900x650 playfield, scaled to   | |  <- panel only as tall as
| |   the full screen width          | |     the canvas needs
| |                                  | |
| +----------------------------------+ |
|                                      |
| +- - - - - - - - - -+   [↩️]          |
| :   DRAG TO MOVE    :   UNDO   +----+ |
| :                   :          |☀️  | |  <- SWAP 104 px (gold;
| :      ( (o) )      :   [🪞]    |SWAP| |     violet 🌙 for Shadow)
| :   base under thumb:  ROTATE  +----+ |  <- ROTATE/UNDO 64 px,
| :     📱 TILT        :  (glows)       |     ROTATE pulses near a mirror
| +- - - - - - - - - -+                |
+--------------------------------------+
  Controls fill the bottom (150-280 px). Left-handed: joystick right, buttons left.
```

### Phone — Landscape (touch mode, height <= 600 px, e.g. 844×390)

```
+--------------------------------------------------------------------------+
| 1: The Basics 💎 0/1 ⏱️ 0:12.4/0:25.0  [⏸️][⚙️][⛶][🔊][🔄][🗺️][🚪]       |  <- one row
| Guide Lightwalker along light beams and Shadowweaver in darkn...          |  <- one line
+-------------+--------------------------------------------+---------------+
|             |                                            |               |
|  (invisible |                                            |               |
|  joystick   |      900x650 playfield, scaled to the      |   [↩️]   [🪞]  |
|  zone, 34%  |      full remaining height                 |               |
|  wide)      |                                            |      (☀️ SWAP) |
|   ( (o) )   |                                            |               |
+-------------+--------------------------------------------+---------------+
  Controls float over the side gutters (buttons 54 / 84 px, semi-transparent).
  ⛶ full screen hides the browser bars; with tilt on, Android also locks the orientation.
```

### Settings Modal (⚙️, all devices)

```
+-----------------------------------------------------------+
| SETTINGS                                              [×] |
+-----------------------------------------------------------+
| CONTROLS                                                  |
| On-screen touch controls             [ Auto | On | Off ]  |
|   Joystick and buttons. Auto shows them on touch screens. |
| Tilt to move                                     [ (o) ]  |
|   <status: "Tilt on: hold the phone comfortably..." /     |
|    "Motion access was denied..." / "No tilt readings..."> |
| Tilt sensitivity                    [ Low | Med | High ]  |  <- dimmed while
| Calibrate tilt                           [ Calibrate ]    |     tilt is off
| Left-handed layout                               [ (o) ]  |
| Vibration (Android)                              [ (o) ]  |
|                                                           |
| PLAYING ON A PHONE                                        |
| - Drag anywhere in the joystick area to move...           |
| - SWAP switches souls, ROTATE turns a nearby mirror,      |
|   UNDO rewinds a step.                                    |
| - ⏸️ pauses, ⛶ goes full screen. Landscape gives the       |
|   biggest view.                                           |
+-----------------------------------------------------------+
  The game is frozen while Settings is open. Esc, [×] or a tap on the backdrop closes it.
  Every change is saved to the signed-in account.
```
