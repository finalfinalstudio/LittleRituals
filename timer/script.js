const el = {
  app: document.getElementById('app'),
  timer: document.getElementById('timerDisplay'),
  progress: document.getElementById('progressBar'),
  percent: document.getElementById('progressPercent'),
  remaining: document.getElementById('remainingLabel'),
  hours: document.getElementById('hoursInput'),
  minutes: document.getElementById('minutesInput'),
  seconds: document.getElementById('secondsInput'),
  animation: document.getElementById('animationSelect'),
  background: document.getElementById('backgroundInput'),
  backgroundSwatch: document.getElementById('backgroundSwatch'),
  darkMode: document.getElementById('darkModeToggle'),
  hideSettings: document.getElementById('hideSettingsToggle'),
  showSettings: document.getElementById('showSettingsBtn'),
  start: document.getElementById('startBtn'),
  pause: document.getElementById('pauseBtn'),
  reset: document.getElementById('resetBtn'),
  sound: document.getElementById('soundToggle'),
  mount: document.getElementById('animationMount'),
  overlay: document.getElementById('doneOverlay'),
  closeDone: document.getElementById('closeDoneBtn')
};

let totalMs = 25 * 60 * 1000;
let remainingMs = totalMs;
let endAt = 0;
let running = false;
let frameId = null;
let animationType = 'jar';

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function readDuration() {
  const h = clamp(Number(el.hours.value) || 0, 0, 23);
  const m = clamp(Number(el.minutes.value) || 0, 0, 59);
  const s = clamp(Number(el.seconds.value) || 0, 0, 59);
  return Math.max(1000, ((h * 3600) + (m * 60) + s) * 1000);
}

