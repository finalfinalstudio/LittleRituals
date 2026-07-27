const el = {
  start: document.getElementById('startBtn'),
  pause: document.getElementById('pauseBtn'),
  reset: document.getElementById('resetBtn'),
  timer: document.getElementById('timerDisplay'),
  progress: document.getElementById('progressBar'),
  percent: document.getElementById('progressPercent'),
  remaining: document.getElementById('remainingLabel'),
  hours: document.getElementById('hoursInput'),
  minutes: document.getElementById('minutesInput'),
  seconds: document.getElementById('secondsInput'),
  animation: document.getElementById('animationSelect'),
  background: document.getElementById('backgroundInput'),
  theme: document.getElementById('themeBtn'),
  hideSettings: document.getElementById('hideSettingsToggle'),
  showSettings: document.getElementById('showSettingsBtn'),
  app: document.getElementById('app'),
  backgroundSwatch: document.getElementById('backgroundSwatch'),
  sound: document.getElementById('soundToggle'),
  status: document.getElementById('statusText'),
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
  el.mount.style.transform = `scale(${1 + (progress * 0.06)})`;
  FocusAnimations.update(animationType, progress);
}

function setStatus(text) {
  el.status.textContent = text;
}

function startTimer() {
  if (running) return;
  if (remainingMs <= 0) {
    totalMs = readDuration();
    remainingMs = totalMs;
  }
  running = true;
  endAt = performance.now() + remainingMs;
  setStatus('running');
  tick();
}

function pauseTimer() {
  if (!running) return;
  remainingMs = Math.max(0, endAt - performance.now());
  running = false;
  if (frameId) cancelAnimationFrame(frameId);
  frameId = null;
  setStatus('paused');
  render();
}

function resetTimer() {
  running = false;
  if (frameId) cancelAnimationFrame(frameId);
  frameId = null;
  totalMs = readDuration();
  remainingMs = totalMs;
  el.overlay.hidden = true;
  setStatus('ready');
  render();
}

function tick() {
  if (!running) return;
  remainingMs = Math.max(0, endAt - performance.now());
  render();
  if (remainingMs <= 0) {
    running = false;
    setStatus('complete');
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
      gain.gain.exponentialRampToValueAtTime(0.14, now + index * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.12 + 0.55);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start(now + index * 0.12);
      oscillator.stop(now + index * 0.12 + 0.6);
    });
  } catch (_) {}
}

function applyAnimation() {
  animationType = el.animation.value;
  FocusAnimations.build(animationType, el.mount);
  render();
}

function saveSettings() {
  localStorage.setItem('focusTimerSettings', JSON.stringify({
    theme: document.body.classList.contains('dark') ? 'dark' : 'light',
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
    const settings = JSON.parse(localStorage.getItem('focusTimerSettings') || '{}');
    if (settings.theme === 'dark') {
      document.body.classList.add('dark');
      el.theme.textContent = 'light mode';
    }
    if (settings.settingsHidden) {
      setSettingsHidden(true, false);
    }
    if (settings.background) {
      el.background.value = settings.background;
      document.documentElement.style.setProperty('--bg', settings.background);
      el.backgroundSwatch.style.background = settings.background;
    }
    if (typeof settings.sound === 'boolean') el.sound.checked = settings.sound;
    if (settings.duration) {
      el.hours.value = settings.duration.hours ?? 0;
      el.minutes.value = settings.duration.minutes ?? 25;
      el.seconds.value = settings.duration.seconds ?? 0;
    }
  } catch (_) {}
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
  document.documentElement.style.setProperty('--bg', el.background.value);
  el.backgroundSwatch.style.background = el.background.value;
  saveSettings();
});

el.theme.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  el.theme.textContent = document.body.classList.contains('dark') ? 'light mode' : 'dark mode';
  saveSettings();
});

function setSettingsHidden(hidden, persist = true) {
  el.app.classList.toggle('settings-hidden', hidden);
  el.hideSettings.checked = hidden;
  el.showSettings.hidden = !hidden;
  if (persist) saveSettings();
}

el.hideSettings.addEventListener('change', () => {
  setSettingsHidden(el.hideSettings.checked);
});

el.showSettings.addEventListener('click', () => {
  setSettingsHidden(false);
});

el.sound.addEventListener('change', saveSettings);
function restartFromDone() {
  el.overlay.hidden = true;
  el.overlay.style.display = 'none';
  resetTimer();
  requestAnimationFrame(() => {
    el.overlay.style.removeProperty('display');
  });
}

window.restartFromDone = restartFromDone;

el.closeDone.addEventListener('click', event => {
  event.preventDefault();
  event.stopPropagation();
  restartFromDone();
});

el.overlay.addEventListener('click', event => {
  if (event.target === el.overlay) restartFromDone();
});

restoreSettings();
el.backgroundSwatch.style.background = el.background.value;
totalMs = readDuration();
remainingMs = totalMs;
applyAnimation();
render();
