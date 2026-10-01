/**
 * LIGHT & SHADOW — headless regression tests (no dependencies).
 *
 *   node tests/playthrough.test.js
 *
 * Loads game.js into a sandbox with a stubbed DOM/canvas/localStorage and drives the real
 * engine.update() loop at 60 FPS using only simulated key presses. Verifies that every level
 * survives an idle start, can be won, unlocks the next mission, and that the campaign ends.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const GAME_JS = path.join(__dirname, '..', 'game.js');
const DT = 1 / 60;

// ---------------------------------------------------------------- sandbox
function createGame(initialStorage = {}) {
  const els = {};
  const noop = () => {};
  const ctx2d = new Proxy({}, { get: (t, k) => (k in t ? t[k] : noop), set: (t, k, v) => { t[k] = v; return true; } });
  const makeEl = (id) => ({
    id, textContent: '', innerHTML: '', style: {}, children: [],
    classList: {
      set: new Set(id === 'game-overlay' || id === 'levels-modal' ? ['hidden'] : []),
      add(c) { this.set.add(c); }, remove(c) { this.set.delete(c); }, contains(c) { return this.set.has(c); },
      toggle(c, force) { ((force === undefined) ? !this.set.has(c) : force) ? this.set.add(c) : this.set.delete(c); },
    },
    listeners: {},
    addEventListener(ev, fn) { this.listeners[ev] = fn; },
    click() { this.listeners.click && this.listeners.click({ target: this }); },
    appendChild(child) { this.children.push(child); },
    setAttribute(k, v) { this[k] = v; },
    getAttribute(k) { return this[k]; },
  });
  const document = {
    getElementById(id) {
      if (!els[id]) {
        els[id] = makeEl(id);
        if (id === 'gameCanvas') Object.assign(els[id], { width: 900, height: 650, getContext: () => ctx2d });
      }
      return els[id];
    },
    createElement: (tag) => makeEl(tag),
    querySelectorAll: () => [],
  };
  const store = { ...initialStorage };
  const localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
  };
  const windowListeners = {};
  const sandbox = {
    document, console, Math, JSON, Number, String, Set, Object, Array, Proxy,
    performance: { now: () => 0 },
    requestAnimationFrame: () => 0,
    localStorage,
    window: { localStorage, confirm: () => true, addEventListener: (ev, fn) => { windowListeners[ev] = fn; } },
  };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(GAME_JS, 'utf8') + '\nthis.__Engine = LightShadowEngine;', sandbox);
  windowListeners.load(); // the page's own bootstrap: constructs the engine once
  const engine = new sandbox.__Engine(); // a handle we can drive (shares the same storage)
  // Silence Web Audio (not present in Node)
  Object.getOwnPropertyNames(Object.getPrototypeOf(engine.audio))
    .filter((k) => k.startsWith('play'))
    .forEach((k) => { engine.audio[k] = noop; });
  return { engine, els, store, press: (key) => windowListeners.keydown({ key, repeat: false, preventDefault: noop }) };
}

// ---------------------------------------------------------------- bot
function makeBot(engine, els) {
  const fail = () => new Error(`FAILED: ${els['overlay-title'].textContent} — ${els['overlay-msg'].textContent}`);
  const step = () => { engine.update(DT); if (engine.gameState === 'FAIL') throw fail(); };
  const me = () => (engine.activeCharacter === 'LIGHT' ? engine.lightChar : engine.shadowChar);
  const cmds = {
    as(type) { if (engine.activeCharacter !== type) engine.swapCharacter(); },
    e() { engine.interact(); },
    waitUntil(fn, max = 20) {
      engine.keys = {};
      for (let t = 0; !fn(engine) && engine.gameState === 'PLAYING'; t += DT) {
        step();
        if (t > max) throw new Error('waitUntil timeout: ' + fn);
      }
    },
    go(x, y, max = 30) {
      for (let t = 0; engine.gameState === 'PLAYING'; t += DT) {
        const c = me();
        const dx = x - c.x;
        const dy = y - c.y;
        if (Math.abs(dx) <= 3 && Math.abs(dy) <= 3) break;
        engine.keys = {};
        if (dx > 3) engine.keys.d = true; else if (dx < -3) engine.keys.a = true;
        if (dy > 3) engine.keys.s = true; else if (dy < -3) engine.keys.w = true;
        const before = { x: c.x, y: c.y };
        step();
        if (t > max) throw new Error(`go(${x},${y}) timed out at ${c.x.toFixed(0)},${c.y.toFixed(0)}`);
        if (engine.gameState === 'PLAYING' && Math.hypot(me().x - before.x, me().y - before.y) < 0.01) {
          throw new Error(`go(${x},${y}) blocked at ${c.x.toFixed(0)},${c.y.toFixed(0)}`);
        }
      }
      engine.keys = {};
    },
  };
  return (script) => {
    for (const [name, ...args] of script) {
      if (engine.gameState !== 'PLAYING') break;
      cmds[name](...args);
    }
    return engine.gameState;
  };
}

// Reference solutions (waypoints a player could follow with WASD)
const SOLUTIONS = [
  // 1: Light walks the beam to the loot and exit; Shadow goes around the pillar in the dark
  [['as', 'LIGHT'], ['go', 560, 160], ['go', 790, 300],
   ['as', 'SHADOW'], ['go', 300, 380], ['go', 760, 380], ['go', 790, 350]],
  // 2: Light crosses the Lumen post while it walks away; Shadow dashes under the pendulum in its dark window
  [['as', 'LIGHT'], ['go', 300, 110],
   ['waitUntil', (e) => e.guards[0].dir === 1 && e.guards[0].y > 85],
   ['go', 340, 70], ['go', 600, 70], ['go', 600, 110], ['go', 800, 210], ['go', 810, 255],
   ['as', 'SHADOW'], ['go', 260, 590],
   ['waitUntil', (e) => e.lightSources[1].angle - Math.PI / 2 > 0.75],
   ['go', 680, 590],
   ['waitUntil', (e) => e.guards[1].dir === 0 && e.guards[1].y < 450],
   ['go', 680, 300],
   ['waitUntil', (e) => e.guards[1].dir === 1 && e.guards[1].y > 420],
   ['go', 790, 285]],
  // 3: Light turns the mirror twice and walks the beam; Shadow pushes the crate in to make a shadow bridge
  [['as', 'LIGHT'], ['go', 660, 100], ['e'], ['e'], ['go', 700, 150], ['go', 700, 560], ['go', 800, 590],
   ['as', 'SHADOW'], ['go', 300, 560],
   ['waitUntil', (e) => e.guards[0].dir === 0 && e.guards[0].y < 450],
   ['go', 446, 560], ['go', 446, 405], ['go', 636, 405], ['go', 636, 600], ['go', 805, 600]],
  // 4: Mirror once onto the prism; Light rides the red band into the vault; Shadow leaves the opened cell
  [['as', 'LIGHT'], ['go', 180, 80], ['e'], ['go', 220, 80], ['go', 340, 200], ['go', 395, 200],
   ['go', 410, 244], ['go', 450, 258], ['go', 490, 272], ['go', 530, 286], ['go', 570, 300], ['go', 610, 314], ['go', 640, 324],
   ['waitUntil', (e) => e.guards[0].dir === 1 && e.guards[0].y > 400],
   ['go', 680, 338], ['go', 720, 352], ['go', 760, 366], ['go', 800, 380], ['go', 840, 394],
   ['as', 'SHADOW'], ['go', 282, 585], ['go', 282, 450], ['go', 345, 385], ['go', 585, 385], ['go', 585, 343],
   ['go', 640, 343], ['go', 640, 600], ['go', 800, 600], ['go', 850, 460]],
];

// ---------------------------------------------------------------- tests
const tests = [];
const test = (name, fn) => tests.push({ name, fn });
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };

test('every level survives 10 s of idling at the start (start-up bug)', () => {
  const { engine, els } = createGame();
  engine.levels.forEach((lvl, i) => {
    engine.loadLevel(i);
    assert(engine.isTerrainValid('LIGHT'), `level ${i + 1}: Lightwalker spawns outside the light`);
    assert(engine.isTerrainValid('SHADOW'), `level ${i + 1}: Shadowweaver spawns inside the light`);
    for (let t = 0; t < 10; t += DT) engine.update(DT);
    assert(engine.gameState === 'PLAYING', `level ${i + 1}: idle start ended in ${engine.gameState}: ${els['overlay-title']?.textContent}`);
  });
});

test('fresh profile: only mission 1 is unlocked and Next cannot skip ahead', () => {
  const { engine } = createGame();
  assert(engine.saveData.unlockedLevelIndex === 0, 'expected only level 1 unlocked');
  assert(engine.currentLevelIndex === 0, 'game should open on level 1');
  engine.nextLevel();
  assert(engine.currentLevelIndex === 0, 'nextLevel() loaded a locked level');
});

test('full campaign: each win saves, unlocks the next mission, and the last win ends the campaign', () => {
  const { engine, els, store, press } = createGame();
  const bot = makeBot(engine, els);
  SOLUTIONS.forEach((script, i) => {
    assert(engine.currentLevelIndex === i, `expected to be on level ${i + 1}, on ${engine.currentLevelIndex + 1}`);
    const state = bot(script);
    const isLast = i === SOLUTIONS.length - 1;
    assert(state === (isLast ? 'CAMPAIGN_COMPLETE' : 'WIN'), `level ${i + 1} ended in ${state}`);
    assert(engine.loot.taken, `level ${i + 1} won without loot`);
    const saved = JSON.parse(store.LIGHT_SHADOW_SAVEDATA);
    const rec = saved.highScores[`level_${i}`];
    assert(rec && rec.completed && rec.bestTimeSeconds > 0 && rec.stars === 3, `level ${i + 1} record not saved: ${JSON.stringify(rec)}`);
    assert(!els['game-overlay'].classList.contains('hidden'), 'result overlay not shown');
    console.log(`    level ${i + 1}: ${state} in ${engine.levelTime.toFixed(1)}s (target ${engine.levels[i].parTime}s) → "${els['overlay-title'].textContent}"`);
    if (!isLast) {
      assert(saved.unlockedLevelIndex === i + 1, `level ${i + 2} not unlocked`);
      press('Enter'); // Next Level
    }
  });
  assert(els['overlay-title'].textContent === 'HEIST COMPLETE!', 'campaign end screen missing');
  assert(els['btn-next-level'].textContent.includes('Play Again'), 'campaign end should offer Play Again');
  assert(els['overlay-stats'].children.some((r) => r.innerHTML.includes('12 / 12')), 'campaign star total missing');
  els['btn-next-level'].click();
  assert(engine.currentLevelIndex === 0 && engine.gameState === 'PLAYING', 'Play Again should restart at level 1');
});

test('exit stays sealed until the loot is stolen', () => {
  const { engine } = createGame();
  engine.loadLevel(0);
  engine.lightChar.x = engine.exit.x; engine.lightChar.y = engine.exit.y;
  engine.shadowChar.x = engine.exit.x + 10; engine.shadowChar.y = engine.exit.y + 10;
  for (let t = 0; t < 1; t += DT) engine.update(DT);
  assert(engine.gameState === 'PLAYING', 'won without the loot');
});

test('swapping souls does not refill the grace meter (no darkness-walking exploit)', () => {
  const { engine, els } = createGame();
  engine.loadLevel(0);
  engine.lightChar.x = 110; engine.lightChar.y = 260; // dark spot above the divider wall
  for (let t = 0; t < 0.3; t += DT) engine.update(DT);
  engine.swapCharacter();
  for (let t = 0; t < 0.2; t += DT) engine.update(DT);
  engine.swapCharacter();
  for (let t = 0; t < 0.3; t += DT) engine.update(DT);
  assert(engine.gameState === 'FAIL' && els['overlay-title'].textContent === 'CAUGHT IN INVALID TERRAIN', 'grace exploit still works');
});

test('level 3: Shadowweaver cannot cross the reflected beam without the crate bridge', () => {
  const { engine, els } = createGame();
  engine.loadLevel(2);
  const bot = makeBot(engine, els);
  bot([['as', 'LIGHT'], ['go', 660, 100], ['e'], ['e']]);
  let err = null;
  try {
    bot([['as', 'SHADOW'], ['go', 300, 600], ['waitUntil', (e) => e.guards[0].dir === 0 && e.guards[0].y < 450], ['go', 600, 600], ['go', 805, 600]]);
  } catch (e) { err = e; }
  assert(err && /INVALID TERRAIN/.test(err.message), `expected a terrain failure, got ${err ? err.message : engine.gameState}`);
});

test('level 4: color gates stay shut until the prism is lit', () => {
  const { engine } = createGame();
  engine.loadLevel(3);
  for (let t = 0; t < 2; t += DT) engine.update(DT);
  assert(engine.gates.every((g) => !g.open), 'a gate opened without prism light');
  engine.mirrors[0].angle = Math.PI / 8;
  engine.update(DT);
  assert(engine.gates.every((g) => g.open), 'gates did not open from the spectrum beams');
  for (let t = 0; t < 6; t += DT) engine.update(DT);
  assert(engine.guards[1].stunTimer > 0, 'Nyx guard was not frozen by the blue beam');
});

test('rewinding costs the third star; corrupt save data falls back to a fresh profile', () => {
  const { engine } = createGame();
  assert(engine.starsFor(10, 0, 25) === 3 && engine.starsFor(10, 2, 25) === 2 && engine.starsFor(30, 0, 25) === 1, 'star rules wrong');
  const corrupt = createGame({ LIGHT_SHADOW_SAVEDATA: '{not json' });
  assert(corrupt.engine.saveData.unlockedLevelIndex === 0, 'corrupt save not handled');
  const saved = createGame({ LIGHT_SHADOW_SAVEDATA: JSON.stringify({ unlockedLevelIndex: 2, highScores: { level_0: { completed: true, bestTimeSeconds: 9, stars: 3 }, level_1: { completed: true, bestTimeSeconds: 20, stars: 2 } }, audioSettings: { muted: true, volume: 0.5 } }) });
  assert(saved.engine.currentLevelIndex === 2, 'should resume at the first unfinished mission');
  assert(saved.engine.audio.muted === true, 'mute setting not restored');
});

let failed = 0;
for (const { name, fn } of tests) {
  try {
    fn();
    console.log(`✔ ${name}`);
  } catch (err) {
    failed++;
    console.log(`✘ ${name}\n    ${err.message}`);
  }
}
console.log(`\n${tests.length - failed}/${tests.length} tests passed`);
process.exit(failed ? 1 : 0);
