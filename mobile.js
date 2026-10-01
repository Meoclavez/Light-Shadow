/**
 * LIGHT & SHADOW — responsive canvas, touch controls, tilt steering & settings
 *
 * Primary mobile control is a floating analog joystick (left thumb) plus SWAP / ROTATE / UNDO
 * buttons (right thumb): precise enough for the narrow beams and 0.5 s grace windows.
 * Tilt steering (DeviceOrientation) is optional: enable it in Settings, calibrate to your
 * holding angle, and the joystick still overrides it while touched.
 */
(function () {
  const VIRTUAL_W = 900;
  const VIRTUAL_H = 650;
  const JOY_RADIUS = 52;                                     // px of thumb travel for full speed
  const TILT_FULL_DEG = { low: 28, medium: 18, high: 11 };   // tilt needed for full speed
  const TILT_DEAD_DEG = 2.5;
  const TILT_RESPONSE = 12;                                  // low-pass speed (1/s) applied per frame

  function screenAngle() {
    const so = window.screen && window.screen.orientation;
    if (so && typeof so.angle === 'number') return so.angle;
    return typeof window.orientation === 'number' ? window.orientation : 0;
  }

  // Device beta/gamma (degrees) -> tilt along the *screen's* x (right) and y (down) axes
  function mapTilt(beta, gamma, angle) {
    switch (((angle % 360) + 360) % 360) {
      case 90: return { x: beta, y: -gamma };   // landscape, device top pointing left
      case 180: return { x: -gamma, y: -beta }; // upside-down portrait
      case 270: return { x: -beta, y: gamma };  // landscape, device top pointing right
      default: return { x: gamma, y: beta };    // portrait
    }
  }

  // Screen-axis tilt relative to the calibrated neutral pose -> movement vector (-1..1)
  function tiltVector(tilt, neutral, fullDeg) {
    const axis = (v) => {
      const mag = Math.max(0, Math.abs(v) - TILT_DEAD_DEG) / (fullDeg - TILT_DEAD_DEG);
      return Math.sign(v) * Math.min(1, mag);
    };
    const vec = { x: axis(tilt.x - neutral.x), y: axis(tilt.y - neutral.y) };
    const len = Math.hypot(vec.x, vec.y);
    return len > 1 ? { x: vec.x / len, y: vec.y / len } : vec;
  }

  class MobileControls {
    constructor(engine) {
      this.engine = engine;
      this.settings = engine.saveData.settings;
      this.$ = (id) => document.getElementById(id);

      this.joy = { active: false, pointerId: null, cx: 0, cy: 0, x: 0, y: 0 };
      this.tilt = { listening: false, neutral: null, target: { x: 0, y: 0 }, vec: { x: 0, y: 0 }, lastEvent: 0, pendingPermission: false };
      this.touchDetected = (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
        'ontouchstart' in window || (navigator.maxTouchPoints || 0) > 0;
      this.rotateReady = null;
      this.swapSoul = null;

      this.onOrientation = this.onOrientation.bind(this);
      this.bindTouchControls();
      this.bindSettings();
      this.bindLayout();
      this.applySettings();

      if (this.settings.tilt) this.resumeTiltOnLoad();
    }

    // ------------------------------------------------------------ per-frame
    update(dt) {
      let vec = { x: 0, y: 0 };
      const tiltOn = this.settings.tilt && this.tilt.listening;
      if (tiltOn) {
        // Smooth hand tremor per frame (sensor event rates differ between phones)
        const k = Math.min(1, (dt || 0) * TILT_RESPONSE);
        this.tilt.vec = {
          x: this.tilt.vec.x + (this.tilt.target.x - this.tilt.vec.x) * k,
          y: this.tilt.vec.y + (this.tilt.target.y - this.tilt.vec.y) * k
        };
      }
      if (this.joy.active) vec = { x: this.joy.x, y: this.joy.y };
      else if (tiltOn) vec = this.tilt.vec;
      this.engine.analogInput.x = vec.x;
      this.engine.analogInput.y = vec.y;

      // The resting knob mirrors the tilt so players can see what the sensor is doing
      if (!this.joy.active) this.placeKnob(tiltOn ? this.tilt.vec.x * JOY_RADIUS : 0, tiltOn ? this.tilt.vec.y * JOY_RADIUS : 0);

      const ready = this.engine.gameState === 'PLAYING' && this.engine.nearestMirrorInReach();
      if (ready !== this.rotateReady) {
        this.rotateReady = ready;
        this.$('touch-rotate').classList.toggle('ready', ready);
      }
      if (this.engine.activeCharacter !== this.swapSoul) {
        this.swapSoul = this.engine.activeCharacter;
        const btn = this.$('touch-swap');
        btn.classList.toggle('shadow', this.swapSoul === 'SHADOW');
        btn.querySelector('.touch-icon').textContent = this.swapSoul === 'LIGHT' ? '☀️' : '🌙';
      }
    }

    // ------------------------------------------------------------ joystick & buttons
    bindTouchControls() {
      const zone = this.$('joystick-zone');
      const base = this.$('joystick-base');

      const setFromPointer = (e) => {
        let dx = e.clientX - this.joy.cx;
        let dy = e.clientY - this.joy.cy;
        const len = Math.hypot(dx, dy);
        if (len > JOY_RADIUS) {
          dx = (dx / len) * JOY_RADIUS;
          dy = (dy / len) * JOY_RADIUS;
        }
        this.joy.x = dx / JOY_RADIUS;
        this.joy.y = dy / JOY_RADIUS;
        this.placeKnob(dx, dy);
      };

      zone.addEventListener('pointerdown', (e) => {
        if (this.joy.active) return;
        e.preventDefault();
        this.noteTouch(e);
        this.requestTiltPermissionIfPending();
        // Fixed or floating joystick mode
        const rect = zone.getBoundingClientRect();
        let cx = Math.min(Math.max(e.clientX, rect.left + JOY_RADIUS), rect.right - JOY_RADIUS);
        let cy = Math.min(Math.max(e.clientY, rect.top + JOY_RADIUS), rect.bottom - JOY_RADIUS);
        if (this.settings.joystickType === 'fixed') {
          cx = rect.left + rect.width / 2;
          cy = rect.top + rect.height / 2;
        }
        Object.assign(this.joy, { active: true, pointerId: e.pointerId, cx, cy });
        base.style.left = `${cx - rect.left}px`;
        base.style.top = `${cy - rect.top}px`;
        base.classList.add('active');
        if (zone.setPointerCapture) zone.setPointerCapture(e.pointerId);
        setFromPointer(e);
      });
      zone.addEventListener('pointermove', (e) => {
        if (this.joy.active && e.pointerId === this.joy.pointerId) {
          e.preventDefault();
          setFromPointer(e);
        }
      });
      const release = (e) => {
        if (!this.joy.active || e.pointerId !== this.joy.pointerId) return;
        Object.assign(this.joy, { active: false, pointerId: null, x: 0, y: 0 });
        base.classList.remove('active');
        base.style.left = '';
        base.style.top = '';
        this.placeKnob(0, 0);
      };
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => zone.addEventListener(ev, release));

      const press = (id, action) => {
        const btn = this.$(id);
        btn.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          this.noteTouch(e);
          btn.classList.add('pressed');
          if (this.engine.gameState === 'PLAYING' && !this.engine.isModalOpen()) action();
        });
        ['pointerup', 'pointercancel', 'pointerleave'].forEach((ev) => btn.addEventListener(ev, () => btn.classList.remove('pressed')));
        btn.addEventListener('contextmenu', (e) => e.preventDefault());
      };
      press('touch-swap', () => this.engine.swapCharacter());
      press('touch-rotate', () => this.engine.interact());
      press('touch-undo', () => this.engine.rewindStep());

      // Auto mode: the first real touch anywhere reveals the touch controls
      window.addEventListener('pointerdown', (e) => {
        this.noteTouch(e);
        this.requestTiltPermissionIfPending(); // any tap counts as the gesture iOS needs
      }, true);
    }

    placeKnob(dx, dy) {
      this.$('joystick-knob').style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    }

    noteTouch(e) {
      if (e.pointerType === 'touch' && !this.touchDetected) {
        this.touchDetected = true;
        this.applySettings();
      }
    }

    // ------------------------------------------------------------ layout
    bindLayout() {
      const refit = () => this.fitCanvas();
      window.addEventListener('resize', refit);
      window.addEventListener('orientationchange', () => {
        this.tilt.neutral = null; // the axes changed: re-calibrate from the next reading
        setTimeout(refit, 250);
      });
      if (window.ResizeObserver) new ResizeObserver(refit).observe(this.$('canvas-container'));

      const fsBtn = this.$('btn-fullscreen');
      const root = document.documentElement;
      if (!root.requestFullscreen && !root.webkitRequestFullscreen) {
        fsBtn.classList.add('unsupported');
      }
      fsBtn.addEventListener('click', () => {
        const isFs = document.fullscreenElement || document.webkitFullscreenElement;
        if (isFs) {
          (document.exitFullscreen || document.webkitExitFullscreen).call(document);
          return;
        }
        const req = root.requestFullscreen || root.webkitRequestFullscreen;
        Promise.resolve(req.call(root)).then(() => {
          // Keep the current orientation while tilting (Android, fullscreen only)
          const so = window.screen.orientation;
          if (this.settings.tilt && so && so.lock) so.lock(so.type).catch(() => {});
        }).catch(() => {});
      });
      this.fitCanvas();
    }

    // Scale the 900x650 playfield to the largest size that fits its panel (crisp, no distortion)
    fitCanvas() {
      const container = this.$('canvas-container');
      const wrapper = this.$('canvas-wrapper');
      if (!container || !wrapper) return;
      const touch = document.body.classList.contains('touch-ui');
      const pad = touch ? 4 : 16;
      const w = container.clientWidth - pad * 2;
      const h = container.clientHeight - pad * 2;
      if (w <= 0 || h <= 0) return;
      const scale = Math.min(w / VIRTUAL_W, h / VIRTUAL_H, touch ? 3 : 1.4);
      wrapper.style.width = `${Math.floor(VIRTUAL_W * scale)}px`;
      wrapper.style.height = `${Math.floor(VIRTUAL_H * scale)}px`;
    }

    // ------------------------------------------------------------ settings
    applySettings() {
      const s = this.settings;
      const showTouch = s.touchControls === 'on' || (s.touchControls === 'auto' && this.touchDetected);
      document.body.classList.toggle('touch-ui', showTouch);
      document.body.classList.toggle('left-handed', !!s.leftHanded);
      this.$('touch-controls').classList.toggle('hidden', !showTouch);
      this.$('touch-controls').setAttribute('aria-hidden', String(!showTouch));
      this.$('tilt-indicator').classList.toggle('hidden', !s.tilt);
      this.syncSettingsUI();
      // Layout changed: let the browser reflow, then fit the playfield
      requestAnimationFrame(() => this.fitCanvas());
    }

    save() {
      this.engine.saveSettings();
      this.applySettings();
    }

    syncSettingsUI() {
      const s = this.settings;
      const mark = (groupId, value) => {
        const el = this.$(groupId);
        if (el) el.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b.dataset.value === value));
      };
      mark('set-touch', s.touchControls);
      mark('set-joy-type', s.joystickType || 'floating');
      mark('set-tilt-sens', s.tiltSensitivity);
      this.$('set-tilt').checked = !!s.tilt;
      this.$('set-lefty').checked = !!s.leftHanded;
      this.$('set-vibration').checked = s.vibration !== false;
      this.$('row-tilt-sens').classList.toggle('disabled', !s.tilt);
      this.$('row-calibrate').classList.toggle('disabled', !s.tilt);
      if (!(navigator.vibrate)) this.$('row-vibration').classList.add('disabled');
    }

    bindSettings() {
      this.$('btn-settings').addEventListener('click', () => {
        this.syncSettingsUI();
        this.engine.keys = {};
        this.$('settings-modal').classList.remove('hidden');
      });
      this.$('btn-close-settings').addEventListener('click', () => this.$('settings-modal').classList.add('hidden'));
      this.$('settings-modal').addEventListener('click', (e) => {
        if (e.target === this.$('settings-modal')) this.$('settings-modal').classList.add('hidden');
      });

      const segmented = (groupId, key) => {
        const el = this.$(groupId);
        if (!el) return;
        el.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
          this.settings[key] = b.dataset.value;
          this.save();
        }));
      };
      segmented('set-touch', 'touchControls');
      segmented('set-joy-type', 'joystickType');
      segmented('set-tilt-sens', 'tiltSensitivity');

      this.$('set-tilt').addEventListener('change', async (e) => {
        if (e.target.checked) {
          const ok = await this.enableTilt();
          this.settings.tilt = ok;
        } else {
          this.disableTilt();
          this.settings.tilt = false;
          this.setTiltStatus('Steer by tilting your phone. The joystick still works and overrides tilt while you touch it.');
        }
        this.save();
      });
      this.$('btn-calibrate').addEventListener('click', () => {
        this.tilt.neutral = null; // next sensor reading becomes "level"
        this.setTiltStatus(this.tilt.listening ? 'Calibrated: this angle is now "standing still".' : 'Turn on Tilt to move first.');
        this.engine.haptic(20);
      });
      this.$('set-lefty').addEventListener('change', (e) => {
        this.settings.leftHanded = e.target.checked;
        this.save();
      });
      this.$('set-vibration').addEventListener('change', (e) => {
        this.settings.vibration = e.target.checked;
        this.save();
        this.engine.haptic(30);
      });
    }

    setTiltStatus(text) {
      this.$('tilt-status').textContent = text;
    }

    // ------------------------------------------------------------ tilt sensor
    async enableTilt() {
      if (typeof window.DeviceOrientationEvent === 'undefined') {
        this.setTiltStatus('This device or browser has no tilt sensor.');
        return false;
      }
      if (typeof window.DeviceOrientationEvent.requestPermission === 'function') {
        // iOS: permission must be requested from a tap (this change event is one)
        try {
          const result = await window.DeviceOrientationEvent.requestPermission();
          if (result !== 'granted') {
            this.setTiltStatus('Motion access was denied. Allow it in Safari settings to use tilt.');
            return false;
          }
        } catch (err) {
          this.setTiltStatus('Motion access could not be requested (HTTPS is required).');
          return false;
        }
      }
      this.startTilt();
      this.setTiltStatus('Tilt on: hold the phone comfortably — that angle means "stand still". Turn on your phone\'s rotation lock.');
      // No readings at all = no sensor (e.g. desktop, or http:// on some browsers)
      setTimeout(() => {
        if (this.tilt.listening && !this.tilt.lastEvent) {
          this.setTiltStatus('No tilt readings received. This device may not have a motion sensor (HTTPS is required).');
        }
      }, 1500);
      return true;
    }

    // Saved "tilt on": Android starts straight away, iOS needs one tap to re-grant permission
    resumeTiltOnLoad() {
      if (typeof window.DeviceOrientationEvent === 'undefined') return;
      if (typeof window.DeviceOrientationEvent.requestPermission === 'function') {
        this.tilt.pendingPermission = true;
        this.$('tilt-indicator').textContent = '📱 TAP TO ENABLE TILT';
      } else {
        this.startTilt();
      }
    }

    requestTiltPermissionIfPending() {
      if (!this.tilt.pendingPermission) return;
      this.tilt.pendingPermission = false;
      window.DeviceOrientationEvent.requestPermission().then((r) => {
        if (r === 'granted') this.startTilt();
      }).catch(() => {});
    }

    startTilt() {
      if (this.tilt.listening) return;
      this.tilt.listening = true;
      this.tilt.neutral = null;
      this.tilt.lastEvent = 0;
      this.$('tilt-indicator').textContent = '📱 TILT';
      window.addEventListener('deviceorientation', this.onOrientation);
    }

    disableTilt() {
      this.tilt.listening = false;
      this.tilt.vec = { x: 0, y: 0 };
      this.tilt.target = { x: 0, y: 0 };
      window.removeEventListener('deviceorientation', this.onOrientation);
    }

    onOrientation(e) {
      if (e.beta === null || e.gamma === null) return;
      this.tilt.lastEvent = Date.now();
      const raw = mapTilt(e.beta, e.gamma, screenAngle());
      if (!this.tilt.neutral) this.tilt.neutral = raw; // auto-calibrate to the current pose
      const full = TILT_FULL_DEG[this.settings.tiltSensitivity] || TILT_FULL_DEG.medium;
      this.tilt.target = tiltVector(raw, this.tilt.neutral, full);
    }
  }

  window.MobileControls = MobileControls;
  window.MobileControlsUtil = { mapTilt, tiltVector, screenAngle, TILT_FULL_DEG, JOY_RADIUS };
})();
