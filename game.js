/**
 * LIGHT & SHADOW — Game Engine & Logic
 * 2D Raycasting, Optics Physics, Dual Characters & Guard AI
 */

class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playLightStep() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08); // A5
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playShadowStep() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, this.ctx.currentTime); // A2
    osc.frequency.exponentialRampToValueAtTime(65.41, this.ctx.currentTime + 0.1); // C2
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playSwap() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playInteract() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  playPrism() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      gain.gain.setValueAtTime(0.08, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.2);
    });
  }

  playLoot() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    [587.33, 739.99, 880, 1174.66].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      gain.gain.setValueAtTime(0.12, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.25);
    });
  }

  playStun() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playWin() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    [440, 554.37, 659.25, 880].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      gain.gain.setValueAtTime(0.15, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.4);
    });
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

    this.currentLevelIndex = 0;
    this.activeCharacter = 'LIGHT'; // 'LIGHT' or 'SHADOW'
    
    this.lightChar = { x: 0, y: 0, radius: 14, speed: 4 };
    this.shadowChar = { x: 0, y: 0, radius: 14, speed: 4 };

    this.historyStack = [];
    this.graceTime = 0.5; // seconds
    this.currentGrace = 0.5;

    this.lootSecured = false;
    this.gameState = 'PLAYING'; // 'PLAYING', 'WIN', 'FAIL'

    this.lightPolygons = []; // Arrays of polygons [{pts: [{x,y}...], color: '#fff'}]
    this.coloredBeams = [];

    this.keys = {};

    this.initEvents();
    this.loadLevel(0);
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  initEvents() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;

      if (e.key === 'Tab' || e.key === ' ') {
        e.preventDefault();
        this.swapCharacter();
      } else if (e.key.toLowerCase() === 'e') {
        this.interact();
      } else if (e.key.toLowerCase() === 'z') {
        this.rewindStep();
      } else if (e.key.toLowerCase() === 'r') {
        this.restartLevel();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    document.getElementById('btn-swap-char').addEventListener('click', () => this.swapCharacter());
    document.getElementById('btn-rewind').addEventListener('click', () => this.rewindStep());
    document.getElementById('btn-restart').addEventListener('click', () => this.restartLevel());
    
    document.getElementById('btn-sound').addEventListener('click', (e) => {
      this.audio.muted = !this.audio.muted;
      e.target.textContent = this.audio.muted ? '🔇' : '🔊';
    });

    document.getElementById('btn-levels').addEventListener('click', () => {
      document.getElementById('levels-modal').classList.remove('hidden');
    });

    document.getElementById('btn-close-modal').addEventListener('click', () => {
      document.getElementById('levels-modal').classList.add('hidden');
    });

    document.querySelectorAll('.level-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        const lvl = parseInt(card.getAttribute('data-level'));
        this.loadLevel(lvl);
        document.getElementById('levels-modal').classList.add('hidden');
      });
    });

    document.getElementById('btn-next-level').addEventListener('click', () => {
      if (this.currentLevelIndex < this.levels.length - 1) {
        this.loadLevel(this.currentLevelIndex + 1);
      } else {
        this.loadLevel(0);
      }
      document.getElementById('game-overlay').classList.add('hidden');
    });

    document.getElementById('btn-retry-level').addEventListener('click', () => {
      this.restartLevel();
      document.getElementById('game-overlay').classList.add('hidden');
    });
  }

  get levels() {
    return [
      // LEVEL 1: THE BASICS
      {
        title: '1: The Basics',
        lightStart: { x: 100, y: 120 },
        shadowStart: { x: 100, y: 500 },
        walls: [
          { x: 300, y: 0, w: 20, h: 250 },
          { x: 300, y: 380, w: 20, h: 270 },
          { x: 550, y: 150, w: 20, h: 350 },
        ],
        lightSources: [
          { type: 'spotlight', x: 80, y: 80, angle: 0.35, fov: 0.65, range: 450, rotateSpeed: 0 }
        ],
        mirrors: [],
        prisms: [],
        gates: [],
        crates: [],
        guards: [],
        loot: { x: 750, y: 120, taken: false },
        exit: { x: 820, y: 530 }
      },
      // LEVEL 2: TIMING & SPOTLIGHTS
      {
        title: '2: Timing & Guards',
        lightStart: { x: 80, y: 100 },
        shadowStart: { x: 80, y: 550 },
        walls: [
          { x: 220, y: 0, w: 20, h: 420 },
          { x: 450, y: 200, w: 20, h: 450 },
          { x: 680, y: 0, w: 20, h: 450 },
        ],
        lightSources: [
          { type: 'spotlight', x: 80, y: 80, angle: 0, fov: 0.55, range: 500, rotateSpeed: 0.8 }
        ],
        mirrors: [],
        prisms: [],
        gates: [],
        crates: [],
        guards: [
          { type: 'LUMEN', x: 340, y: 250, patrol: [{x:340,y:100},{x:340,y:400}], speed: 1.5, dir: 1, angle: 0, stunTimer: 0 },
          { type: 'NYX', x: 560, y: 350, patrol: [{x:560,y:150},{x:560,y:500}], speed: 1.5, dir: 1, angle: Math.PI, stunTimer: 0 }
        ],
        loot: { x: 560, y: 80, taken: false },
        exit: { x: 820, y: 550 }
      },
      // LEVEL 3: MIRRORS & CRATES
      {
        title: '3: Mirrors & Shadow Bridges',
        lightStart: { x: 80, y: 100 },
        shadowStart: { x: 80, y: 520 },
        walls: [
          { x: 250, y: 0, w: 20, h: 220 },
          { x: 250, y: 340, w: 20, h: 310 },
          { x: 550, y: 180, w: 20, h: 470 },
        ],
        lightSources: [
          { type: 'spotlight', x: 80, y: 80, angle: 0.1, fov: 0.45, range: 600, rotateSpeed: 0 }
        ],
        mirrors: [
          { x: 210, y: 100, angle: Math.PI / 4, radius: 18 }
        ],
        prisms: [],
        gates: [],
        crates: [
          { x: 380, y: 100, w: 40, h: 40 }
        ],
        guards: [
          { type: 'NYX', x: 400, y: 450, patrol: [{x:320,y:450},{x:480,y:450}], speed: 1.2, dir: 1, angle: 0, stunTimer: 0 }
        ],
        loot: { x: 400, y: 80, taken: false },
        exit: { x: 800, y: 520 }
      },
      // LEVEL 4: PRISM SPECTRUM HEIST
      {
        title: '4: Prism Spectrum Heist',
        lightStart: { x: 80, y: 100 },
        shadowStart: { x: 80, y: 520 },
        walls: [
          { x: 200, y: 0, w: 20, h: 450 },
          { x: 450, y: 200, w: 20, h: 450 },
          { x: 700, y: 0, w: 20, h: 450 },
        ],
        lightSources: [
          { type: 'spotlight', x: 80, y: 80, angle: 0.25, fov: 0.4, range: 600, rotateSpeed: 0 }
        ],
        mirrors: [
          { x: 180, y: 100, angle: Math.PI / 4, radius: 18 }
        ],
        prisms: [
          { x: 180, y: 350, angle: 0 }
        ],
        gates: [
          { id: 'gate-red', x: 450, y: 0, w: 20, h: 200, color: '#ff0055', open: false, reqColor: 'RED' },
          { id: 'gate-blue', x: 700, y: 450, w: 20, h: 200, color: '#3a86ff', open: false, reqColor: 'BLUE' }
        ],
        crates: [],
        guards: [
          { type: 'LUMEN', x: 320, y: 250, patrol: [{x:320,y:100},{x:320,y:400}], speed: 1.5, dir: 1, angle: 0, stunTimer: 0 }
        ],
        loot: { x: 580, y: 100, taken: false },
        exit: { x: 820, y: 520 }
      }
    ];
  }

  loadLevel(index) {
    this.currentLevelIndex = index;
    const lvl = this.levels[index];
    
    document.getElementById('level-title').textContent = lvl.title;

    this.lightChar.x = lvl.lightStart.x;
    this.lightChar.y = lvl.lightStart.y;
    this.shadowChar.x = lvl.shadowStart.x;
    this.shadowChar.y = lvl.shadowStart.y;

    this.walls = JSON.parse(JSON.stringify(lvl.walls));
    this.lightSources = JSON.parse(JSON.stringify(lvl.lightSources));
    this.mirrors = JSON.parse(JSON.stringify(lvl.mirrors));
    this.prisms = JSON.parse(JSON.stringify(lvl.prisms));
    this.gates = JSON.parse(JSON.stringify(lvl.gates));
    this.crates = JSON.parse(JSON.stringify(lvl.crates));
    this.guards = JSON.parse(JSON.stringify(lvl.guards));
    this.loot = JSON.parse(JSON.stringify(lvl.loot));
    this.exit = JSON.parse(JSON.stringify(lvl.exit));

    this.activeCharacter = 'LIGHT';
    this.historyStack = [];
    this.currentGrace = this.graceTime;
    this.gameState = 'PLAYING';
    
    this.updateUI();
  }

  restartLevel() {
    this.loadLevel(this.currentLevelIndex);
    document.getElementById('game-overlay').classList.add('hidden');
  }

  swapCharacter() {
    this.activeCharacter = this.activeCharacter === 'LIGHT' ? 'SHADOW' : 'LIGHT';
    this.audio.playSwap();
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
    lootPill.innerHTML = `<span class="icon">💎</span><span class="text">LOOT: ${this.loot.taken ? '1/1' : '0/1'}</span>`;
  }

  pushStateHistory() {
    if (this.historyStack.length > 20) this.historyStack.shift();
    this.historyStack.push({
      light: { ...this.lightChar },
      shadow: { ...this.shadowChar },
      mirrors: JSON.parse(JSON.stringify(this.mirrors)),
      crates: JSON.parse(JSON.stringify(this.crates)),
      loot: { ...this.loot }
    });
  }

  rewindStep() {
    if (this.historyStack.length > 0) {
      const state = this.historyStack.pop();
      this.lightChar = state.light;
      this.shadowChar = state.shadow;
      this.mirrors = state.mirrors;
      this.crates = state.crates;
      this.loot = state.loot;
      this.audio.playInteract();
      this.updateUI();
    }
  }

  interact() {
    const char = this.activeCharacter === 'LIGHT' ? this.lightChar : this.shadowChar;
    // Check if near any mirror
    this.mirrors.forEach((m) => {
      const dist = Math.hypot(char.x - m.x, char.y - m.y);
      if (dist < 50) {
        this.pushStateHistory();
        m.angle += Math.PI / 8; // Rotate by 22.5 deg
        if (m.angle >= Math.PI * 2) m.angle = 0;
        this.audio.playInteract();
      }
    });
  }

  // -------------------------------------------------------------
  // GAME LOOP & LOGIC
  // -------------------------------------------------------------
  gameLoop(time) {
    const dt = (time - this.lastTime) / 1000;
    this.lastTime = time;

    if (this.gameState === 'PLAYING') {
      this.update(dt);
    }
    this.render();

    requestAnimationFrame((t) => this.gameLoop(t));
  }

  update(dt) {
    // 1. Update Light Sources (Rotation)
    this.lightSources.forEach((ls) => {
      if (ls.rotateSpeed) {
        ls.angle += ls.rotateSpeed * dt;
      }
    });

    // 2. Raycast & Calculate Light Polygons
    this.calculateLighting();

    // 3. Move Active Character
    this.handleMovement(dt);

    // 4. Update Guards AI
    this.updateGuards(dt);

    // 5. Check Terrain Constraints (Light vs Shadow)
    this.checkTerrainConstraints(dt);

    // 6. Check Loot & Exit
    this.checkObjectives();
  }

  handleMovement(dt) {
    const speed = 160 * dt;
    let dx = 0, dy = 0;

    if (this.keys['w'] || this.keys['arrowup']) dy -= 1;
    if (this.keys['s'] || this.keys['arrowdown']) dy += 1;
    if (this.keys['a'] || this.keys['arrowleft']) dx -= 1;
    if (this.keys['d'] || this.keys['arrowright']) dx += 1;

    if (dx !== 0 || dy !== 0) {
      const len = Math.hypot(dx, dy);
      dx /= len;
      dy /= len;

      const currChar = this.activeCharacter === 'LIGHT' ? this.lightChar : this.shadowChar;
      const newX = currChar.x + dx * speed;
      const newY = currChar.y + dy * speed;

      // Check wall collision
      if (!this.checkWallCollision(newX, newY, currChar.radius)) {
        this.pushStateHistory();
        currChar.x = newX;
        currChar.y = newY;

        if (this.activeCharacter === 'LIGHT') {
          this.audio.playLightStep();
        } else {
          this.audio.playShadowStep();
        }
      }

      // Check pushing crates
      this.crates.forEach((c) => {
        if (Math.abs(currChar.x - (c.x + c.w / 2)) < c.w / 2 + 15 && Math.abs(currChar.y - (c.y + c.h / 2)) < c.h / 2 + 15) {
          c.x += dx * speed * 0.6;
          c.y += dy * speed * 0.6;
        }
      });
    }
  }

  checkWallCollision(x, y, r) {
    // Canvas bounds
    if (x - r < 0 || x + r > this.canvas.width || y - r < 0 || y + r > this.canvas.height) return true;

    // Solid walls
    for (let w of this.walls) {
      if (x + r > w.x && x - r < w.x + w.w && y + r > w.y && y - r < w.y + w.h) {
        return true;
      }
    }

    // Closed gates
    for (let g of this.gates) {
      if (!g.open && x + r > g.x && x - r < g.x + g.w && y + r > g.y && y - r < g.y + g.h) {
        return true;
      }
    }

    return false;
  }

  // -------------------------------------------------------------
  // RAYCASTING & LIGHTING CALCULATIONS
  // -------------------------------------------------------------
  calculateLighting() {
    this.lightPolygons = [];
    this.coloredBeams = [];

    // Collect all obstacle line segments
    const segments = [];
    
    // Canvas borders
    segments.push({ a: { x: 0, y: 0 }, b: { x: 900, y: 0 } });
    segments.push({ a: { x: 900, y: 0 }, b: { x: 900, y: 650 } });
    segments.push({ a: { x: 900, y: 650 }, b: { x: 0, y: 650 } });
    segments.push({ a: { x: 0, y: 650 }, b: { x: 0, y: 0 } });

    // Walls
    this.walls.forEach((w) => {
      segments.push({ a: { x: w.x, y: w.y }, b: { x: w.x + w.w, y: w.y } });
      segments.push({ a: { x: w.x + w.w, y: w.y }, b: { x: w.x + w.w, y: w.y + w.h } });
      segments.push({ a: { x: w.x + w.w, y: w.y + w.h }, b: { x: w.x, y: w.y + w.h } });
      segments.push({ a: { x: w.x, y: w.y + w.h }, b: { x: w.x, y: w.y } });
    });

    // Closed Gates
    this.gates.forEach((g) => {
      if (!g.open) {
        segments.push({ a: { x: g.x, y: g.y }, b: { x: g.x + g.w, y: g.y } });
        segments.push({ a: { x: g.x + g.w, y: g.y }, b: { x: g.x + g.w, y: g.y + g.h } });
        segments.push({ a: { x: g.x + g.w, y: g.y + g.h }, b: { x: g.x, y: g.y + g.h } });
        segments.push({ a: { x: g.x, y: g.y }, b: { x: g.x, y: g.y + g.h } });
      }
    });

    // Crates
    this.crates.forEach((c) => {
      segments.push({ a: { x: c.x, y: c.y }, b: { x: c.x + c.w, y: c.y } });
      segments.push({ a: { x: c.x + c.w, y: c.y }, b: { x: c.x + c.w, y: c.y + c.h } });
      segments.push({ a: { x: c.x + c.w, y: c.y + c.h }, b: { x: c.x, y: c.y + c.h } });
      segments.push({ a: { x: c.x, y: c.y + c.h }, b: { x: c.x, y: c.y } });
    });

    // Process each light source
    this.lightSources.forEach((ls) => {
      const poly = this.raycastCone(ls.x, ls.y, ls.angle, ls.fov, ls.range, segments);
      if (poly.length > 0) {
        this.lightPolygons.push({ pts: poly, color: 'rgba(255, 230, 150, 0.75)' });
      }

      // Check interactions with mirrors and prisms
      this.checkOpticsInteractions(ls.x, ls.y, ls.angle, segments);
    });
  }

  raycastCone(srcX, srcY, angle, fov, range, segments) {
    const points = [{ x: srcX, y: srcY }];
    const raysCount = 60;
    const startAngle = angle - fov / 2;
    const endAngle = angle + fov / 2;

    for (let i = 0; i <= raysCount; i++) {
      const rayAngle = startAngle + (i / raysCount) * (endAngle - startAngle);
      const hit = this.getRayIntersection(srcX, srcY, rayAngle, range, segments);
      points.push(hit);
    }
    return points;
  }

  getRayIntersection(srcX, srcY, angle, range, segments) {
    const rayDirX = Math.cos(angle);
    const rayDirY = Math.sin(angle);
    let closestDist = range;
    let closestHit = { x: srcX + rayDirX * range, y: srcY + rayDirY * range };

    segments.forEach((seg) => {
      const hit = this.lineIntersection(
        srcX, srcY, srcX + rayDirX * range, srcY + rayDirY * range,
        seg.a.x, seg.a.y, seg.b.x, seg.b.y
      );
      if (hit && hit.dist < closestDist) {
        closestDist = hit.dist;
        closestHit = { x: hit.x, y: hit.y };
      }
    });

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

  checkOpticsInteractions(srcX, srcY, mainAngle, segments) {
    // Check Mirror reflection
    this.mirrors.forEach((m) => {
      const dist = Math.hypot(m.x - srcX, m.y - srcY);
      if (dist < 400) {
        // Reflected Ray Angle
        const reflectAngle = 2 * m.angle - mainAngle;
        const poly = this.raycastCone(m.x, m.y, reflectAngle, 0.35, 450, segments);
        this.lightPolygons.push({ pts: poly, color: 'rgba(255, 240, 180, 0.85)' });

        // Check if reflected ray hits Nyx Guard
        this.guards.forEach((g) => {
          if (g.type === 'NYX') {
            const gDist = Math.hypot(g.x - m.x, g.y - m.y);
            if (gDist < 350) {
              g.stunTimer = 3.0; // Stun Nyx Guard
              this.audio.playStun();
            }
          }
        });
      }
    });

    // Check Prism Refraction (Splits white light into RGB)
    this.prisms.forEach((p) => {
      const dist = Math.hypot(p.x - srcX, p.y - srcY);
      if (dist < 450) {
        this.audio.playPrism();
        // Red, Green, Blue spectrum beams
        const redPoly = this.raycastCone(p.x, p.y, mainAngle - 0.2, 0.15, 400, segments);
        const greenPoly = this.raycastCone(p.x, p.y, mainAngle, 0.15, 400, segments);
        const bluePoly = this.raycastCone(p.x, p.y, mainAngle + 0.2, 0.15, 400, segments);

        this.coloredBeams.push({ pts: redPoly, color: 'rgba(255, 0, 85, 0.75)', type: 'RED' });
        this.coloredBeams.push({ pts: greenPoly, color: 'rgba(56, 176, 0, 0.75)', type: 'GREEN' });
        this.coloredBeams.push({ pts: bluePoly, color: 'rgba(58, 134, 255, 0.75)', type: 'BLUE' });

        // Check Color Gates activation
        this.gates.forEach((g) => {
          if (g.reqColor === 'RED' && this.polyContainsPoint(redPoly, { x: g.x + 10, y: g.y + 100 })) {
            g.open = true;
          }
          if (g.reqColor === 'BLUE' && this.polyContainsPoint(bluePoly, { x: g.x + 10, y: g.y + 100 })) {
            g.open = true;
          }
        });
      }
    });
  }

  // -------------------------------------------------------------
  // TERRAIN CONSTRAINTS & GUARDS LOGIC
  // -------------------------------------------------------------
  checkTerrainConstraints(dt) {
    const isLightInLight = this.isPointInAnyLight(this.lightChar);
    const isShadowInDark = !this.isPointInAnyLight(this.shadowChar);

    const currValid = this.activeCharacter === 'LIGHT' ? isLightInLight : isShadowInDark;

    const gracePill = document.getElementById('grace-status');

    if (!currValid) {
      this.currentGrace -= dt;
      gracePill.style.display = 'flex';
      const pct = Math.max(0, Math.floor((this.currentGrace / this.graceTime) * 100));
      gracePill.innerHTML = `<span class="icon">⚠️</span><span class="text">GRACE: ${pct}%</span>`;

      if (this.currentGrace <= 0) {
        this.triggerGameOver('CAUGHT IN INVALID TERRAIN', 'Light cannot enter shadows, and Shadow cannot touch light beams!');
      }
    } else {
      this.currentGrace = this.graceTime;
      gracePill.style.display = 'none';
    }
  }

  isPointInAnyLight(pt) {
    for (let poly of this.lightPolygons) {
      if (this.polyContainsPoint(poly.pts, pt)) return true;
    }
    for (let beam of this.coloredBeams) {
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

  updateGuards(dt) {
    this.guards.forEach((g) => {
      if (g.stunTimer > 0) {
        g.stunTimer -= dt;
        return; // Guard is stunned!
      }

      // Patrol movement
      const target = g.patrol[g.dir];
      const dist = Math.hypot(target.x - g.x, target.y - g.y);
      if (dist < 5) {
        g.dir = (g.dir + 1) % g.patrol.length;
      } else {
        const angle = Math.atan2(target.y - g.y, target.x - g.x);
        g.angle = angle;
        g.x += Math.cos(angle) * g.speed;
        g.y += Math.sin(angle) * g.speed;
      }

      // Check Vision Cone against Player
      if (g.type === 'LUMEN') {
        const pDist = Math.hypot(this.lightChar.x - g.x, this.lightChar.y - g.y);
        if (pDist < 160) {
          const pAngle = Math.atan2(this.lightChar.y - g.y, this.lightChar.x - g.x);
          if (Math.abs(pAngle - g.angle) < 0.4) {
            this.triggerGameOver('SPOTTED BY LUMEN GUARD!', 'Lumen Guards patrol illuminated corridors and spotted Lightwalker!');
          }
        }
      } else if (g.type === 'NYX') {
        const pDist = Math.hypot(this.shadowChar.x - g.x, this.shadowChar.y - g.y);
        if (pDist < 160) {
          const pAngle = Math.atan2(this.shadowChar.y - g.y, this.shadowChar.x - g.x);
          if (Math.abs(pAngle - g.angle) < 0.4) {
            this.triggerGameOver('SPOTTED BY NYX GUARD!', 'Nyx Guards have night-vision and spotted Shadowweaver in darkness!');
          }
        }
      }
    });
  }

  checkObjectives() {
    // Steal Loot
    if (!this.loot.taken) {
      const char = this.activeCharacter === 'LIGHT' ? this.lightChar : this.shadowChar;
      const dist = Math.hypot(char.x - this.loot.x, char.y - this.loot.y);
      if (dist < 30) {
        this.loot.taken = true;
        this.audio.playLoot();
        this.updateUI();
      }
    }

    // Reach Exit
    if (this.loot.taken) {
      const distL = Math.hypot(this.lightChar.x - this.exit.x, this.lightChar.y - this.exit.y);
      const distS = Math.hypot(this.shadowChar.x - this.exit.x, this.shadowChar.y - this.exit.y);
      if (distL < 45 && distS < 45) {
        this.gameState = 'WIN';
        this.audio.playWin();
        document.getElementById('overlay-title').textContent = 'MISSION ACCOMPLISHED!';
        document.getElementById('overlay-msg').textContent = 'Both Lightwalker and Shadowweaver secured the loot and escaped cleanly!';
        document.getElementById('btn-next-level').style.display = 'inline-flex';
        document.getElementById('game-overlay').classList.remove('hidden');
      }
    }
  }

  triggerGameOver(title, msg) {
    this.gameState = 'FAIL';
    this.audio.playStun();
    document.getElementById('overlay-title').textContent = title;
    document.getElementById('overlay-msg').textContent = msg;
    document.getElementById('btn-next-level').style.display = 'none';
    document.getElementById('game-overlay').classList.remove('hidden');
  }

  // -------------------------------------------------------------
  // RENDERING ENGINE
  // -------------------------------------------------------------
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Draw Floor Tile Grid Pattern
    this.drawGrid();

    // 2. Draw Light Polygons (Sun & Spotlights)
    this.lightPolygons.forEach((poly) => {
      this.ctx.fillStyle = poly.color;
      this.ctx.beginPath();
      poly.pts.forEach((pt, i) => {
        if (i === 0) this.ctx.moveTo(pt.x, pt.y);
        else this.ctx.lineTo(pt.x, pt.y);
      });
      this.ctx.closePath();
      this.ctx.fill();
    });

    // 3. Draw Colored Prism Spectrum Beams
    this.coloredBeams.forEach((beam) => {
      this.ctx.fillStyle = beam.color;
      this.ctx.beginPath();
      beam.pts.forEach((pt, i) => {
        if (i === 0) this.ctx.moveTo(pt.x, pt.y);
        else this.ctx.lineTo(pt.x, pt.y);
      });
      this.ctx.closePath();
      this.ctx.fill();
    });

    // 4. Draw Walls & Gates
    this.walls.forEach((w) => {
      this.ctx.fillStyle = '#1e2230';
      this.ctx.strokeStyle = '#343b52';
      this.ctx.lineWidth = 2;
      this.ctx.fillRect(w.x, w.y, w.w, w.h);
      this.ctx.strokeRect(w.x, w.y, w.w, w.h);
    });

    this.gates.forEach((g) => {
      if (!g.open) {
        this.ctx.fillStyle = g.color;
        this.ctx.fillRect(g.x, g.y, g.w, g.h);
        this.ctx.strokeStyle = '#fff';
        this.ctx.strokeRect(g.x, g.y, g.w, g.h);
      }
    });

    // 5. Draw Crates
    this.crates.forEach((c) => {
      this.ctx.fillStyle = '#6c584c';
      this.ctx.strokeStyle = '#adc178';
      this.ctx.fillRect(c.x, c.y, c.w, c.h);
      this.ctx.strokeRect(c.x, c.y, c.w, c.h);
    });

    // 6. Draw Mirrors
    this.mirrors.forEach((m) => {
      this.ctx.save();
      this.ctx.translate(m.x, m.y);
      this.ctx.rotate(m.angle);
      this.ctx.fillStyle = '#00f5d4';
      this.ctx.fillRect(-18, -4, 36, 8);
      this.ctx.strokeStyle = '#fff';
      this.ctx.strokeRect(-18, -4, 36, 8);
      this.ctx.restore();
    });

    // 7. Draw Prisms
    this.prisms.forEach((p) => {
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      this.ctx.beginPath();
      this.ctx.moveTo(p.x, p.y - 20);
      this.ctx.lineTo(p.x - 18, p.y + 15);
      this.ctx.lineTo(p.x + 18, p.y + 15);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.strokeStyle = '#ff0055';
      this.ctx.stroke();
    });

    // 8. Draw Light Sources (Lamps/Spotlights)
    this.lightSources.forEach((ls) => {
      this.ctx.fillStyle = '#ffb830';
      this.ctx.beginPath();
      this.ctx.arc(ls.x, ls.y, 12, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowColor = '#ffb830';
      this.ctx.shadowBlur = 15;
    });
    this.ctx.shadowBlur = 0;

    // 9. Draw Guards
    this.guards.forEach((g) => {
      // Draw Vision Cone
      this.ctx.fillStyle = g.type === 'LUMEN' ? 'rgba(255, 184, 48, 0.2)' : 'rgba(157, 78, 221, 0.2)';
      this.ctx.beginPath();
      this.ctx.moveTo(g.x, g.y);
      this.ctx.arc(g.x, g.y, 160, g.angle - 0.4, g.angle + 0.4);
      this.ctx.closePath();
      this.ctx.fill();

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

    // 10. Draw Loot
    if (!this.loot.taken) {
      this.ctx.fillStyle = '#00f5d4';
      this.ctx.beginPath();
      this.ctx.arc(this.loot.x, this.loot.y, 10, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.font = '14px Outfit';
      this.ctx.fillText('💎 LOOT', this.loot.x - 22, this.loot.y - 15);
    }

    // 11. Draw Exit Portal
    this.ctx.fillStyle = 'rgba(56, 176, 0, 0.4)';
    this.ctx.strokeStyle = '#38b000';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(this.exit.x, this.exit.y, 24, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.font = '11px Outfit';
    this.ctx.fillStyle = '#fff';
    this.ctx.fillText('EXIT', this.exit.x - 12, this.exit.y + 4);

    // 12. Draw Characters
    // Lightwalker (Golden Aura)
    this.ctx.shadowColor = '#ffb830';
    this.ctx.shadowBlur = this.activeCharacter === 'LIGHT' ? 20 : 5;
    this.ctx.fillStyle = '#ffb830';
    this.ctx.beginPath();
    this.ctx.arc(this.lightChar.x, this.lightChar.y, this.lightChar.radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = '#000';
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

// Launch Engine on Load
window.addEventListener('load', () => {
  new LightShadowEngine();
});
