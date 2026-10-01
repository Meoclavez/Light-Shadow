/**
 * LIGHT & SHADOW — login screen: account forms, saved-player picker,
 * animated light/shadow background and UI sound effects.
 */
(function () {
  const Auth = window.LightShadowAuth;
  const UI_MUTE_KEY = 'LIGHT_SHADOW_UI_MUTED';
  const $ = (id) => document.getElementById(id);

  // -------------------------------------------------------------- UI sounds (Web Audio, no files)
  const Sfx = {
    ctx: null,
    muted: false,
    init() {
      if (this.muted) return false;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return false;
      if (!this.ctx) this.ctx = new AudioCtx();
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return true;
    },
    tone(freq, { type = 'sine', dur = 0.12, vol = 0.08, delay = 0, slideTo = null } = {}) {
      if (!this.init()) return;
      const t = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(vol, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    },
    hover() { this.tone(1320, { dur: 0.05, vol: 0.02 }); },
    click() { this.tone(660, { type: 'triangle', dur: 0.08, vol: 0.06 }); },
    type() { this.tone(1800 + Math.random() * 400, { dur: 0.03, vol: 0.012 }); },
    tab(toShadow) { this.tone(toShadow ? 330 : 440, { dur: 0.22, vol: 0.07, slideTo: toShadow ? 165 : 880 }); },
    error() {
      this.tone(196, { type: 'sawtooth', dur: 0.16, vol: 0.06 });
      this.tone(146.8, { type: 'sawtooth', dur: 0.22, vol: 0.06, delay: 0.12 });
    },
    success() {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.tone(f, { dur: 0.35, vol: 0.08, delay: i * 0.08 }));
      this.tone(110, { type: 'triangle', dur: 0.8, vol: 0.08, slideTo: 220 });
    }
  };
  try { Sfx.muted = window.localStorage.getItem(UI_MUTE_KEY) === '1'; } catch (e) { /* storage blocked */ }

  // -------------------------------------------------------------- animated background
  function startBackground() {
    const canvas = $('bg-canvas');
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let motes = [];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      motes = Array.from({ length: Math.round((w * h) / 9000) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 10 - 2,
        phase: Math.random() * Math.PI * 2
      }));
    }

    function inBeam(x, y, sx, sy, angle, spread) {
      const a = Math.atan2(y - sy, x - sx);
      let d = a - angle;
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      return Math.abs(d) < spread;
    }

    let last = performance.now();
    let t = 0;
    function frame(now) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += reduceMotion ? 0 : dt;

      ctx.fillStyle = '#07080d';
      ctx.fillRect(0, 0, w, h);

      // Violet shadow mist (bottom right)
      const mist = ctx.createRadialGradient(w * 0.85, h * 0.85, 0, w * 0.85, h * 0.85, Math.max(w, h) * 0.6);
      mist.addColorStop(0, 'rgba(157, 78, 221, 0.22)');
      mist.addColorStop(1, 'rgba(157, 78, 221, 0)');
      ctx.fillStyle = mist;
      ctx.fillRect(0, 0, w, h);

      // Sweeping spotlight from the top-left corner
      const sx = -40;
      const sy = -40;
      const angle = Math.PI / 4 + Math.sin(t * 0.35) * 0.35;
      const spread = 0.22;
      const len = Math.hypot(w, h) * 1.2;
      const beam = ctx.createRadialGradient(sx, sy, 0, sx, sy, len);
      beam.addColorStop(0, 'rgba(255, 220, 140, 0.38)');
      beam.addColorStop(0.6, 'rgba(255, 184, 48, 0.08)');
      beam.addColorStop(1, 'rgba(255, 184, 48, 0)');
      ctx.fillStyle = beam;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + Math.cos(angle - spread) * len, sy + Math.sin(angle - spread) * len);
      ctx.lineTo(sx + Math.cos(angle + spread) * len, sy + Math.sin(angle + spread) * len);
      ctx.closePath();
      ctx.fill();

      // Dust motes: golden inside the beam, violet in the dark
      motes.forEach((m) => {
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        if (m.y < -10) { m.y = h + 10; m.x = Math.random() * w; }
        if (m.x < -10) m.x = w + 10;
        if (m.x > w + 10) m.x = -10;
        const lit = inBeam(m.x, m.y, sx, sy, angle, spread);
        const twinkle = 0.5 + 0.5 * Math.sin(t * 2 + m.phase);
        ctx.fillStyle = lit ? `rgba(255, 214, 120, ${0.35 + 0.6 * twinkle})` : `rgba(180, 120, 255, ${0.12 + 0.25 * twinkle})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, lit ? m.r * 1.3 : m.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Two souls orbiting each other
      const cx = w * 0.5;
      const cy = h * 0.5;
      const rx = Math.min(w, 900) * 0.42;
      const ry = Math.min(h, 700) * 0.4;
      [['#ffb830', 0], ['#9d4edd', Math.PI]].forEach(([color, offset]) => {
        const a = t * 0.4 + offset;
        const x = cx + Math.cos(a) * rx;
        const y = cy + Math.sin(a) * ry;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 46);
        glow.addColorStop(0, color);
        glow.addColorStop(0.25, color + '88');
        glow.addColorStop(1, color + '00');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 46, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(frame);
    }

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(frame);
  }

  // -------------------------------------------------------------- form logic
  let mode = 'login';

  function setMode(next, { silent = false } = {}) {
    mode = next;
    const register = mode === 'register';
    document.querySelector('.auth-tabs').classList.toggle('register', register);
    document.querySelectorAll('.auth-tab').forEach((tab) => {
      const active = tab.dataset.mode === mode;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    document.querySelector('.confirm-field').classList.toggle('hidden', !register);
    $('password').setAttribute('autocomplete', register ? 'new-password' : 'current-password');
    $('btn-submit').textContent = register ? 'Create Account & Play ➔' : 'Enter the Heist ➔';
    $('remember').style.accentColor = register ? 'var(--shadow-color)' : 'var(--light-color)';
    showError('');
    if (!silent) Sfx.tab(register);
  }

  function showError(msg) {
    $('auth-error').textContent = msg;
    if (!msg) return;
    const card = $('login-card');
    card.classList.remove('shake');
    void card.offsetWidth; // restart the animation
    card.classList.add('shake');
    Sfx.error();
  }

  function enterGame() {
    Sfx.success();
    $('login-card').classList.add('success');
    setTimeout(() => {
      document.body.classList.add('page-exit');
    }, 350);
    setTimeout(() => {
      window.location.href = 'game.html';
    }, 800);
  }

  function onSubmit(e) {
    e.preventDefault();
    const username = $('username').value.trim();
    const password = $('password').value;
    const remember = $('remember').checked;

    if (mode === 'register') {
      if (password !== $('password2').value) {
        showError('Passwords do not match.');
        return;
      }
      const res = Auth.register(username, password, remember);
      if (!res.ok) return showError(res.error);
    } else {
      if (!username || !password) return showError('Enter your username and password.');
      const res = Auth.login(username, password, remember);
      if (!res.ok) return showError(res.error);
    }
    $('btn-submit').disabled = true;
    enterGame();
  }

  function renderAccounts() {
    const accounts = Auth.listAccounts();
    $('accounts-section').classList.toggle('hidden', accounts.length === 0);
    const list = $('account-list');
    list.innerHTML = '';

    accounts.forEach((acc, i) => {
      const p = Auth.progressSummary(acc.username);
      const li = document.createElement('li');
      li.className = 'account-chip';
      li.tabIndex = 0;
      li.style.animationDelay = `${i * 0.05}s`;
      li.title = `Sign in as ${acc.username}`;

      const avatar = document.createElement('span');
      avatar.className = 'account-avatar';
      avatar.textContent = acc.username.charAt(0).toUpperCase();

      const info = document.createElement('span');
      info.className = 'account-info';
      const name = document.createElement('span');
      name.className = 'account-name';
      name.textContent = acc.username;
      const meta = document.createElement('span');
      meta.className = 'account-meta';
      meta.textContent = `${p.missionsCleared}/4 missions · ★ ${p.stars}`;
      if (p.inProgressLevel !== null && p.inProgressLevel !== undefined) {
        const live = document.createElement('span');
        live.className = 'live';
        live.textContent = ` · ▶ Mission ${p.inProgressLevel + 1} in progress`;
        meta.appendChild(live);
      }
      info.append(name, meta);

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'account-remove';
      remove.title = `Remove ${acc.username} from this device`;
      remove.setAttribute('aria-label', remove.title);
      remove.textContent = '×';
      remove.addEventListener('click', (ev) => {
        ev.stopPropagation();
        Sfx.click();
        const pw = window.prompt(`Delete "${acc.username}" and all of its progress?\nEnter that account's password to confirm:`);
        if (pw === null) return;
        const res = Auth.removeAccount(acc.username, pw);
        if (!res.ok) return showError(res.error);
        showError('');
        renderAccounts();
        refreshContinuePanel();
      });

      const pick = () => {
        Sfx.click();
        setMode('login', { silent: true });
        $('username').value = acc.username;
        $('password').value = '';
        $('password').focus();
      };
      li.addEventListener('click', pick);
      li.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          pick();
        }
      });
      li.addEventListener('mouseenter', () => Sfx.hover());

      li.append(avatar, info, remove);
      list.appendChild(li);
    });
  }

  function refreshContinuePanel() {
    const user = Auth.currentUser();
    $('continue-panel').classList.toggle('hidden', !user);
    $('auth-panel').classList.toggle('hidden', !!user);
    if (user) $('continue-name').textContent = user;
  }

  function updateSoundButton() {
    $('btn-ui-sound').textContent = Sfx.muted ? '🔇' : '🔊';
  }

  // -------------------------------------------------------------- wire up
  document.querySelectorAll('.auth-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      if (tab.dataset.mode !== mode) setMode(tab.dataset.mode);
    });
  });
  $('auth-form').addEventListener('submit', onSubmit);
  ['username', 'password', 'password2'].forEach((id) => {
    $(id).addEventListener('input', () => {
      Sfx.type();
      if ($('auth-error').textContent) $('auth-error').textContent = '';
    });
  });
  document.querySelectorAll('.btn').forEach((btn) => btn.addEventListener('mouseenter', () => Sfx.hover()));

  $('btn-continue').addEventListener('click', () => {
    $('btn-continue').disabled = true;
    enterGame();
  });
  $('btn-switch').addEventListener('click', () => {
    Sfx.click();
    Auth.logout();
    refreshContinuePanel();
    setMode('login', { silent: true });
    $('username').focus();
  });
  $('btn-ui-sound').addEventListener('click', () => {
    Sfx.muted = !Sfx.muted;
    try { window.localStorage.setItem(UI_MUTE_KEY, Sfx.muted ? '1' : '0'); } catch (e) { /* ignore */ }
    updateSoundButton();
    Sfx.click();
  });

  updateSoundButton();
  setMode(Auth.listAccounts().length ? 'login' : 'register', { silent: true });
  renderAccounts();
  refreshContinuePanel();
  startBackground();
})();
