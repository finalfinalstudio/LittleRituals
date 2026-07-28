const rituals = [
  { id: 'bloom', name: 'bloom', icon: 'assets/icons/bloom.svg', bg: '#e8eee2', accent: '#86a77d', text: '#2f3b2e', available: false },
  { id: 'glow', name: 'glow', icon: 'assets/icons/glow.svg', bg: '#15182a', accent: '#d7a354', text: '#f3ead8', available: false },
  { id: 'flow', name: 'flow', icon: 'assets/icons/flow.svg', bg: '#211c19', accent: '#bd9666', text: '#f1e5d3', available: false },
  { id: 'rise', name: 'rise', icon: 'assets/icons/rise.svg', bg: '#efe2d0', accent: '#d58d68', text: '#50382e', available: false },
  { id: 'read', name: 'read', icon: 'assets/icons/read.svg', bg: '#dfd5c4', accent: '#8c6f55', text: '#3a3029', available: false },
  { id: 'melt', name: 'melt', icon: 'assets/icons/melt.svg', bg: '#26333b', accent: '#9bcad7', text: '#e8f2f3', available: false },
  { id: 'fall', name: 'fall', icon: 'assets/icons/fall.svg', bg: '#33251f', accent: '#b86f48', text: '#f1dfcf', available: false },
  { id: 'grow', name: 'grow', icon: 'assets/icons/grow.svg', bg: '#1b2c24', accent: '#7faa83', text: '#e6efdf', available: false },
  { id: 'wonder', name: 'wonder', icon: 'assets/icons/wonder.svg', bg: '#101b18', accent: '#8fbe96', text: '#edf2df', available: true }
];

const widget = document.querySelector('.widget');
const mainVideo = document.getElementById('mainVideo');
const idleVideo = document.getElementById('idleVideo');
const timerDisplay = document.getElementById('timerDisplay');
const progressFill = document.getElementById('progressFill');
const durationSelect = document.getElementById('durationSelect');
const ritualList = document.getElementById('ritualList');
const activeRitualName = document.getElementById('activeRitualName');
const activeRitualIcon = document.getElementById('activeRitualIcon');
const finishSoundSelect = document.getElementById('finishSoundSelect');
const backgroundPicker = document.getElementById('backgroundPicker');
const hideSettings = document.getElementById('hideSettings');
const settingsToggle = document.getElementById('settingsToggle');

let totalMs = Number(durationSelect.value) * 60 * 1000;
let elapsedMs = 0;
let startedAt = null;
let running = false;
let rafId = null;
let currentRitual = 'wonder';

function loadWonderAssets() {
  mainVideo.src = 'assets/videos/wonder/wonder-main.mp4';
  idleVideo.src = 'assets/videos/wonder/wonder-idle.mp4';
  mainVideo.muted = true;
  idleVideo.muted = true;
  mainVideo.volume = 0;
  idleVideo.volume = 0;
  mainVideo.load();
  idleVideo.load();
}

function formatTime(ms) {
  const safe = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function syncMainVideo(progress) {
  if (!Number.isFinite(mainVideo.duration) || mainVideo.duration <= 0) return;
  mainVideo.pause();
  const safe = Math.min(0.999, Math.max(0, progress));
  const nextTime = safe * mainVideo.duration;
  if (Math.abs(mainVideo.currentTime - nextTime) > 0.025) mainVideo.currentTime = nextTime;
}

function render() {
  const progress = Math.min(1, elapsedMs / totalMs);
  timerDisplay.textContent = formatTime(totalMs - elapsedMs);
  progressFill.style.width = `${progress * 100}%`;
  if (progress < 1) syncMainVideo(progress);
}

function tick(now) {
  if (!running) return;
  elapsedMs = Math.min(totalMs, now - startedAt);
  render();
  if (elapsedMs >= totalMs) {
    finishTimer();
    return;
  }
  rafId = requestAnimationFrame(tick);
}

function startTimer() {
  stopIdle();
  if (elapsedMs >= totalMs) elapsedMs = 0;
  if (running) return;
  running = true;
  startedAt = performance.now() - elapsedMs;
  rafId = requestAnimationFrame(tick);
}

function pauseTimer() {
  if (!running) return;
  elapsedMs = Math.min(totalMs, performance.now() - startedAt);
  running = false;
  cancelAnimationFrame(rafId);
  render();
}

function resetTimer() {
  running = false;
  cancelAnimationFrame(rafId);
  elapsedMs = 0;
  stopIdle();
  render();
}

async function finishTimer() {
  running = false;
  cancelAnimationFrame(rafId);
  elapsedMs = totalMs;
  timerDisplay.textContent = '00:00';
  progressFill.style.width = '100%';
  if (Number.isFinite(mainVideo.duration)) mainVideo.currentTime = Math.max(0, mainVideo.duration - 0.04);
  await startIdle();
  playFinishSound();
}

async function startIdle() {
  idleVideo.currentTime = 0;
  idleVideo.classList.add('is-visible');
  try { await idleVideo.play(); } catch (_) {}
}

function stopIdle() {
  idleVideo.pause();
  idleVideo.currentTime = 0;
  idleVideo.classList.remove('is-visible');
}

function playFinishSound() {
  if (finishSoundSelect.value === 'none') return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  const ctx = new AudioContextClass();
  const now = ctx.currentTime;
  [523.25, 659.25, 783.99].forEach((frequency, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0, now + index * 0.12);
    gain.gain.linearRampToValueAtTime(0.08, now + index * 0.12 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.12 + 0.55);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + index * 0.12);
    osc.stop(now + index * 0.12 + 0.6);
  });
}

