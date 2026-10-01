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
const AUTH_JS = path.join(__dirname, '..', 'auth.js');
const MOBILE_JS = path.join(__dirname, '..', 'mobile.js');
const DT = 1 / 60;

// ---------------------------------------------------------------- sandbox
// opts.auth: load auth.js too; opts.session: { username, password } to register/sign in first;
// opts.sessionStore: share a sessionStorage object between "page loads"
function createGame(initialStorage = {}, opts = {}) {
  const els = {};
  const noop = () => {};
  const ctx2d = new Proxy({}, { get: (t, k) => (k in t ? t[k] : noop), set: (t, k, v) => { t[k] = v; return true; } });
  const makeEl = (id) => ({
    id, textContent: '', innerHTML: '', style: {}, children: [],
    classList: {
      set: new Set(['game-overlay', 'levels-modal', 'settings-modal'].includes(id) ? ['hidden'] : []),
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
    addEventListener: () => {},
    hidden: false,
  };
  const store = initialStorage; // shared object = same browser profile across "page loads"
  const localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
  };
  const sessionStore = opts.sessionStore || {};
  const sessionStorage = {
    getItem: (k) => (k in sessionStore ? sessionStore[k] : null),
    setItem: (k, v) => { sessionStore[k] = String(v); },
    removeItem: (k) => { delete sessionStore[k]; },
  };
  const windowListeners = {};
  const win = { localStorage, sessionStorage, confirm: () => true, addEventListener: (ev, fn) => { windowListeners[ev] = fn; } };
  const sandbox = {
    document, console, Math, JSON, Number, String, Set, Object, Array, Proxy, Uint8Array, Date,
    performance: { now: () => 0 },
    requestAnimationFrame: () => 0,
    localStorage,
    sessionStorage,
    window: win,
  };
  vm.createContext(sandbox);
  if (opts.auth || opts.session) {
    vm.runInContext(fs.readFileSync(AUTH_JS, 'utf8'), sandbox);
    win.LightShadowAuth = sandbox.window.LightShadowAuth;
    if (opts.session) {
      const { username, password } = opts.session;
      const res = win.LightShadowAuth.login(username, password, false);
      if (!res.ok) win.LightShadowAuth.register(username, password, false);
    }
  }
  vm.runInContext(fs.readFileSync(GAME_JS, 'utf8') + '\nthis.__Engine = LightShadowEngine;', sandbox);
  windowListeners.load(); // the page's own bootstrap: constructs the engine once
  const engine = new sandbox.__Engine(); // a handle we can drive (shares the same storage)
  // Silence Web Audio (not present in Node)
  Object.getOwnPropertyNames(Object.getPrototypeOf(engine.audio))
    .filter((k) => k.startsWith('play'))
    .forEach((k) => { engine.audio[k] = noop; });
  return { engine, els, store, sessionStore, auth: win.LightShadowAuth, press: (key) => windowListeners.keydown({ key, repeat: false, preventDefault: noop }) };
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


test('accounts: register, duplicate names, wrong password, hashed storage, remove', () => {
  const { auth, store } = createGame({}, { auth: true });
  assert(auth.register('nightfox', 'secret1', false).ok, 'register failed');
  assert(!auth.register('NightFox', 'other', false).ok, 'duplicate username (case-insensitive) accepted');
  assert(!auth.register('a', 'secret1', false).ok, 'too-short username accepted');
  assert(!auth.register('valid_name', '12', false).ok, 'too-short password accepted');
  assert(auth.currentUser() === 'nightfox', 'not signed in after register');
  auth.logout();
  assert(auth.currentUser() === null, 'still signed in after logout');
  assert(!auth.login('nightfox', 'wrong', false).ok, 'wrong password accepted');
  assert(auth.login('NIGHTFOX', 'secret1', false).ok, 'correct login (case-insensitive name) rejected');
  assert(!store.LIGHT_SHADOW_ACCOUNTS.includes('secret1'), 'password stored in plain text');
  assert(auth.register('sunbeam', 'pass1234', true).ok, 'second account failed');
  assert(auth.listAccounts().length === 2, 'expected two accounts');
  assert(!auth.removeAccount('sunbeam', 'nope').ok, 'removed account with wrong password');
  assert(auth.removeAccount('sunbeam', 'pass1234').ok && auth.listAccounts().length === 1, 'remove failed');
});

test('accounts: each player keeps separate progress on the same device', () => {
  const store = {};
  const a = createGame(store, { session: { username: 'alpha', password: 'pw-alpha' } });
  const solved = makeBot(a.engine, a.els)(SOLUTIONS[0]);
  assert(solved === 'WIN', 'alpha could not clear mission 1');
  const b = createGame(store, { session: { username: 'bravo', password: 'pw-bravo' } });
  assert(b.engine.saveData.unlockedLevelIndex === 0 && !b.engine.levelRecord(0).completed, 'bravo sees alpha\'s progress');
  assert(b.els['player-name'].textContent === 'bravo', 'player badge not set');
  const a2 = createGame(store, { session: { username: 'alpha', password: 'pw-alpha' } });
  assert(a2.engine.levelRecord(0).completed && a2.engine.currentLevelIndex === 1, 'alpha did not continue at mission 2');
  assert(store['LIGHT_SHADOW_SAVEDATA::alpha'] && store['LIGHT_SHADOW_SAVEDATA::bravo'], 'per-account save keys missing');
});

test('continue where you left off: mid-level snapshot restores the exact situation, paused', () => {
  const store = {};
  const first = createGame(store, { session: { username: 'resumer', password: 'pw1234' } });
  const bot = makeBot(first.engine, first.els);
  // Mission 1 half done: loot stolen, Light parked at the exit, Shadow on its way
  bot([['as', 'LIGHT'], ['go', 560, 160], ['go', 790, 300], ['as', 'SHADOW'], ['go', 300, 380]]);
  const before = first.engine.captureSnapshot();
  first.engine.saveSnapshot(); // what pagehide / autosave does

  const second = createGame(store, { session: { username: 'resumer', password: 'pw1234' } });
  const e = second.engine;
  assert(e.gameState === 'PAUSED', `expected a paused welcome-back screen, got ${e.gameState}`);
  assert(/WELCOME BACK/.test(second.els['overlay-title'].textContent), 'welcome-back overlay missing');
  assert(e.currentLevelIndex === 0 && e.loot.taken && e.activeCharacter === 'SHADOW', 'level/loot/active soul not restored');
  assert(Math.abs(e.shadowChar.x - before.shadow.x) < 0.01 && Math.abs(e.lightChar.y - before.light.y) < 0.01, 'positions not restored');
  assert(Math.abs(e.levelTime - before.levelTime) < 0.01, 'timer not restored');
  second.els['btn-next-level'].click(); // Continue
  assert(e.gameState === 'PLAYING', 'Continue did not resume');
  const state = makeBot(e, second.els)([['go', 760, 380], ['go', 790, 350]]);
  assert(state === 'WIN', `resumed run did not finish the mission (${state})`);
  assert(e.saveData.inProgress === null, 'snapshot not cleared after the win');
});

test('a failed attempt is not resumed: the mission restarts fresh', () => {
  const store = {};
  const first = createGame(store, { session: { username: 'unlucky', password: 'pw1234' } });
  first.engine.loadLevel(0);
  first.engine.lightChar.x = 110; first.engine.lightChar.y = 260; // into the dark
  for (let t = 0; t < 1 && first.engine.gameState === 'PLAYING'; t += DT) first.engine.update(DT);
  assert(first.engine.gameState === 'FAIL', 'setup did not fail');
  first.engine.saveSnapshot();
  const second = createGame(store, { session: { username: 'unlucky', password: 'pw1234' } });
  assert(second.engine.gameState === 'PLAYING' && second.engine.lightChar.x === 110 && second.engine.lightChar.y === 150, 'failed run was resumed instead of restarted');
});

test('touch/tilt analog input moves the active soul, partial deflection walks slower', () => {
  const { engine } = createGame();
  engine.loadLevel(0);
  const start = engine.lightChar.x;
  engine.analogInput = { x: 1, y: 0 };
  for (let t = 0; t < 0.5; t += DT) engine.update(DT);
  const full = engine.lightChar.x - start;
  engine.loadLevel(0);
  engine.analogInput = { x: 0.5, y: 0 };
  for (let t = 0; t < 0.5; t += DT) engine.update(DT);
  const half = engine.lightChar.x - start;
  assert(full > 75 && full < 90, `full stick should move ~85 px in 0.5 s, moved ${full.toFixed(1)}`);
  assert(Math.abs(half - full / 2) < 3, `half stick should move half as far (${half.toFixed(1)} vs ${full.toFixed(1)})`);
  engine.loadLevel(0);
  engine.analogInput = { x: 0.08, y: 0.05 }; // inside the dead zone
  for (let t = 0; t < 0.5; t += DT) engine.update(DT);
  assert(engine.lightChar.x === start, 'dead zone ignored');
  engine.analogInput = { x: 1, y: 0 };
  engine.keys.a = true; // keyboard wins over the stick
  engine.update(DT);
  assert(engine.lightChar.x < start, 'keyboard should override analog input');
});

test('tilt mapping follows screen orientation and calibration', () => {
  const sandbox = { window: {}, navigator: {}, Math, Object };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(MOBILE_JS, 'utf8'), sandbox);
  const { mapTilt, tiltVector, TILT_FULL_DEG } = sandbox.window.MobileControlsUtil;
  const dir = (beta, gamma, angle) => {
    const neutral = mapTilt(40, 0, angle); // typical holding pose
    const v = tiltVector(mapTilt(beta, gamma, angle), neutral, TILT_FULL_DEG.medium);
    return `${Math.sign(Math.round(v.x * 10))},${Math.sign(Math.round(v.y * 10))}`;
  };
  // Portrait: right edge down -> right; top edge away (beta down) -> up
  assert(dir(40, 15, 0) === '1,0' && dir(25, 0, 0) === '0,-1' && dir(55, 0, 0) === '0,1', 'portrait mapping wrong');
  // Landscape (top of phone to the left): screen-right edge is the device bottom
  assert(dir(55, 0, 90) === '1,0' && dir(40, -15, 90) === '0,1', 'landscape-90 mapping wrong');
  // Landscape (top of phone to the right)
  assert(dir(25, 0, 270) === '1,0' && dir(40, 15, 270) === '0,1', 'landscape-270 mapping wrong');
  const still = tiltVector({ x: 1.5, y: -2 }, { x: 0, y: 0 }, 18);
  assert(still.x === 0 && still.y === 0, 'dead zone should ignore hand tremor');
  const max = tiltVector({ x: 60, y: 60 }, { x: 0, y: 0 }, 18);
  assert(Math.abs(Math.hypot(max.x, max.y) - 1) < 1e-9, 'diagonal tilt must be capped at full speed');
});

test('control settings persist per account', () => {
  const store = {};
  const a = createGame(store, { session: { username: 'tilter', password: 'pw1234' } });
  Object.assign(a.engine.saveData.settings, { tilt: true, tiltSensitivity: 'high', leftHanded: true });
  a.engine.saveSettings();
  const b = createGame(store, { session: { username: 'tilter', password: 'pw1234' } });
  const s = b.engine.saveData.settings;
  assert(s.tilt === true && s.tiltSensitivity === 'high' && s.leftHanded === true && s.touchControls === 'auto' && s.vibration === true, `settings not restored: ${JSON.stringify(s)}`);
});

test('Reset Progress wipes progress but keeps audio & control settings (same live object)', () => {
  const { engine, els } = createGame({}, { session: { username: 'resetter', password: 'pw1234' } });
  makeBot(engine, els)(SOLUTIONS[0]);
  const settingsRef = engine.saveData.settings;
  settingsRef.tiltSensitivity = 'high';
  engine.saveData.audioSettings.muted = true;
  els['btn-reset-progress'].click();
  assert(engine.saveData.unlockedLevelIndex === 0 && !engine.levelRecord(0).completed, 'progress not wiped');
  assert(engine.saveData.settings === settingsRef && settingsRef.tiltSensitivity === 'high', 'control settings lost or detached');
  assert(engine.saveData.audioSettings.muted === true, 'audio settings lost');
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