function formatTime(ms) {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`;
}

function progressValue() {
  return totalMs ? clamp(1 - (remainingMs / totalMs), 0, 1) : 0;
}

function render() {
  const progress = progressValue();
  el.timer.textContent = formatTime(remainingMs);
  el.progress.style.width = `${progress * 100}%`;
  el.percent.textContent = `${Math.round(progress * 100)}%`;
  el.remaining.textContent = `${formatTime(remainingMs)} left`;
  el.mount.style.transform = `scale(${1 + progress * 0.035})`;
  FocusAnimations.update(animationType, progress);
}

function startTimer() {
  if (running) return;
  if (remainingMs <= 0) {
    totalMs = readDuration();
    remainingMs = totalMs;
  }
  running = true;
  endAt = performance.now() + remainingMs;
  tick();
}

function pauseTimer() {
  if (!running) return;
  remainingMs = Math.max(0, endAt - performance.now());
  running = false;
  if (frameId) cancelAnimationFrame(frameId);
  frameId = null;
  render();
}

function resetTimer() {
  running = false;
  if (frameId) cancelAnimationFrame(frameId);
  frameId = null;
  totalMs = readDuration();
  remainingMs = totalMs;
  el.overlay.hidden = true;
  render();
}

function tick() {
  if (!running) return;
  remainingMs = Math.max(0, endAt - performance.now());
  render();
  if (remainingMs <= 0) {
    running = false;
    el.overlay.hidden = false;
    if (el.sound.checked) playChime();
    return;
  }
  frameId = requestAnimationFrame(tick);
}

function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((frequency, index) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.001, now + index * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.11, now + index * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.12 + 0.5);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start(now + index * 0.12);
      oscillator.stop(now + index * 0.12 + 0.55);
    });
  } catch (_) {}
}

function applyAnimation() {
  animationType = el.animation.value;
  FocusAnimations.build(animationType, el.mount);
  render();
}

function hexToRgb(hex) {
  const value = hex.replace('#', '');
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16)
  };
}

function mix(rgb, target, amount) {
  return {
    r: Math.round(rgb.r + (target.r - rgb.r) * amount),
    g: Math.round(rgb.g + (target.g - rgb.g) * amount),
    b: Math.round(rgb.b + (target.b - rgb.b) * amount)
  };
}

function rgba(rgb, alpha) {
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

function applyTheme() {
  const bg = hexToRgb(el.background.value);
  const forceDark = el.darkMode.checked;
  const luminance = (0.2126 * bg.r + 0.7152 * bg.g + 0.0722 * bg.b) / 255;
  const dark = forceDark || luminance < 0.43;
  const panelBase = dark ? mix(bg, { r: 255, g: 255, b: 255 }, 0.11) : mix(bg, { r: 255, g: 255, b: 255 }, 0.72);
  const panelStrong = dark ? mix(bg, { r: 255, g: 255, b: 255 }, 0.16) : mix(bg, { r: 255, g: 255, b: 255 }, 0.88);
  const stage = dark ? mix(bg, { r: 255, g: 255, b: 255 }, 0.07) : mix(bg, { r: 255, g: 255, b: 255 }, 0.55);
  const text = dark ? { r: 241, g: 243, b: 247 } : { r: 37, g: 40, b: 45 };
  const muted = dark ? { r: 175, g: 181, b: 191 } : { r: 122, g: 128, b: 137 };
  const border = dark ? { r: 255, g: 255, b: 255 } : { r: 29, g: 33, b: 39 };

  document.body.classList.toggle('dark', dark);
  document.documentElement.style.setProperty('--bg', el.background.value);
  document.documentElement.style.setProperty('--panel', rgba(panelBase, dark ? 0.78 : 0.74));
  document.documentElement.style.setProperty('--panel-strong', rgba(panelStrong, dark ? 0.91 : 0.92));
  document.documentElement.style.setProperty('--stage', rgba(stage, dark ? 0.72 : 0.64));
  document.documentElement.style.setProperty('--text', `rgb(${text.r}, ${text.g}, ${text.b})`);
  document.documentElement.style.setProperty('--muted', `rgb(${muted.r}, ${muted.g}, ${muted.b})`);
  document.documentElement.style.setProperty('--border', rgba(border, dark ? 0.12 : 0.11));
  document.documentElement.style.setProperty('--track', rgba(border, dark ? 0.10 : 0.08));
  el.backgroundSwatch.style.background = el.background.value;
}

function saveSettings() {
  localStorage.setItem('focusTimerSettingsV5', JSON.stringify({
    darkMode: el.darkMode.checked,
    settingsHidden: el.app.classList.contains('settings-hidden'),
    background: el.background.value,
    sound: el.sound.checked,
    duration: {
      hours: el.hours.value,
      minutes: el.minutes.value,
      seconds: el.seconds.value
    }
  }));
}

function restoreSettings() {
  try {
    const settings = JSON.parse(localStorage.getItem('focusTimerSettingsV5') || '{}');
    if (typeof settings.darkMode === 'boolean') el.darkMode.checked = settings.darkMode;
    if (settings.background) el.background.value = settings.background;
    if (typeof settings.sound === 'boolean') el.sound.checked = settings.sound;
    if (settings.duration) {
      el.hours.value = settings.duration.hours ?? 0;
      el.minutes.value = settings.duration.minutes ?? 25;
      el.seconds.value = settings.duration.seconds ?? 0;
    }
    if (settings.settingsHidden) setSettingsHidden(true, false);
  } catch (_) {}
  applyTheme();
}

function setSettingsHidden(hidden, persist = true) {
  el.app.classList.toggle('settings-hidden', hidden);
  el.hideSettings.checked = hidden;
  el.showSettings.hidden = !hidden;
  if (persist) saveSettings();
}

function restartFromDone() {
  el.overlay.hidden = true;
  resetTimer();
}

el.start.addEventListener('click', () => {
  if (!running && remainingMs === totalMs) {
    totalMs = readDuration();
    remainingMs = totalMs;
  }
  startTimer();
});
el.pause.addEventListener('click', pauseTimer);
el.reset.addEventListener('click', resetTimer);
el.animation.addEventListener('change', applyAnimation);

[el.hours, el.minutes, el.seconds].forEach(input => {
  input.addEventListener('change', () => {
    if (!running) {
      totalMs = readDuration();
      remainingMs = totalMs;
      render();
      saveSettings();
    }
  });
});

el.background.addEventListener('input', () => {
  applyTheme();
  saveSettings();
});
el.darkMode.addEventListener('change', () => {
  applyTheme();
  saveSettings();
});
el.hideSettings.addEventListener('change', () => setSettingsHidden(el.hideSettings.checked));
el.showSettings.addEventListener('click', () => setSettingsHidden(false));
el.sound.addEventListener('change', saveSettings);
el.closeDone.addEventListener('click', restartFromDone);
el.overlay.addEventListener('click', event => {
  if (event.target === el.overlay) restartFromDone();
});

restoreSettings();
totalMs = readDuration();
remainingMs = totalMs;
applyAnimation();
render();