function renderRituals() {
  ritualList.innerHTML = '';
  rituals.forEach((ritual) => {
    const button = document.createElement('button');
    button.className = `ritual-option${ritual.id === currentRitual ? ' active' : ''}`;
    button.type = 'button';
    button.innerHTML = `<span class="option-icon"><img src="${ritual.icon}" alt=""></span><span>${ritual.name}</span>`;
    button.title = ritual.available ? ritual.name : `${ritual.name} — coming next`;
    button.addEventListener('click', () => selectRitual(ritual));
    ritualList.appendChild(button);
  });
}

function selectRitual(ritual) {
  currentRitual = ritual.id;
  activeRitualName.textContent = ritual.name;
  activeRitualIcon.src = ritual.icon;
  document.body.dataset.ritual = ritual.id;
  applyTheme(ritual);
  renderRituals();
  if (!ritual.available) {
    // Concept preview: theme changes, but Wonder remains the only supplied animation.
    return;
  }
}

function applyTheme(ritual) {
  document.documentElement.style.setProperty('--bg', ritual.bg);
  document.documentElement.style.setProperty('--accent', ritual.accent);
  document.documentElement.style.setProperty('--text', ritual.text);
  backgroundPicker.value = ritual.bg;
  const isDark = getLuminance(ritual.bg) < 0.46;
  document.documentElement.style.setProperty('--panel', isDark ? 'rgba(13,27,23,.82)' : 'rgba(255,255,255,.72)');
  document.documentElement.style.setProperty('--muted', isDark ? '#aebba7' : '#657064');
  document.documentElement.style.setProperty('--line', isDark ? 'rgba(237,242,223,.17)' : 'rgba(47,59,46,.16)');
}

function getLuminance(hex) {
  const rgb = hex.replace('#','').match(/.{2}/g).map(v => parseInt(v,16)/255);
  const linear = rgb.map(v => v <= .03928 ? v/12.92 : Math.pow((v+.055)/1.055,2.4));
  return .2126*linear[0]+.7152*linear[1]+.0722*linear[2];
}

durationSelect.addEventListener('change', () => {
  totalMs = Number(durationSelect.value) * 60 * 1000;
  resetTimer();
});
backgroundPicker.addEventListener('input', (event) => {
  const bg = event.target.value;
  document.documentElement.style.setProperty('--bg', bg);
  const active = rituals.find(r => r.id === currentRitual);
  applyTheme({ ...active, bg });
});
hideSettings.addEventListener('change', () => widget.classList.toggle('settings-hidden', hideSettings.checked));
settingsToggle.addEventListener('click', () => {
  hideSettings.checked = false;
  widget.classList.remove('settings-hidden');
});

document.getElementById('startButton').addEventListener('click', startTimer);
document.getElementById('pauseButton').addEventListener('click', pauseTimer);
document.getElementById('resetButton').addEventListener('click', resetTimer);
document.getElementById('mobileStart').addEventListener('click', startTimer);
document.getElementById('mobileReset').addEventListener('click', resetTimer);

loadWonderAssets();
renderRituals();
applyTheme(rituals.find(r => r.id === currentRitual));
render();
