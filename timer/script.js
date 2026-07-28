(() => {
  'use strict';

  const STORAGE_KEY = 'littleRitualsFocusTimerV10';
  const $ = id => document.getElementById(id);
  const el = {
    app: $('app'), start: $('startBtn'), pause: $('pauseBtn'), reset: $('resetBtn'),
    timer: $('timerDisplay'), progress: $('progressBar'), percent: $('progressPercent'), remaining: $('remainingLabel'),
    hours: $('hoursInput'), minutes: $('minutesInput'), seconds: $('secondsInput'), animation: $('animationSelect'),
    background: $('backgroundInput'), colorButton: $('colorButton'), sound: $('soundToggle'),
    hideSettings: $('hideSettingsToggle'), settingsPanel: $('settingsPanel'), showSettings: $('showSettingsBtn'),
    mount: $('animationMount'), overlay: $('doneOverlay'), restartDone: $('restartDoneBtn')
  };

  let totalMs = 25 * 60 * 1000;
  let remainingMs = totalMs;
  let endAt = 0;
  let running = false;
  let frameId = 0;
  let animationType = 'jar';

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function readDuration() {
    const h = clamp(Number(el.hours.value) || 0, 0, 23);
    const m = clamp(Number(el.minutes.value) || 0, 0, 59);
    const s = clamp(Number(el.seconds.value) || 0, 0, 59);
    return Math.max(1000, (h * 3600 + m * 60 + s) * 1000);
  }

  function formatTime(ms) {
    const seconds = Math.max(0, Math.ceil(ms / 1000));
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0 ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}` : `${m}:${String(s).padStart(2,'0')}`;
  }

  function progressValue() {
    return totalMs > 0 ? clamp(1 - remainingMs / totalMs, 0, 1) : 0;
  }

  function render() {
    const p = progressValue();
    el.timer.textContent = formatTime(remainingMs);
    el.progress.style.width = `${p * 100}%`;
    el.percent.textContent = `${Math.round(p * 100)}%`;
    el.remaining.textContent = `${formatTime(remainingMs)} left`;
    if (window.FocusAnimations) window.FocusAnimations.update(animationType, p, el.mount);
  }

  function startTimer() {
    if (running) return;
    if (remainingMs <= 0) {
      totalMs = readDuration();
      remainingMs = totalMs;
      buildAnimation();
    }
    running = true;
    endAt = performance.now() + remainingMs;
    tick();
  }

  function pauseTimer() {
    if (!running) return;
    remainingMs = Math.max(0, endAt - performance.now());
    running = false;
    cancelAnimationFrame(frameId);
    render();
  }

  function resetTimer() {
    running = false;
    cancelAnimationFrame(frameId);
    totalMs = readDuration();
    remainingMs = totalMs;
    el.overlay.hidden = true;
    buildAnimation();
    render();
  }

  function restartFromDone() {
    el.overlay.hidden = true;
    resetTimer();
  }

  function tick() {
    if (!running) return;
    remainingMs = Math.max(0, endAt - performance.now());
    render();
    if (remainingMs <= 0) {
      running = false;
      if (window.FocusAnimations) window.FocusAnimations.finish(animationType, el.mount);
      el.overlay.hidden = false;
      if (el.sound.checked) playChime();
      return;
    }
    frameId = requestAnimationFrame(tick);
  }

  function playChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((frequency, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = frequency;
        gain.gain.setValueAtTime(0.001, now + index * .12);
        gain.gain.exponentialRampToValueAtTime(.11, now + index * .12 + .03);
        gain.gain.exponentialRampToValueAtTime(.001, now + index * .12 + .58);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + index * .12);
        osc.stop(now + index * .12 + .62);
      });
    } catch (_) {}
  }

  function buildAnimation() {
    animationType = el.animation.value;
    if (!window.FocusAnimations) {
      el.mount.textContent = 'animation could not be loaded';
      return;
    }
    window.FocusAnimations.build(animationType, el.mount);
    render();
  }

  function isDark(hex) {
    const raw = hex.replace('#','');
    const r = parseInt(raw.slice(0,2),16);
    const g = parseInt(raw.slice(2,4),16);
    const b = parseInt(raw.slice(4,6),16);
    return ((r * 299 + g * 587 + b * 114) / 1000) < 142;
  }

  function mix(hex, target, amount) {
    const raw = hex.replace('#','');
    const rgb = [0,2,4].map(i => parseInt(raw.slice(i,i+2),16));
    const t = target === 'white' ? 255 : 0;
    const mixed = rgb.map(v => Math.round(v + (t - v) * amount));
    return `rgb(${mixed.join(',')})`;
  }

  function applyBackground() {
    const bg = el.background.value;
    const dark = isDark(bg);
    const root = document.documentElement.style;
    root.setProperty('--page-bg', bg);
    root.setProperty('--text', dark ? '#f5f2eb' : '#2f322f');
    root.setProperty('--muted', dark ? 'rgba(245,242,235,.68)' : '#74786f');
    root.setProperty('--panel-bg', dark ? mix(bg,'white',.08) : mix(bg,'white',.65));
    root.setProperty('--panel-strong', dark ? mix(bg,'white',.13) : mix(bg,'white',.82));
    root.setProperty('--border', dark ? 'rgba(255,255,255,.14)' : 'rgba(47,50,47,.13)');
    root.setProperty('--track', dark ? 'rgba(255,255,255,.13)' : 'rgba(47,50,47,.10)');
    root.setProperty('--shadow', dark ? '0 16px 42px rgba(0,0,0,.28)' : '0 16px 42px rgba(68,58,45,.10)');
    el.colorButton.style.background = bg;
    document.querySelector('meta[name="theme-color"]').setAttribute('content', bg);
  }

  function applySettingsVisibility(hidden) {
    el.hideSettings.checked = hidden;
    el.app.classList.toggle('settings-hidden', hidden);
    el.showSettings.hidden = !hidden;
  }

  function saveSettings() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      background: el.background.value,
      sound: el.sound.checked,
      hideSettings: el.hideSettings.checked,
      animation: el.animation.value,
      duration: { hours: el.hours.value, minutes: el.minutes.value, seconds: el.seconds.value }
    }));
  }

  function restoreSettings() {
    try {
      const settings = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (settings.background) el.background.value = settings.background;
      if (typeof settings.sound === 'boolean') el.sound.checked = settings.sound;
      if (settings.animation && [...el.animation.options].some(o => o.value === settings.animation)) el.animation.value = settings.animation;
      if (settings.duration) {
        el.hours.value = settings.duration.hours ?? 0;
        el.minutes.value = settings.duration.minutes ?? 25;
        el.seconds.value = settings.duration.seconds ?? 0;
      }
      applySettingsVisibility(Boolean(settings.hideSettings));
    } catch (_) {
      applySettingsVisibility(false);
    }
    applyBackground();
  }

  el.start.addEventListener('click', startTimer);
  el.pause.addEventListener('click', pauseTimer);
  el.reset.addEventListener('click', resetTimer);
  el.animation.addEventListener('change', () => { buildAnimation(); saveSettings(); });

  [el.hours, el.minutes, el.seconds].forEach(input => {
    input.addEventListener('change', () => {
      if (!running) {
        totalMs = readDuration();
        remainingMs = totalMs;
        render();
      }
      saveSettings();
    });
  });

  el.background.addEventListener('input', () => { applyBackground(); saveSettings(); });
  el.sound.addEventListener('change', saveSettings);
  el.hideSettings.addEventListener('change', () => { applySettingsVisibility(el.hideSettings.checked); saveSettings(); });
  el.showSettings.addEventListener('click', () => { applySettingsVisibility(false); saveSettings(); });
  el.restartDone.addEventListener('click', restartFromDone);
  el.overlay.addEventListener('click', event => { if (event.target === el.overlay) restartFromDone(); });

  restoreSettings();
  totalMs = readDuration();
  remainingMs = totalMs;
  buildAnimation();
})();
