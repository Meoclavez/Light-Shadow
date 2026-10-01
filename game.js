/**
 * LIGHT & SHADOW — Game Engine & Logic
 * 2D Raycasting, Optics Physics, Dual Characters, Wall Sliding & Guard AI
 */

class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.muted = false;
    this.volume = 0.8;
  }

  setVolume(v) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.master) this.master.gain.value = this.volume;
  }

  playLevelStart() {
    if (!this.init()) return;
    const now = this.ctx.currentTime;
    [293.66, 440, 587.33].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);
      gain.gain.setValueAtTime(0.0001, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.1, now + idx * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.6);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.6);
    });
  }

  playPause() {
    if (!this.init()) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(260, this.ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  // Returns true when a sound may be played (not muted, Web Audio available)
  init() {
    if (this.muted) return false;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return false;
      this.ctx = new AudioCtx();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.volume;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return true;
  }

  playLightStep() {
    if (!this.init()) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08); // A5
    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playShadowStep() {
    if (!this.init()) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, this.ctx.currentTime); // A2
    osc.frequency.exponentialRampToValueAtTime(65.41, this.ctx.currentTime + 0.1); // C2
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playSwap() {
    if (!this.init()) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playInteract() {
    if (!this.init()) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  playPrism() {
    if (!this.init()) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      gain.gain.setValueAtTime(0.08, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.2);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.2);
    });
  }

  playLoot() {
    if (!this.init()) return;
    const now = this.ctx.currentTime;
    [587.33, 739.99, 880, 1174.66].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      gain.gain.setValueAtTime(0.12, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.25);
    });
  }

  playStun() {
    if (!this.init()) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playWin() {
    if (!this.init()) return;
    const now = this.ctx.currentTime;
    [440, 554.37, 659.25, 880].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      gain.gain.setValueAtTime(0.15, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.4);
    });
  }
}

// -------------------------------------------------------------
// GAME CONSTANTS & LEVEL DATA
// -------------------------------------------------------------
const SAVE_KEY = 'LIGHT_SHADOW_SAVEDATA';
const EXIT_RADIUS = 45;      // Both souls must stand inside this radius to escape
const LOOT_RADIUS = 30;      // Pickup distance for the loot
const MOVE_SPEED = 170;      // px per second
const PUSH_SPEED_FACTOR = 0.6;

// Static level data (see 07_Database_Design_Document.md §3 for the schema).
// Light sources: 'spotlight' (cone) or 'lamp' (360°). Optional `rotateSpeed` (rad/s)
// spins a source; optional `sweep: { amplitude, speed }` swings it like a pendulum.
// Mirrors reflect a cone of `spread` radians (default 0.25); prisms split white light into
// R/G/B laser bands. Gates open (and stay open) once a band of `reqColor` covers their `receptor`.
const LEVELS = [
  // LEVEL 1: THE BASICS
  {
    title: '1: The Basics',
    desc: 'Master moving Light in light beams and Shadow in darkness.',
    objective: 'Lightwalker must stay inside the light, Shadowweaver inside the dark. Steal the loot, then bring BOTH souls to the exit portal.',
    parTime: 25,
    lightStart: { x: 110, y: 150 },
    shadowStart: { x: 80, y: 540 },
    walls: [
      { x: 0, y: 300, w: 640, h: 20 },
      { x: 320, y: 440, w: 20, h: 210 },
    ],
    lightSources: [
      { type: 'spotlight', x: 40, y: 150, angle: 0, fov: 0.7, range: 950 }
    ],
    mirrors: [],
    prisms: [],
    gates: [],
    crates: [],
    guards: [],
    loot: { x: 560, y: 160 },
    exit: { x: 800, y: 330 }
  },
  // LEVEL 2: TIMING & GUARDS
  {
    title: '2: Timing & Guards',
    desc: 'Time a swinging spotlight and slip past Lumen & Nyx Guard patrols.',
    objective: 'Cross the Lumen Guard\'s post while it faces away, and time Shadowweaver\'s dash under the swinging spotlight. Nyx Guards see in the dark!',
    parTime: 45,
    lightStart: { x: 100, y: 110 },
    shadowStart: { x: 80, y: 560 },
    walls: [
      { x: 0, y: 220, w: 700, h: 20 },
      { x: 300, y: 240, w: 20, h: 290 },
      { x: 600, y: 240, w: 20, h: 290 },
    ],
    lightSources: [
      { type: 'spotlight', x: 40, y: 110, angle: 0, fov: 0.3, range: 950 },
      { type: 'spotlight', x: 460, y: 252, angle: Math.PI / 2, fov: 0.5, range: 450, sweep: { amplitude: 1.0, speed: 0.7 } }
    ],
    mirrors: [],
    prisms: [],
    gates: [],
    crates: [],
    guards: [
      { type: 'LUMEN', x: 380, y: 40, patrol: [{ x: 380, y: 40 }, { x: 380, y: 190 }], speed: 1.2 },
      { type: 'NYX', x: 760, y: 340, patrol: [{ x: 760, y: 340 }, { x: 760, y: 620 }], speed: 1.3 }
    ],
    loot: { x: 600, y: 110 },
    exit: { x: 810, y: 270 }
  },
  // LEVEL 3: MIRRORS & SHADOW BRIDGES
  {
    title: '3: Mirrors & Shadow Bridges',
    desc: 'Rotate mirrors and push crates to craft custom walking paths.',
    objective: 'Press [E] beside the mirror to bend the beam down the shaft. Then push the crate into the beam to cast a shadow bridge for Shadowweaver.',
    parTime: 45,
    lightStart: { x: 100, y: 100 },
    shadowStart: { x: 80, y: 560 },
    walls: [
      { x: 0, y: 200, w: 620, h: 20 },
      { x: 760, y: 200, w: 140, h: 20 },
      { x: 760, y: 220, w: 20, h: 310 },
    ],
    lightSources: [
      { type: 'spotlight', x: 40, y: 100, angle: 0, fov: 0.25, range: 950 }
    ],
    mirrors: [
      { x: 700, y: 100, angle: 0, radius: 18 }
    ],
    prisms: [],
    gates: [],
    crates: [
      { x: 460, y: 380, w: 100, h: 50 }
    ],
    guards: [
      { type: 'NYX', x: 380, y: 250, patrol: [{ x: 380, y: 250 }, { x: 380, y: 630 }], speed: 1.2 }
    ],
    loot: { x: 700, y: 300 },
    exit: { x: 830, y: 590 }
  },
  // LEVEL 4: PRISM SPECTRUM HEIST
  {
    title: '4: Prism Spectrum Heist',
    desc: 'Refract white light into RGB beams to trigger color gates!',
    objective: 'Tilt the mirror once with [E] so white light strikes the prism. Red light unlocks the vault door, Blue light frees Shadowweaver and freezes the Nyx Guard.',
    parTime: 60,
    lightStart: { x: 100, y: 80 },
    shadowStart: { x: 100, y: 540 },
    walls: [
      { x: 600, y: 0, w: 20, h: 260 },
      { x: 600, y: 360, w: 20, h: 290 },
      { x: 0, y: 420, w: 260, h: 20 },
      { x: 240, y: 440, w: 20, h: 80 },
    ],
    lightSources: [
      { type: 'spotlight', x: 40, y: 80, angle: 0, fov: 0.2, range: 950 }
    ],
    mirrors: [
      { x: 220, y: 80, angle: 0, radius: 18, spread: 0.1 }
    ],
    prisms: [
      { x: 370, y: 230 }
    ],
    gates: [
      { id: 'gate-red', x: 600, y: 260, w: 20, h: 100, color: '#ff0055', reqColor: 'RED', receptor: { x: 582, y: 304 } },
      { id: 'gate-blue', x: 240, y: 520, w: 20, h: 130, color: '#3a86ff', reqColor: 'BLUE', receptor: { x: 487, y: 560 } }
    ],
    crates: [],
    guards: [
      { type: 'LUMEN', x: 720, y: 150, patrol: [{ x: 720, y: 150 }, { x: 720, y: 600 }], speed: 1.2 },
      { type: 'NYX', x: 450, y: 620, patrol: [{ x: 450, y: 620 }, { x: 450, y: 450 }], speed: 1.0 }
    ],
    loot: { x: 800, y: 600 },
    exit: { x: 850, y: 425 }
  }
];

