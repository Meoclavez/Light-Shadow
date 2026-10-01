/**
 * LIGHT & SHADOW — local player accounts
 *
 * Simple username/password accounts kept in this browser's localStorage, so several people can
 * share one device and each keep their own progress. Passwords are never stored in plain text:
 * each account keeps a random salt and an iterated SHA-256 hash.
 *
 * NOTE: this is convenience login for a static site (no server). Anyone with access to the
 * browser's storage can delete or reset accounts — do not reuse a real password here.
 */
(function (global) {
  const ACCOUNTS_KEY = 'LIGHT_SHADOW_ACCOUNTS';
  const SESSION_KEY = 'LIGHT_SHADOW_SESSION';
  const SAVE_KEY = 'LIGHT_SHADOW_SAVEDATA';
  const HASH_ROUNDS = 2000;
  const USERNAME_RE = /^[A-Za-z0-9_]{3,16}$/;
  const MIN_PASSWORD = 4;

  // ---------------------------------------------------------------- SHA-256 (sync, dependency-free)
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  function utf8Bytes(str) {
    const bytes = [];
    for (const ch of str) {
      let c = ch.codePointAt(0);
      if (c < 0x80) bytes.push(c);
      else if (c < 0x800) bytes.push(0xc0 | (c >> 6), 0x80 | (c & 63));
      else if (c < 0x10000) bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
      else bytes.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    }
    return bytes;
  }

  function sha256Hex(str) {
    const bytes = utf8Bytes(str);
    const bitLen = bytes.length * 8;
    bytes.push(0x80);
    while (bytes.length % 64 !== 56) bytes.push(0);
    for (let i = 7; i >= 0; i--) bytes.push(i >= 4 ? 0 : (bitLen >>> (i * 8)) & 0xff);

    const H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    const W = new Array(64);
    const rotr = (x, n) => (x >>> n) | (x << (32 - n));
    for (let off = 0; off < bytes.length; off += 64) {
      for (let i = 0; i < 16; i++) {
        const j = off + i * 4;
        W[i] = (bytes[j] << 24) | (bytes[j + 1] << 16) | (bytes[j + 2] << 8) | bytes[j + 3];
      }
      for (let i = 16; i < 64; i++) {
        const s0 = rotr(W[i - 15], 7) ^ rotr(W[i - 15], 18) ^ (W[i - 15] >>> 3);
        const s1 = rotr(W[i - 2], 17) ^ rotr(W[i - 2], 19) ^ (W[i - 2] >>> 10);
        W[i] = (W[i - 16] + s0 + W[i - 7] + s1) | 0;
      }
      let [a, b, c, d, e, f, g, h] = H;
      for (let i = 0; i < 64; i++) {
        const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
        const t1 = (h + S1 + ((e & f) ^ (~e & g)) + K[i] + W[i]) | 0;
        const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
        const t2 = (S0 + ((a & b) ^ (a & c) ^ (b & c))) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }
    return H.map((x) => (x >>> 0).toString(16).padStart(8, '0')).join('');
  }

  function hashPassword(password, salt) {
    let h = sha256Hex(`${salt}:${password}`);
    for (let i = 1; i < HASH_ROUNDS; i++) h = sha256Hex(salt + h);
    return h;
  }

  function randomSalt() {
    const bytes = new Uint8Array(16);
    if (global.crypto && global.crypto.getRandomValues) global.crypto.getRandomValues(bytes);
    else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  }

  // ---------------------------------------------------------------- storage helpers
  function storage(kind) {
    try {
      return global[kind] || null;
    } catch (e) {
      return null; // access can throw when storage is blocked
    }
  }

  function readAccounts() {
    try {
      const raw = storage('localStorage') && storage('localStorage').getItem(ACCOUNTS_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed && parsed.users && typeof parsed.users === 'object') return parsed;
    } catch (e) {
      // corrupt data: start a fresh account list
    }
    return { users: {} };
  }

  function writeAccounts(data) {
    try {
      storage('localStorage').setItem(ACCOUNTS_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }

  const idOf = (username) => String(username || '').trim().toLowerCase();

  // ---------------------------------------------------------------- public API
  const Auth = {
    USERNAME_RE,
    MIN_PASSWORD,
    sha256Hex,

    saveKeyFor(username) {
      return `${SAVE_KEY}::${idOf(username)}`;
    },

    // Accounts on this device, most recently played first
    listAccounts() {
      return Object.values(readAccounts().users)
        .map((u) => ({ username: u.username, createdAt: u.createdAt, lastLogin: u.lastLogin || 0 }))
        .sort((a, b) => b.lastLogin - a.lastLogin);
    },

    validate(username, password) {
      if (!USERNAME_RE.test(String(username || '').trim())) {
        return 'Username must be 3–16 letters, numbers or underscores.';
      }
      if (String(password || '').length < MIN_PASSWORD) {
        return `Password must be at least ${MIN_PASSWORD} characters.`;
      }
      return null;
    },

    register(username, password, remember) {
      const error = this.validate(username, password);
      if (error) return { ok: false, error };
      const data = readAccounts();
      const id = idOf(username);
      if (data.users[id]) return { ok: false, error: 'That username is already taken on this device.' };
      const salt = randomSalt();
      data.users[id] = {
        username: String(username).trim(),
        salt,
        hash: hashPassword(password, salt),
        createdAt: Date.now(),
        lastLogin: Date.now()
      };
      if (!writeAccounts(data)) return { ok: false, error: 'This browser blocks storage, so accounts cannot be saved.' };
      this.startSession(data.users[id].username, remember);
      return { ok: true, username: data.users[id].username };
    },

    login(username, password, remember) {
      const data = readAccounts();
      const user = data.users[idOf(username)];
      if (!user || hashPassword(String(password || ''), user.salt) !== user.hash) {
        return { ok: false, error: 'Wrong username or password.' };
      }
      user.lastLogin = Date.now();
      writeAccounts(data);
      this.startSession(user.username, remember);
      return { ok: true, username: user.username };
    },

    // Deletes an account and its saved progress (password required)
    removeAccount(username, password) {
      const data = readAccounts();
      const id = idOf(username);
      const user = data.users[id];
      if (!user || hashPassword(String(password || ''), user.salt) !== user.hash) {
        return { ok: false, error: 'Wrong password — account not removed.' };
      }
      delete data.users[id];
      writeAccounts(data);
      try { storage('localStorage').removeItem(this.saveKeyFor(id)); } catch (e) { /* ignore */ }
      if (idOf(this.currentUser()) === id) this.logout();
      return { ok: true };
    },

    startSession(username, remember) {
      const session = JSON.stringify({ username });
      try { storage('sessionStorage').setItem(SESSION_KEY, session); } catch (e) { /* ignore */ }
      try {
        if (remember) storage('localStorage').setItem(SESSION_KEY, session);
        else storage('localStorage').removeItem(SESSION_KEY);
      } catch (e) { /* ignore */ }
    },

    // Signed-in username (this tab, or remembered on this device), or null
    currentUser() {
      for (const kind of ['sessionStorage', 'localStorage']) {
        try {
          const raw = storage(kind) && storage(kind).getItem(SESSION_KEY);
          if (!raw) continue;
          const { username } = JSON.parse(raw);
          const user = readAccounts().users[idOf(username)];
          if (user) return user.username;
        } catch (e) {
          // ignore unreadable session
        }
      }
      return null;
    },

    logout() {
      for (const kind of ['sessionStorage', 'localStorage']) {
        try { storage(kind).removeItem(SESSION_KEY); } catch (e) { /* ignore */ }
      }
    },

    // Progress summary for the account picker on the login screen
    progressSummary(username) {
      try {
        const raw = storage('localStorage').getItem(this.saveKeyFor(username));
        const save = raw ? JSON.parse(raw) : {};
        const scores = Object.values(save.highScores || {});
        return {
          missionsCleared: scores.filter((s) => s.completed).length,
          stars: scores.reduce((sum, s) => sum + (s.stars || 0), 0),
          inProgressLevel: save.inProgress ? save.inProgress.levelIndex : null
        };
      } catch (e) {
        return { missionsCleared: 0, stars: 0, inProgressLevel: null };
      }
    }
  };

  global.LightShadowAuth = Auth;
})(typeof window !== 'undefined' ? window : globalThis);