const BEAM_COLORS = {
  RED: 'rgba(255, 0, 85, 0.75)',
  GREEN: 'rgba(56, 176, 0, 0.75)',
  BLUE: 'rgba(58, 134, 255, 0.75)'
};

const PRISM_HALF = 15; // prisms are solid 30x30 glass blocks
const SPECTRUM_BAND_WIDTH = 40; // prism beams are parallel laser bands, wide enough to walk on

function prismRect(p) {
  return { x: p.x - PRISM_HALF, y: p.y - PRISM_HALF, w: PRISM_HALF * 2, h: PRISM_HALF * 2 };
}

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function normalizeAngle(a) {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds - m * 60;
  return `${m}:${s < 10 ? '0' : ''}${s.toFixed(1)}`;
}

// -------------------------------------------------------------
// SAVE DATA (localStorage, key LIGHT_SHADOW_SAVEDATA::<username> per signed-in account)
// -------------------------------------------------------------
class SaveManager {
  static defaults() {
    return {
      unlockedLevelIndex: 0,
      lastLevelIndex: null,
      highScores: {},
      inProgress: null,
      audioSettings: { muted: false, volume: 0.8 },
      // Control preferences (Settings modal, mobile.js)
      settings: { touchControls: 'auto', tilt: false, tiltSensitivity: 'medium', leftHanded: false, vibration: true }
    };
  }

  // Each signed-in account (auth.js) gets its own save slot; without a session the shared slot is used
  static key() {
    const auth = window.LightShadowAuth;
    const user = auth ? auth.currentUser() : null;
    return user ? auth.saveKeyFor(user) : SAVE_KEY;
  }

  static load() {
    const data = SaveManager.defaults();
    try {
      const raw = window.localStorage.getItem(SaveManager.key());
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Number.isInteger(parsed.unlockedLevelIndex)) {
          data.unlockedLevelIndex = Math.max(0, Math.min(parsed.unlockedLevelIndex, LEVELS.length - 1));
        }
        if (Number.isInteger(parsed.lastLevelIndex)) data.lastLevelIndex = parsed.lastLevelIndex;
        if (parsed.highScores && typeof parsed.highScores === 'object') data.highScores = parsed.highScores;
        if (parsed.inProgress && typeof parsed.inProgress === 'object') data.inProgress = parsed.inProgress;
        if (parsed.audioSettings) {
          Object.assign(data.audioSettings, parsed.audioSettings);
          delete data.audioSettings.music; // ambient soundtrack was removed
        }
        if (parsed.settings && typeof parsed.settings === 'object') Object.assign(data.settings, parsed.settings);
      }
    } catch (e) {
      // Corrupt or blocked storage: fall back to a fresh profile
    }
    return data;
  }

  static save(data) {
    try {
      window.localStorage.setItem(SaveManager.key(), JSON.stringify(data));
    } catch (e) {
      // Storage unavailable (private mode / file quota): progress lasts for this session only
    }
  }
}

// -------------------------------------------------------------
// GAME ENGINE CLASS
// -------------------------------------------------------------
class LightShadowEngine {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.audio = new AudioSynthesizer();

    this.saveData = SaveManager.load();
    this.playerName = window.LightShadowAuth ? window.LightShadowAuth.currentUser() : null;
    this.audio.muted = !!this.saveData.audioSettings.muted;
    this.audio.setVolume(this.saveData.audioSettings.volume ?? 0.8);

    this.currentLevelIndex = 0;
    this.activeCharacter = 'LIGHT'; // 'LIGHT' or 'SHADOW'

    this.lightChar = { x: 0, y: 0, radius: 14 };
    this.shadowChar = { x: 0, y: 0, radius: 14 };

    this.historyStack = [];
    this.lastDistPushed = 0;

    // Each soul has its own grace meter: it drains while the controlled soul stands on
    // forbidden terrain and refills only once that soul is back on valid terrain.
    this.graceTime = 0.5; // seconds
    this.grace = { LIGHT: 0.5, SHADOW: 0.5 };

    this.gameState = 'PLAYING'; // 'PLAYING', 'PAUSED', 'WIN', 'FAIL', 'CAMPAIGN_COMPLETE'
    this.levelTime = 0;
    this.rewindsUsed = 0;

    this.lightPolygons = [];
    this.coloredBeams = [];
    this.particles = [];
    this.segments = [];

    this.stepSoundTimer = 0;
    this.prismActiveLastFrame = false;
    this.shownTimerText = '';
    this.animTime = 0;        // drives idle animations (portal swirl, loot bob)
    this.snapshotTimer = 0;   // autosave interval for the mid-level snapshot

    this.keys = {};
    // Analog movement vector (-1..1 per axis) fed by the touch joystick or tilt sensor (mobile.js)
    this.analogInput = { x: 0, y: 0 };

    this.initEvents();
    this.mobile = window.MobileControls ? new window.MobileControls(this) : null;
    this.updateSoundButton();
    const nameEl = document.getElementById('player-name');
    if (nameEl) nameEl.textContent = this.playerName || 'Guest';
    this.resumeProgress();
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  get levels() {
    return LEVELS;
  }

  firstUnfinishedLevel() {
    for (let i = 0; i <= this.saveData.unlockedLevelIndex; i++) {
      if (!this.levelRecord(i).completed) return i;
    }
    return 0;
  }

  levelRecord(index) {
    return this.saveData.highScores[`level_${index}`] || { completed: false };
  }

  isLevelUnlocked(index) {
    return index <= this.saveData.unlockedLevelIndex;
  }

  initEvents() {
    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      if (key === 'escape') {
        if (this.isModalOpen()) this.closeLevelSelect();
        else this.togglePause();
        return;
      }
      if (this.isModalOpen()) return;

      if (e.key === 'Tab' || e.key === ' ') e.preventDefault();
      this.keys[key] = true;
      if (e.repeat) return;

      if (key === 'p') {
        this.togglePause();
      } else if (key === 'r') {
        this.restartLevel();
      } else if (key === 'enter' && this.gameState === 'WIN') {
        this.nextLevel();
      } else if (key === 'enter' && this.gameState === 'PAUSED') {
        this.resume();
      } else if (this.gameState === 'PLAYING') {
        if (e.key === 'Tab' || e.key === ' ') this.swapCharacter();
        else if (key === 'e') this.interact();
        else if (key === 'z') this.rewindStep();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    // Releasing keys while the window is unfocused would otherwise leave them stuck "down"
    window.addEventListener('blur', () => {
      this.keys = {};
    });

    // Keep the "continue where you left off" snapshot fresh when the tab is hidden or closed
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) return;
      if (this.gameState === 'PLAYING') this.pause();
      this.saveSnapshot();
    });
    window.addEventListener('pagehide', () => this.saveSnapshot());

    document.getElementById('btn-swap-char').addEventListener('click', () => {
      if (this.gameState === 'PLAYING') this.swapCharacter();
    });
    document.getElementById('btn-rewind').addEventListener('click', () => {
      if (this.gameState === 'PLAYING') this.rewindStep();
    });
    document.getElementById('btn-restart').addEventListener('click', () => this.restartLevel());

    document.getElementById('btn-sound').addEventListener('click', () => {
      this.audio.muted = !this.audio.muted;
      this.saveData.audioSettings.muted = this.audio.muted;
      SaveManager.save(this.saveData);
      this.updateSoundButton();
    });

    document.getElementById('btn-pause').addEventListener('click', () => this.togglePause());

    document.getElementById('btn-logout').addEventListener('click', () => {
      this.saveSnapshot();
      if (window.LightShadowAuth) window.LightShadowAuth.logout();
      document.body.classList.add('page-exit');
      setTimeout(() => { window.location.href = 'index.html'; }, 450);
    });

    document.getElementById('btn-levels').addEventListener('click', () => this.openLevelSelect());
    document.getElementById('btn-close-modal').addEventListener('click', () => this.closeLevelSelect());

    document.getElementById('btn-reset-progress').addEventListener('click', () => {
      if (!window.confirm('Erase all saved progress, best times and stars?')) return;
      // Progress is wiped; preferences (audio, controls) are kept. The settings object is reused
      // because MobileControls holds a reference to it.
      const { audioSettings, settings } = this.saveData;
      this.saveData = SaveManager.defaults();
      this.saveData.audioSettings = audioSettings;
      this.saveData.settings = settings;
      SaveManager.save(this.saveData);
      this.renderLevelSelect();
      this.loadLevel(0);
    });

    document.getElementById('btn-next-level').addEventListener('click', () => {
      if (this.gameState === 'PAUSED') {
        this.resume();
      } else if (this.gameState === 'CAMPAIGN_COMPLETE') {
        this.loadLevel(0);
      } else {
        this.nextLevel();
      }
    });

    document.getElementById('btn-retry-level').addEventListener('click', () => this.restartLevel());
    document.getElementById('btn-overlay-levels').addEventListener('click', () => this.openLevelSelect());
  }

  updateSoundButton() {
    document.getElementById('btn-sound').textContent = this.audio.muted ? '🔇' : '🔊';
  }

  // -------------------------------------------------------------
  // PAUSE, RESUME & "CONTINUE WHERE YOU LEFT OFF"
  // -------------------------------------------------------------
  pause(title = 'PAUSED', msg = 'The heist is on hold. Press Continue, P or Esc to get back in.') {
    if (this.gameState !== 'PLAYING') return;
    this.gameState = 'PAUSED';
    this.keys = {};
    this.audio.playPause();
    this.showOverlay(title, msg, [], 'Continue ➔');
    this.saveSnapshot();
  }

  resume() {
    if (this.gameState !== 'PAUSED') return;
    this.gameState = 'PLAYING';
    this.keys = {};
    document.getElementById('game-overlay').classList.add('hidden');
    this.audio.playSwap();
  }

  togglePause() {
    if (this.gameState === 'PLAYING') this.pause();
    else if (this.gameState === 'PAUSED') this.resume();
  }

  captureSnapshot() {
    return {
      levelIndex: this.currentLevelIndex,
      levelTime: Math.round(this.levelTime * 100) / 100,
      rewindsUsed: this.rewindsUsed,
      activeCharacter: this.activeCharacter,
      light: { x: this.lightChar.x, y: this.lightChar.y },
      shadow: { x: this.shadowChar.x, y: this.shadowChar.y },
      mirrors: this.mirrors.map((m) => m.angle),
      crates: this.crates.map((c) => ({ x: c.x, y: c.y })),
      gates: this.gates.map((g) => g.open),
      guards: this.guards.map((g) => ({ x: g.x, y: g.y, dir: g.dir, angle: g.angle, stunTimer: g.stunTimer })),
      lights: this.lightSources.map((ls) => ({ angle: ls.angle, time: ls.time })),
      lootTaken: this.loot.taken,
      savedAt: Date.now()
    };
  }

  // Only an unfinished mission is worth resuming; after a win/fail the next visit starts fresh
  saveSnapshot() {
    const live = this.gameState === 'PLAYING' || this.gameState === 'PAUSED';
    this.saveData.inProgress = live ? this.captureSnapshot() : null;
    SaveManager.save(this.saveData);
  }

  restoreSnapshot(snap) {
    const lvl = LEVELS[snap.levelIndex];
    const sameShape = (arr, ref) => Array.isArray(arr) && arr.length === ref.length;
    if (!lvl || !this.isLevelUnlocked(snap.levelIndex) || !snap.light || !snap.shadow ||
        !sameShape(snap.mirrors, lvl.mirrors) || !sameShape(snap.crates, lvl.crates) ||
        !sameShape(snap.gates, lvl.gates) || !sameShape(snap.guards, lvl.guards) ||
        !sameShape(snap.lights, lvl.lightSources)) {
      return false; // level data changed since the snapshot was taken
    }

    this.loadLevel(snap.levelIndex, { silent: true });
    this.levelTime = snap.levelTime || 0;
    this.rewindsUsed = snap.rewindsUsed || 0;
    this.activeCharacter = snap.activeCharacter === 'SHADOW' ? 'SHADOW' : 'LIGHT';
    Object.assign(this.lightChar, { x: snap.light.x, y: snap.light.y });
    Object.assign(this.shadowChar, { x: snap.shadow.x, y: snap.shadow.y });
    this.mirrors.forEach((m, i) => { m.angle = snap.mirrors[i]; });
    this.crates.forEach((c, i) => Object.assign(c, snap.crates[i]));
    this.gates.forEach((g, i) => { g.open = !!snap.gates[i]; });
    this.guards.forEach((g, i) => Object.assign(g, snap.guards[i]));
    this.lightSources.forEach((ls, i) => Object.assign(ls, snap.lights[i]));
    this.loot.taken = !!snap.lootTaken;

    this.calculateLighting();
    this.historyStack = [];
    this.pushStateHistory();
    this.updateUI();
    this.updateTimerUI();
    return true;
  }

  resumeProgress() {
    const name = this.playerName ? `, ${this.playerName.toUpperCase()}` : '';
    const snap = this.saveData.inProgress;
    if (snap && this.restoreSnapshot(snap)) {
      this.pause(`WELCOME BACK${name}!`,
        `Mission ${snap.levelIndex + 1} is exactly where you left it (${formatTime(this.levelTime)} on the clock). Press Continue, P or Enter when you're ready.`);
      return;
    }
    const last = this.saveData.lastLevelIndex;
    const start = Number.isInteger(last) && last >= 0 && last < LEVELS.length && this.isLevelUnlocked(last)
      ? last
      : this.firstUnfinishedLevel();
    this.loadLevel(start);
    if (this.playerName) {
      const returning = Object.keys(this.saveData.highScores).length > 0;
      this.showToast(returning ? `Welcome back, ${this.playerName}! Continuing from Mission ${start + 1}.` : `Welcome, ${this.playerName}! Your first heist awaits.`);
    }
  }

  showToast(text) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = text;
    toast.classList.remove('show');
    void toast.offsetWidth; // restart the CSS animation
    toast.classList.add('show');
  }

  isModalOpen() {
    return ['levels-modal', 'settings-modal'].some((id) => {
      const el = document.getElementById(id);
      return el && !el.classList.contains('hidden');
    });
  }

  saveSettings() {
    SaveManager.save(this.saveData);
  }

  // Short vibration feedback on phones that support it (Settings → Vibration)
  haptic(pattern) {
    if (this.saveData.settings.vibration === false) return;
    try {
      if (window.navigator && typeof window.navigator.vibrate === 'function') window.navigator.vibrate(pattern);
    } catch (e) {
      // vibration blocked (no user gesture yet / unsupported)
    }
  }

  openLevelSelect() {
    this.renderLevelSelect();
    this.keys = {};
    document.getElementById('levels-modal').classList.remove('hidden');
  }

  closeLevelSelect() {
    document.getElementById('levels-modal').classList.add('hidden');
    const settings = document.getElementById('settings-modal');
    if (settings) settings.classList.add('hidden');
  }

  renderLevelSelect() {
    const grid = document.getElementById('level-grid');
    grid.innerHTML = '';
    let totalStars = 0;

    LEVELS.forEach((lvl, i) => {
      const rec = this.levelRecord(i);
      const unlocked = this.isLevelUnlocked(i);
      totalStars += rec.stars || 0;

      const card = document.createElement('div');
      card.className = 'level-card' + (unlocked ? '' : ' locked') + (rec.completed ? ' completed' : '');
      card.setAttribute('data-level', String(i));

      const stars = rec.completed ? '★'.repeat(rec.stars || 1) + '☆'.repeat(3 - (rec.stars || 1)) : '☆☆☆';
      const status = !unlocked
        ? '🔒 Locked — clear the previous mission'
        : rec.completed
          ? `Best ${formatTime(rec.bestTimeSeconds)} · Target ${formatTime(lvl.parTime)}`
          : `Target time ${formatTime(lvl.parTime)}`;

      card.innerHTML = `
        <span class="num">${String(i + 1).padStart(2, '0')}</span>
        <h4>${lvl.title.replace(/^\d+:\s*/, '').toUpperCase()}</h4>
        <p>${lvl.desc}</p>
        <div class="level-meta"><span class="stars">${stars}</span><span class="best">${status}</span></div>`;

      if (unlocked) {
        card.addEventListener('click', () => {
          this.loadLevel(i);
          this.closeLevelSelect();
        });
      }
      grid.appendChild(card);
    });

    document.getElementById('total-stars').textContent = `★ ${totalStars} / ${LEVELS.length * 3}`;
  }

  loadLevel(index, options = {}) {
    this.currentLevelIndex = index;
    const lvl = LEVELS[index];

    document.getElementById('level-title').textContent = lvl.title;

    this.lightChar.x = lvl.lightStart.x;
    this.lightChar.y = lvl.lightStart.y;
    this.shadowChar.x = lvl.shadowStart.x;
    this.shadowChar.y = lvl.shadowStart.y;

    this.walls = deepCopy(lvl.walls);
    this.lightSources = deepCopy(lvl.lightSources).map((ls) => ({ ...ls, baseAngle: ls.angle, time: 0 }));
    this.mirrors = deepCopy(lvl.mirrors);
    this.prisms = deepCopy(lvl.prisms);
    this.gates = deepCopy(lvl.gates).map((g) => ({ ...g, open: false }));
    this.crates = deepCopy(lvl.crates);
    this.guards = deepCopy(lvl.guards).map((g) => ({ ...g, dir: 1, angle: 0, stunTimer: 0 }));
    this.loot = { ...deepCopy(lvl.loot), taken: false };
    this.exit = deepCopy(lvl.exit);

    this.activeCharacter = 'LIGHT';
    this.historyStack = [];
    this.lastDistPushed = 0;
    this.particles = [];
    this.grace = { LIGHT: this.graceTime, SHADOW: this.graceTime };
    this.gameState = 'PLAYING';
    this.levelTime = 0;
    this.rewindsUsed = 0;
    this.prismActiveLastFrame = false;
    this.shownTimerText = '';
    this.keys = {};

    // Bake the starting light so the first frame already shows valid terrain
    this.calculateLighting();
    this.pushStateHistory();

    document.getElementById('game-overlay').classList.add('hidden');
    document.getElementById('grace-status').style.display = 'none';
    this.updateUI();
    this.updateTimerUI();

    if (!options.silent) {
      // A fresh attempt replaces any older mid-level snapshot
      this.saveData.lastLevelIndex = index;
      this.saveData.inProgress = null;
      SaveManager.save(this.saveData);
      this.playLevelIntro(index);
    }
  }

  playLevelIntro(index) {
    const intro = document.getElementById('level-intro');
    if (intro) {
      const [num, ...rest] = LEVELS[index].title.split(':');
      intro.innerHTML = `<span class="intro-num">MISSION ${num.trim()}</span><span class="intro-title">${rest.join(':').trim()}</span>`;
      intro.classList.remove('show');
      void intro.offsetWidth; // restart the CSS animation
      intro.classList.add('show');
    }
    this.audio.playLevelStart();
  }

  restartLevel() {
    this.loadLevel(this.currentLevelIndex);
  }

  nextLevel() {
    const next = this.currentLevelIndex + 1;
    if (next < LEVELS.length && this.isLevelUnlocked(next)) {
      this.loadLevel(next);
    }
  }

  swapCharacter() {
    this.pushStateHistory();
    this.activeCharacter = this.activeCharacter === 'LIGHT' ? 'SHADOW' : 'LIGHT';
    this.audio.playSwap();
    this.haptic(15);
    this.updateUI();
  }

  updateUI() {
    const cardLight = document.getElementById('card-light');
    const cardShadow = document.getElementById('card-shadow');

    if (this.activeCharacter === 'LIGHT') {
      cardLight.classList.add('active');
      cardShadow.classList.remove('active');
    } else {
      cardShadow.classList.add('active');
      cardLight.classList.remove('active');
    }

    const lootPill = document.getElementById('loot-status');
    lootPill.classList.toggle('done', this.loot.taken);
    lootPill.innerHTML = `<span class="icon">💎</span><span class="text">LOOT: ${this.loot.taken ? '1/1' : '0/1'}</span>`;

    // Mission banner walks the player through the two win steps
    const lvl = LEVELS[this.currentLevelIndex];
    document.getElementById('mission-objective').textContent = this.loot.taken
      ? 'Loot secured! The exit portal is open: bring BOTH Lightwalker and Shadowweaver into it to escape.'
      : lvl.objective;
  }

  updateTimerUI() {
    const lvl = LEVELS[this.currentLevelIndex];
    const text = `${formatTime(this.levelTime)} / ${formatTime(lvl.parTime)}`;
    if (text === this.shownTimerText) return;
    this.shownTimerText = text;
    const pill = document.getElementById('timer-status');
    pill.classList.toggle('over-par', this.levelTime > lvl.parTime);
    pill.innerHTML = `<span class="icon">⏱️</span><span class="text">${text}</span>`;
  }

  pushStateHistory() {
    if (this.historyStack.length > 25) this.historyStack.shift();
    this.historyStack.push({
      active: this.activeCharacter,
      light: { ...this.lightChar },
      shadow: { ...this.shadowChar },
      mirrors: deepCopy(this.mirrors),
      crates: deepCopy(this.crates),
      loot: { ...this.loot }
    });
  }

  rewindStep() {
    if (this.historyStack.length > 1) {
      this.historyStack.pop(); // Pop current
      const state = this.historyStack[this.historyStack.length - 1];
      this.activeCharacter = state.active;
      this.lightChar = { ...state.light };
      this.shadowChar = { ...state.shadow };
      this.mirrors = deepCopy(state.mirrors);
      this.crates = deepCopy(state.crates);
      this.loot = { ...state.loot };
      this.lastDistPushed = 0;
      this.rewindsUsed++;
      this.audio.playInteract();
      this.updateUI();
    }
  }

  nearestMirrorInReach() {
    const char = this.activeCharacter === 'LIGHT' ? this.lightChar : this.shadowChar;
    return this.mirrors.some((m) => Math.hypot(char.x - m.x, char.y - m.y) < 50);
  }

  interact() {
    const char = this.activeCharacter === 'LIGHT' ? this.lightChar : this.shadowChar;
    // Rotate the nearest mirror in reach
    let nearest = null;
    let nearestDist = 50;
    this.mirrors.forEach((m) => {
      const dist = Math.hypot(char.x - m.x, char.y - m.y);
      if (dist < nearestDist) {
        nearest = m;
        nearestDist = dist;
      }
    });
    if (nearest) {
      this.pushStateHistory();
      nearest.angle += Math.PI / 8; // Rotate by 22.5 deg
      this.haptic(10);
      if (nearest.angle >= Math.PI - 1e-6) nearest.angle = 0; // a line mirror repeats every 180°
      this.audio.playInteract();
    }
  }

  // -------------------------------------------------------------
  // GAME LOOP & LOGIC
  // -------------------------------------------------------------
  gameLoop(time) {
    // rAF timestamps can precede the constructor's performance.now(): never step backwards
    const dt = Math.max(0, Math.min((time - this.lastTime) / 1000, 0.1));
    this.lastTime = time;

    this.animTime += dt;
    if (this.gameState === 'PLAYING' && !this.isModalOpen()) {
      this.update(dt);
    }
    this.updateParticles(dt); // keep trails & victory bursts animating behind overlays
    if (this.mobile) this.mobile.update(dt);
    this.render();

    requestAnimationFrame((t) => this.gameLoop(t));
  }

  update(dt) {
    this.levelTime += dt;

    // 1. Update Light Sources (rotation / pendulum sweep)
    this.updateLightSources(dt);

    // 2. Raycast & Calculate Light Polygons
    this.calculateLighting();

    // 3. Move Active Character (with smooth wall sliding & crate pushing)
    this.handleMovement(dt);

    // 4. Update Guards AI (particles animate in gameLoop so they also run behind overlays)
    this.updateGuards(dt);
    if (this.gameState !== 'PLAYING') return;

    // 6. Check Terrain Constraints (Light vs Shadow)
    this.checkTerrainConstraints(dt);
    if (this.gameState !== 'PLAYING') return;

    // 7. Check Loot & Exit
    this.checkObjectives();

    this.updateTimerUI();

    // 8. Autosave the mid-level snapshot every couple of seconds
    this.snapshotTimer += dt;
    if (this.snapshotTimer > 2 && this.gameState === 'PLAYING') {
      this.snapshotTimer = 0;
      this.saveSnapshot();
    }
  }

  updateLightSources(dt) {
    this.lightSources.forEach((ls) => {
      ls.time += dt;
      if (ls.sweep) {
        ls.angle = ls.baseAngle + ls.sweep.amplitude * Math.sin(ls.time * ls.sweep.speed);
      } else if (ls.rotateSpeed) {
        ls.angle += ls.rotateSpeed * dt;
      }
    });
  }

  handleMovement(dt) {
    let dx = 0, dy = 0;

    if (this.keys['w'] || this.keys['arrowup']) dy -= 1;
    if (this.keys['s'] || this.keys['arrowdown']) dy += 1;
    if (this.keys['a'] || this.keys['arrowleft']) dx -= 1;
    if (this.keys['d'] || this.keys['arrowright']) dx += 1;

    let throttle = 1;
    if (dx === 0 && dy === 0) {
      // Touch joystick / tilt: analog direction, partial deflection walks slower
      const mag = Math.hypot(this.analogInput.x, this.analogInput.y);
      if (mag < 0.12) return;
      dx = this.analogInput.x;
      dy = this.analogInput.y;
      throttle = Math.min(1, mag);
    }

    const len = Math.hypot(dx, dy);
    dx /= len;
    dy /= len;

    const currChar = this.activeCharacter === 'LIGHT' ? this.lightChar : this.shadowChar;
    const touchingCrate = this.crates.some((c) => this.circleRectOverlap(currChar.x + dx * 4, currChar.y + dy * 4, currChar.radius, c));
    const speed = MOVE_SPEED * dt * throttle * (touchingCrate ? PUSH_SPEED_FACTOR : 1);
    const newX = currChar.x + dx * speed;
    const newY = currChar.y + dy * speed;

    // Try full movement first, then slide along walls on each axis independently
    let moved = this.tryMove(currChar, newX, newY);
    if (!moved) {
      const movedX = this.tryMove(currChar, newX, currChar.y);
      const movedY = this.tryMove(currChar, currChar.x, newY);
      moved = movedX || movedY;
    }

    if (moved) {
      // Push discrete history checkpoints every ~50px of movement
      this.lastDistPushed += speed;
      if (this.lastDistPushed > 50) {
        this.pushStateHistory();
        this.lastDistPushed = 0;
      }

      // Spawn particles
      this.spawnTrailParticle(currChar.x, currChar.y, this.activeCharacter);

      // Play audio footsteps at regular interval
      this.stepSoundTimer += dt;
      if (this.stepSoundTimer > 0.22) {
        if (this.activeCharacter === 'LIGHT') {
          this.audio.playLightStep();
        } else {
          this.audio.playShadowStep();
        }
        this.stepSoundTimer = 0;
      }
    }
  }

  // Moves a character if the target spot is free; crates in the way are pushed when they can move
  tryMove(char, nx, ny) {
    if (this.checkWallCollision(nx, ny, char.radius)) return false;
    const pdx = nx - char.x;
    const pdy = ny - char.y;
    const blocking = this.crates.filter((c) => this.circleRectOverlap(nx, ny, char.radius, c));
    for (const c of blocking) {
      if (!this.canCrateMove(c, pdx, pdy)) return false;
    }
    blocking.forEach((c) => {
      c.x += pdx;
      c.y += pdy;
    });
    char.x = nx;
    char.y = ny;
    return true;
  }

  canCrateMove(crate, pdx, pdy) {
    const r = { x: crate.x + pdx, y: crate.y + pdy, w: crate.w, h: crate.h };
    if (r.x < 0 || r.y < 0 || r.x + r.w > this.canvas.width || r.y + r.h > this.canvas.height) return false;
    const solids = [...this.walls, ...this.gates.filter((g) => !g.open), ...this.crates.filter((c) => c !== crate), ...this.prisms.map(prismRect)];
    if (solids.some((s) => this.rectsOverlap(r, s))) return false;
    // A crate can't be shoved onto the parked soul
    const other = this.activeCharacter === 'LIGHT' ? this.shadowChar : this.lightChar;
    return !this.circleRectOverlap(other.x, other.y, other.radius, r);
  }

  rectsOverlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  circleRectOverlap(x, y, r, rect) {
    return x + r > rect.x && x - r < rect.x + rect.w && y + r > rect.y && y - r < rect.y + rect.h;
  }

  checkWallCollision(x, y, r) {
    // Canvas bounds
    if (x - r < 0 || x + r > this.canvas.width || y - r < 0 || y + r > this.canvas.height) return true;

    // Solid walls
    for (const w of this.walls) {
      if (this.circleRectOverlap(x, y, r, w)) return true;
    }

    // Closed gates
    for (const g of this.gates) {
      if (!g.open && this.circleRectOverlap(x, y, r, g)) return true;
    }

    // Prism blocks
    for (const p of this.prisms) {
      if (this.circleRectOverlap(x, y, r, prismRect(p))) return true;
    }

    return false;
  }

  // -------------------------------------------------------------
  // PARTICLES SYSTEM
  // -------------------------------------------------------------
  spawnTrailParticle(x, y, type) {
    if (this.particles.length > 50) this.particles.shift();
    this.particles.push({
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 8,
      vx: (Math.random() - 0.5) * 15,
      vy: (Math.random() - 0.5) * 15,
      radius: Math.random() * 3 + 2,
      life: 0.4,
      maxLife: 0.4,
      color: type === 'LIGHT' ? '#ffb830' : '#9d4edd'
    });
  }

  spawnVictoryBurst(x, y) {
    const colors = ['#ffb830', '#9d4edd', '#00f5d4', '#ffffff'];
    for (let i = 0; i < 90; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = 60 + Math.random() * 220;
      this.particles.push({
        x, y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        radius: Math.random() * 3 + 1.5,
        life: 1.2 + Math.random() * 0.6,
        maxLife: 1.8,
        color: colors[i % colors.length]
      });
    }
  }

  updateParticles(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  // -------------------------------------------------------------
  // RAYCASTING & LIGHTING CALCULATIONS
  // -------------------------------------------------------------
  buildSegments(includePrisms) {
    const segments = [];
    const W = this.canvas.width;
    const H = this.canvas.height;
    const addRect = (r) => {
      segments.push({ a: { x: r.x, y: r.y }, b: { x: r.x + r.w, y: r.y } });
      segments.push({ a: { x: r.x + r.w, y: r.y }, b: { x: r.x + r.w, y: r.y + r.h } });
      segments.push({ a: { x: r.x + r.w, y: r.y + r.h }, b: { x: r.x, y: r.y + r.h } });
      segments.push({ a: { x: r.x, y: r.y + r.h }, b: { x: r.x, y: r.y } });
    };

    // Canvas borders
    segments.push({ a: { x: 0, y: 0 }, b: { x: W, y: 0 } });
    segments.push({ a: { x: W, y: 0 }, b: { x: W, y: H } });
    segments.push({ a: { x: W, y: H }, b: { x: 0, y: H } });
    segments.push({ a: { x: 0, y: H }, b: { x: 0, y: 0 } });

    this.walls.forEach(addRect);
    this.gates.filter((g) => !g.open).forEach(addRect);
    this.crates.forEach(addRect);
    if (includePrisms) this.prisms.map(prismRect).forEach(addRect);
    return segments;
  }

  calculateLighting() {
    this.lightPolygons = [];
    this.coloredBeams = [];
    // White light stops at prism blocks; the spectrum beams start inside the prism, so they ignore them
    const segments = this.buildSegments(true);
    const spectrumSegments = this.buildSegments(false);
    this.segments = spectrumSegments; // guards see past prisms (glass)

    // Every white beam (source cones and mirror reflections) can feed further optics
    const beams = [];
    this.lightSources.forEach((ls) => {
      const pts = this.raycastCone(ls.x, ls.y, ls.angle, ls.fov, ls.range, segments);
      this.lightPolygons.push({ pts, color: 'rgba(255, 230, 150, 0.75)' });
      beams.push({ x: ls.x, y: ls.y, pts });
    });

    // Optics: a mirror/prism only reacts when a beam actually lights it (each fires once per frame)
    const usedMirrors = new Set();
    const usedPrisms = new Set();
    for (let i = 0; i < beams.length; i++) {
      const beam = beams[i];
      this.mirrors.forEach((m) => {
        if (usedMirrors.has(m) || !this.polyContainsPoint(beam.pts, m)) return;
        usedMirrors.add(m);
        const incoming = Math.atan2(m.y - beam.y, m.x - beam.x);
        const reflectAngle = 2 * m.angle - incoming;
        const pts = this.raycastCone(m.x, m.y, reflectAngle, m.spread || 0.25, 600, segments);
        this.lightPolygons.push({ pts, color: 'rgba(255, 240, 180, 0.85)' });
        beams.push({ x: m.x, y: m.y, pts });
      });
      this.prisms.forEach((p) => {
        if (usedPrisms.has(p)) return;
        const incoming = Math.atan2(p.y - beam.y, p.x - beam.x);
        // The beam stops on the prism's face, so test a point just in front of it (clear of corners too)
        const faceDist = PRISM_HALF * Math.SQRT2 + 6;
        const face = { x: p.x - Math.cos(incoming) * faceDist, y: p.y - Math.sin(incoming) * faceDist };
        if (!this.polyContainsPoint(beam.pts, face)) return;
        usedPrisms.add(p);
        // White light splits into Red / Green / Blue spectrum laser bands
        [['RED', -0.45], ['GREEN', 0], ['BLUE', 0.45]].forEach(([type, offset]) => {
          const pts = this.raycastBand(p.x, p.y, incoming + offset, SPECTRUM_BAND_WIDTH, 650, spectrumSegments);
          this.coloredBeams.push({ pts, color: BEAM_COLORS[type], type });
        });
      });
    }

    const prismActive = usedPrisms.size > 0;
    if (prismActive && !this.prismActiveLastFrame) this.audio.playPrism();
    this.prismActiveLastFrame = prismActive;

    // Color receptors: a gate unlocks (and stays open) once its colour beam reaches the receptor
    this.gates.forEach((g) => {
      if (g.open || !g.receptor) return;
      const hit = this.coloredBeams.some((b) => b.type === g.reqColor && this.polyContainsPoint(b.pts, g.receptor));
      if (hit) {
        g.open = true;
        this.audio.playLoot();
      }
    });

    // Nyx Guards are stunned by any light that touches them
    this.guards.forEach((g) => {
      if (g.type === 'NYX' && this.isPointInAnyLight(g)) {
        if (g.stunTimer <= 0) this.audio.playStun();
        g.stunTimer = 3.0;
      }
    });
  }

  raycastCone(srcX, srcY, angle, fov, range, segments) {
    const points = [{ x: srcX, y: srcY }];
    const raysCount = Math.max(16, Math.ceil(fov * 90));
    const startAngle = angle - fov / 2;

    for (let i = 0; i <= raysCount; i++) {
      const rayAngle = startAngle + (i / raysCount) * fov;
      points.push(this.getRayIntersection(srcX, srcY, rayAngle, range, segments));
    }
    return points;
  }

  // Parallel band of rays (laser): origins spread across `width`, perpendicular to `angle`
  raycastBand(cx, cy, angle, width, range, segments) {
    const nx = -Math.sin(angle);
    const ny = Math.cos(angle);
    const raysCount = Math.max(8, Math.ceil(width / 4));
    const origins = [];
    const hits = [];
    for (let i = 0; i <= raysCount; i++) {
      const t = -width / 2 + (i / raysCount) * width;
      const ox = cx + nx * t;
      const oy = cy + ny * t;
      origins.push({ x: ox, y: oy });
      hits.push(this.getRayIntersection(ox, oy, angle, range, segments));
    }
    return [origins[0], ...hits, origins[origins.length - 1]];
  }

  getRayIntersection(srcX, srcY, angle, range, segments) {
    const rayDirX = Math.cos(angle);
    const rayDirY = Math.sin(angle);
    const endX = srcX + rayDirX * range;
    const endY = srcY + rayDirY * range;
    let closestDist = range;
    let closestHit = { x: endX, y: endY };

    for (const seg of segments) {
      const hit = this.lineIntersection(srcX, srcY, endX, endY, seg.a.x, seg.a.y, seg.b.x, seg.b.y);
      if (hit && hit.dist < closestDist) {
        closestDist = hit.dist;
        closestHit = { x: hit.x, y: hit.y };
      }
    }

    return closestHit;
  }

  lineIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
    const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (denom === 0) return null;

    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;

    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
      const ix = x1 + ua * (x2 - x1);
      const iy = y1 + ua * (y2 - y1);
      const dist = Math.hypot(ix - x1, iy - y1);
      return { x: ix, y: iy, dist };
    }
    return null;
  }

  // -------------------------------------------------------------
  // TERRAIN CONSTRAINTS & GUARDS LOGIC
  // -------------------------------------------------------------
  isInExitPortal(pt) {
    return Math.hypot(pt.x - this.exit.x, pt.y - this.exit.y) < EXIT_RADIUS;
  }

  isTerrainValid(type) {
    const char = type === 'LIGHT' ? this.lightChar : this.shadowChar;
    // The exit portal is twilight: neutral ground for both souls
    if (this.isInExitPortal(char)) return true;
    const lit = this.isPointInAnyLight(char);
    return type === 'LIGHT' ? lit : !lit;
  }

  checkTerrainConstraints(dt) {
    const gracePill = document.getElementById('grace-status');

    ['LIGHT', 'SHADOW'].forEach((type) => {
      const valid = this.isTerrainValid(type);
      if (valid) {
        this.grace[type] = this.graceTime;
      } else if (type === this.activeCharacter) {
        this.grace[type] -= dt;
      }
    });

    const active = this.activeCharacter;
    if (this.grace[active] < this.graceTime) {
      if (gracePill.style.display !== 'flex') this.haptic(25); // first frame on forbidden terrain
      gracePill.style.display = 'flex';
      const pct = Math.max(0, Math.floor((this.grace[active] / this.graceTime) * 100));
      gracePill.innerHTML = `<span class="icon">⚠️</span><span class="text">GRACE: ${pct}%</span>`;

      if (this.grace[active] <= 0) {
        this.triggerGameOver('CAUGHT IN INVALID TERRAIN', active === 'LIGHT'
          ? 'Lightwalker lingered in the shadows too long. Light cannot survive outside the beams!'
          : 'Shadowweaver was exposed by the light too long. Shadow cannot touch light beams!');
      }
    } else {
      gracePill.style.display = 'none';
    }
  }

  isPointInAnyLight(pt) {
    for (const poly of this.lightPolygons) {
      if (this.polyContainsPoint(poly.pts, pt)) return true;
    }
    for (const beam of this.coloredBeams) {
      if (this.polyContainsPoint(beam.pts, pt)) return true;
    }
    return false;
  }

  polyContainsPoint(poly, pt) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i].x, yi = poly[i].y;
      const xj = poly[j].x, yj = poly[j].y;
      const intersect = ((yi > pt.y) !== (yj > pt.y)) && (pt.x < (xj - xi) * (pt.y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  // Vision cone check with line of sight: walls, closed gates and crates block a guard's view
  guardCanSee(g, target) {
    const dist = Math.hypot(target.x - g.x, target.y - g.y);
    if (dist > 160) return false;
    const angleTo = Math.atan2(target.y - g.y, target.x - g.x);
    if (Math.abs(normalizeAngle(angleTo - g.angle)) > 0.4) return false;
    const hit = this.getRayIntersection(g.x, g.y, angleTo, dist, this.segments);
    return Math.hypot(hit.x - g.x, hit.y - g.y) >= dist - 1;
  }

  updateGuards(dt) {
    for (const g of this.guards) {
      if (g.stunTimer > 0) {
        g.stunTimer -= dt;
        continue; // Guard is stunned!
      }

      // Patrol movement
      const target = g.patrol[g.dir];
      const dist = Math.hypot(target.x - g.x, target.y - g.y);
      const step = g.speed * 60 * dt;
      g.angle = Math.atan2(target.y - g.y, target.x - g.x);
      if (dist <= step) {
        g.x = target.x;
        g.y = target.y;
        g.dir = (g.dir + 1) % g.patrol.length;
      } else {
        g.x += Math.cos(g.angle) * step;
        g.y += Math.sin(g.angle) * step;
      }

      // Lumen Guards hunt Lightwalker, Nyx Guards hunt Shadowweaver
      if (g.type === 'LUMEN' && this.guardCanSee(g, this.lightChar)) {
        this.triggerGameOver('SPOTTED BY LUMEN GUARD!', 'Lumen Guards patrol illuminated corridors and spotted Lightwalker!');
        return;
      }
      if (g.type === 'NYX' && this.guardCanSee(g, this.shadowChar)) {
        this.triggerGameOver('SPOTTED BY NYX GUARD!', 'Nyx Guards have night-vision and spotted Shadowweaver in darkness!');
        return;
      }
    }
  }

  checkObjectives() {
    // Steal Loot (either soul can grab it)
    if (!this.loot.taken) {
      const char = this.activeCharacter === 'LIGHT' ? this.lightChar : this.shadowChar;
      const dist = Math.hypot(char.x - this.loot.x, char.y - this.loot.y);
      if (dist < LOOT_RADIUS) {
        this.loot.taken = true;
        this.haptic(40);
        this.pushStateHistory();
        this.audio.playLoot();
        this.updateUI();
      }
    }

    // Escape: loot secured and both souls inside the exit portal
    if (this.loot.taken && this.isInExitPortal(this.lightChar) && this.isInExitPortal(this.shadowChar)) {
      this.completeLevel();
    }
  }

  starsFor(time, rewinds, parTime) {
    if (time > parTime) return 1;
    return rewinds === 0 ? 3 : 2;
  }

  completeLevel() {
    const index = this.currentLevelIndex;
    const lvl = LEVELS[index];
    const time = this.levelTime;
    const stars = this.starsFor(time, this.rewindsUsed, lvl.parTime);

    // Persist the result (DDD §4: unlockedLevelIndex + per-level best time)
    const key = `level_${index}`;
    const prev = this.saveData.highScores[key];
    const newBest = !prev || !prev.completed || time < prev.bestTimeSeconds;
    this.saveData.highScores[key] = {
      completed: true,
      bestTimeSeconds: newBest ? Math.round(time * 10) / 10 : prev.bestTimeSeconds,
      stars: Math.max(stars, (prev && prev.stars) || 0)
    };
    this.saveData.unlockedLevelIndex = Math.max(this.saveData.unlockedLevelIndex, Math.min(index + 1, LEVELS.length - 1));
    this.saveData.lastLevelIndex = index + 1 < LEVELS.length ? index + 1 : 0;
    this.saveData.inProgress = null;
    SaveManager.save(this.saveData);

    this.audio.playWin();
    this.haptic([30, 40, 60]);
    this.spawnVictoryBurst(this.exit.x, this.exit.y);
    this.updateTimerUI();

    const isFinal = index === LEVELS.length - 1;
    const best = this.saveData.highScores[key].bestTimeSeconds;
    const starText = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    const rows = [
      ['Time', `${formatTime(time)}${newBest ? ' (new best!)' : ''}`],
      ['Target', `${formatTime(lvl.parTime)} ${time <= lvl.parTime ? '✔' : '✘'}`],
      ['Best', formatTime(best)],
      ['Rewinds', String(this.rewindsUsed)],
      ['Rating', starText]
    ];

    if (isFinal) {
      // End of the campaign: summarise every mission
      this.gameState = 'CAMPAIGN_COMPLETE';
      let totalStars = 0;
      let totalTime = 0;
      let allDone = true;
      LEVELS.forEach((_, i) => {
        const rec = this.levelRecord(i);
        totalStars += rec.stars || 0;
        if (rec.completed) totalTime += rec.bestTimeSeconds;
        else allDone = false;
      });
      rows.push(['Heist total (best)', allDone ? formatTime(totalTime) : '—']);
      rows.push(['Campaign stars', `${totalStars} / ${LEVELS.length * 3}`]);
      this.showOverlay('HEIST COMPLETE!',
        'The final vault is empty and both souls slipped away unseen. Two souls, one perfect heist. Replay missions to beat your target times and earn every star.',
        rows, 'Play Again ⟲');
    } else {
      this.gameState = 'WIN';
      this.showOverlay('MISSION ACCOMPLISHED!',
        `Both Lightwalker and Shadowweaver secured the loot and escaped. Mission ${index + 2} is now unlocked.`,
        rows, 'Next Level ➔');
    }
  }

  triggerGameOver(title, msg) {
    if (this.gameState !== 'PLAYING') return;
    this.gameState = 'FAIL';
    this.saveData.inProgress = null; // a failed attempt restarts the mission next time
    SaveManager.save(this.saveData);
    this.audio.playStun();
    this.haptic([80, 40, 120]);
    this.showOverlay(title, msg, [], null);
  }

  showOverlay(title, msg, rows, nextLabel) {
    document.getElementById('overlay-title').textContent = title;
    document.getElementById('overlay-msg').textContent = msg;

    const stats = document.getElementById('overlay-stats');
    stats.innerHTML = '';
    rows.forEach(([label, value]) => {
      const row = document.createElement('div');
      row.className = 'stat-row';
      row.innerHTML = `<span class="stat-label">${label}</span><span class="stat-value">${value}</span>`;
      stats.appendChild(row);
    });
    stats.style.display = rows.length ? 'grid' : 'none';

    const nextBtn = document.getElementById('btn-next-level');
    nextBtn.style.display = nextLabel ? 'inline-flex' : 'none';
    if (nextLabel) nextBtn.textContent = nextLabel;
    const retryLabels = { FAIL: 'Try Again', PAUSED: 'Restart Level' };
    document.getElementById('btn-retry-level').textContent = retryLabels[this.gameState] || 'Replay Level';

    document.getElementById('grace-status').style.display = 'none';
    document.getElementById('game-overlay').classList.remove('hidden');
  }

  // -------------------------------------------------------------
  // RENDERING ENGINE
  // -------------------------------------------------------------
  fillPolygon(pts, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    pts.forEach((pt, i) => {
      if (i === 0) this.ctx.moveTo(pt.x, pt.y);
      else this.ctx.lineTo(pt.x, pt.y);
    });
    this.ctx.closePath();
    this.ctx.fill();
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Draw Floor Tile Grid Pattern
    this.drawGrid();

    // 2. Draw Light Polygons (Spotlights, Lamps & Reflections)
    this.lightPolygons.forEach((poly) => this.fillPolygon(poly.pts, poly.color));

    // 3. Draw Colored Prism Spectrum Beams
    this.coloredBeams.forEach((beam) => this.fillPolygon(beam.pts, beam.color));

    // 4. Draw Particles Trail
    this.particles.forEach((p) => {
      const alpha = Math.max(0, p.life / p.maxLife);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = alpha;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
    this.ctx.globalAlpha = 1.0;

    // 5. Draw Walls & Gates
    this.walls.forEach((w) => {
      this.ctx.fillStyle = '#1e2230';
      this.ctx.strokeStyle = '#343b52';
      this.ctx.lineWidth = 2;
      this.ctx.fillRect(w.x, w.y, w.w, w.h);
      this.ctx.strokeRect(w.x, w.y, w.w, w.h);
    });

    this.gates.forEach((g) => {
      this.ctx.lineWidth = 2;
      if (!g.open) {
        this.ctx.fillStyle = g.color;
        this.ctx.fillRect(g.x, g.y, g.w, g.h);
        this.ctx.strokeStyle = '#fff';
        this.ctx.strokeRect(g.x, g.y, g.w, g.h);
      } else {
        this.ctx.setLineDash([4, 4]);
        this.ctx.strokeStyle = g.color;
        this.ctx.strokeRect(g.x, g.y, g.w, g.h);
        this.ctx.setLineDash([]);
      }

      // Colour receptor that unlocks this gate
      if (g.receptor) {
        this.ctx.save();
        this.ctx.fillStyle = g.open ? g.color : '#11141d';
        this.ctx.strokeStyle = g.color;
        this.ctx.lineWidth = 3;
        if (g.open) {
          this.ctx.shadowColor = g.color;
          this.ctx.shadowBlur = 16;
        }
        this.ctx.beginPath();
        this.ctx.arc(g.receptor.x, g.receptor.y, 9, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
      }
    });

    // 6. Draw Crates
    this.crates.forEach((c) => {
      this.ctx.lineWidth = 2;
      this.ctx.fillStyle = '#6c584c';
      this.ctx.strokeStyle = '#adc178';
      this.ctx.fillRect(c.x, c.y, c.w, c.h);
      this.ctx.strokeRect(c.x, c.y, c.w, c.h);
      this.ctx.beginPath();
      this.ctx.moveTo(c.x, c.y);
      this.ctx.lineTo(c.x + c.w, c.y + c.h);
      this.ctx.moveTo(c.x + c.w, c.y);
      this.ctx.lineTo(c.x, c.y + c.h);
      this.ctx.stroke();
    });

    // 7. Draw Mirrors (with interaction hint when in reach)
    const activeChar = this.activeCharacter === 'LIGHT' ? this.lightChar : this.shadowChar;
    this.mirrors.forEach((m) => {
      this.ctx.save();
      this.ctx.translate(m.x, m.y);
      this.ctx.rotate(m.angle);
      this.ctx.fillStyle = '#00f5d4';
      this.ctx.fillRect(-18, -4, 36, 8);
      this.ctx.strokeStyle = '#fff';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(-18, -4, 36, 8);
      this.ctx.restore();
      if (Math.hypot(activeChar.x - m.x, activeChar.y - m.y) < 50) {
        this.ctx.fillStyle = '#00f5d4';
        this.ctx.font = '12px Outfit';
        this.ctx.fillText('[E] rotate', m.x - 26, m.y - 22);
      }
    });

    // 8. Draw Prisms
    this.prisms.forEach((p) => {
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      this.ctx.beginPath();
      this.ctx.moveTo(p.x, p.y - 20);
      this.ctx.lineTo(p.x - 18, p.y + 15);
      this.ctx.lineTo(p.x + 18, p.y + 15);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.strokeStyle = '#ff0055';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    });

    // 9. Draw Light Sources (Lamps/Spotlights)
    this.ctx.save();
    this.ctx.shadowColor = '#ffb830';
    this.ctx.shadowBlur = 15;
    this.ctx.fillStyle = '#ffb830';
    this.lightSources.forEach((ls) => {
      this.ctx.beginPath();
      this.ctx.arc(ls.x, ls.y, 12, 0, Math.PI * 2);
      this.ctx.fill();
    });
    this.ctx.restore();

    // 10. Draw Guards (vision cones respect walls)
    this.guards.forEach((g) => {
      if (g.stunTimer <= 0) {
        const cone = this.raycastCone(g.x, g.y, g.angle, 0.8, 160, this.segments);
        this.fillPolygon(cone, g.type === 'LUMEN' ? 'rgba(255, 184, 48, 0.2)' : 'rgba(157, 78, 221, 0.25)');
      }

      // Guard Body
      this.ctx.fillStyle = g.type === 'LUMEN' ? '#3a86ff' : '#7209b7';
      this.ctx.beginPath();
      this.ctx.arc(g.x, g.y, 12, 0, Math.PI * 2);
      this.ctx.fill();

      if (g.stunTimer > 0) {
        this.ctx.fillStyle = '#ffb830';
        this.ctx.font = '14px Outfit';
        this.ctx.fillText('💫 STUNNED', g.x - 30, g.y - 20);
      }
    });

    // 11. Draw Loot
    if (!this.loot.taken) {
      const bob = Math.sin(this.animTime * 3) * 3;
      this.ctx.save();
      this.ctx.shadowColor = '#00f5d4';
      this.ctx.shadowBlur = 12 + Math.sin(this.animTime * 4) * 6;
      this.ctx.fillStyle = '#00f5d4';
      this.ctx.beginPath();
      this.ctx.arc(this.loot.x, this.loot.y + bob, 10, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
      this.ctx.fillStyle = '#00f5d4';
      this.ctx.font = '14px Outfit';
      this.ctx.fillText('💎 LOOT', this.loot.x - 22, this.loot.y - 15 + bob);
    }

    // 12. Draw Exit Portal (sealed until the loot is secured)
    const exitOpen = this.loot.taken;
    this.ctx.fillStyle = exitOpen ? 'rgba(56, 176, 0, 0.4)' : 'rgba(138, 150, 168, 0.15)';
    this.ctx.strokeStyle = exitOpen ? '#38b000' : '#8a96a8';
    this.ctx.lineWidth = 3;
    if (!exitOpen) this.ctx.setLineDash([6, 5]);
    this.ctx.beginPath();
    this.ctx.arc(this.exit.x, this.exit.y, EXIT_RADIUS - 6, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.setLineDash([]);
    if (exitOpen) {
      // Swirling portal rings
      this.ctx.save();
      this.ctx.lineWidth = 2;
      [0, 1, 2].forEach((i) => {
        const start = this.animTime * (1.5 + i * 0.7) + i * 2;
        this.ctx.strokeStyle = i === 1 ? 'rgba(157, 78, 221, 0.8)' : 'rgba(255, 184, 48, 0.8)';
        this.ctx.beginPath();
        this.ctx.arc(this.exit.x, this.exit.y, EXIT_RADIUS - 12 - i * 7, start, start + Math.PI * 1.2);
        this.ctx.stroke();
      });
      this.ctx.restore();
    }
    this.ctx.font = '11px Outfit';
    this.ctx.fillStyle = '#fff';
    this.ctx.fillText(exitOpen ? 'EXIT' : '🔒 EXIT', this.exit.x - (exitOpen ? 12 : 20), this.exit.y + 4);

    // 13. Draw Characters (pulsing ring marks the soul you control)
    const active = this.activeCharacter === 'LIGHT' ? this.lightChar : this.shadowChar;
    this.ctx.strokeStyle = this.activeCharacter === 'LIGHT' ? 'rgba(255, 184, 48, 0.6)' : 'rgba(157, 78, 221, 0.7)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(active.x, active.y, active.radius + 6 + Math.sin(this.animTime * 5) * 2, 0, Math.PI * 2);
    this.ctx.stroke();

    // Lightwalker (Golden Aura)
    this.ctx.shadowColor = '#ffb830';
    this.ctx.shadowBlur = this.activeCharacter === 'LIGHT' ? 20 : 5;
    this.ctx.fillStyle = '#ffb830';
    this.ctx.beginPath();
    this.ctx.arc(this.lightChar.x, this.lightChar.y, this.lightChar.radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = '#000';
    this.ctx.font = '11px Outfit';
    this.ctx.fillText('☀️', this.lightChar.x - 7, this.lightChar.y + 5);

    // Shadowweaver (Purple Aura)
    this.ctx.shadowColor = '#9d4edd';
    this.ctx.shadowBlur = this.activeCharacter === 'SHADOW' ? 20 : 5;
    this.ctx.fillStyle = '#9d4edd';
    this.ctx.beginPath();
    this.ctx.arc(this.shadowChar.x, this.shadowChar.y, this.shadowChar.radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = '#fff';
    this.ctx.fillText('🌙', this.shadowChar.x - 7, this.shadowChar.y + 5);

    this.ctx.shadowBlur = 0;
  }

  drawGrid() {
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < this.canvas.width; x += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }
}

// Launch Engine on Load (exposed for debugging from the browser console)
window.addEventListener('load', () => {
  window.lightShadowGame = new LightShadowEngine();
});
