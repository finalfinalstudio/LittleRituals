
const $=s=>document.querySelector(s);
const app=$('.app'), visual=$('.visual'), mainVideo=$('#mainVideo'), idleVideo=$('#idleVideo');
const display=$('#timeDisplay'), progressFill=$('#progressFill'), slider=$('#durationSlider'), output=$('#durationOutput');
let totalSeconds=25*60, remaining=totalSeconds, running=false, finished=false, startStamp=0, startRemaining=remaining, raf=0, lastSeek=0;

function fmt(sec){sec=Math.max(0,Math.ceil(sec));return `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`}
function setDuration(minutes){running=false;cancelAnimationFrame(raf);totalSeconds=minutes*60;remaining=totalSeconds;finished=false;visual.classList.remove('idle');idleVideo.pause();idleVideo.currentTime=0;mainVideo.pause();seekMain(0,true);slider.value=minutes;output.value=`${minutes} min`;display.textContent=fmt(remaining);progressFill.style.width='0%';document.querySelectorAll('.presets button').forEach(b=>b.classList.toggle('active',+b.dataset.minutes===minutes));}
function seekMain(progress,force=false){if(!Number.isFinite(mainVideo.duration)||mainVideo.duration<=0)return;const now=performance.now();if(!force&&now-lastSeek<85)return;lastSeek=now;const target=Math.min(Math.max(progress,0),1)*Math.max(0,mainVideo.duration-.025);if(Math.abs(mainVideo.currentTime-target)>.025)mainVideo.currentTime=target;}
function tick(now){if(!running)return;remaining=Math.max(0,startRemaining-(now-startStamp)/1000);const progress=1-remaining/totalSeconds;display.textContent=fmt(remaining);progressFill.style.width=`${progress*100}%`;seekMain(progress);if(remaining<=0){finish();return}raf=requestAnimationFrame(tick)}
function start(){if(finished)setDuration(+slider.value);if(running)return;running=true;startRemaining=remaining;startStamp=performance.now();raf=requestAnimationFrame(tick)}
function pause(){if(!running)return;running=false;cancelAnimationFrame(raf)}
function reset(){setDuration(+slider.value)}
async function finish(){running=false;finished=true;remaining=0;display.textContent='00:00';progressFill.style.width='100%';seekMain(1,true);visual.classList.add('idle');idleVideo.currentTime=0;try{await idleVideo.play()}catch{}playFinishSound($('#soundSelect').value)}
slider.addEventListener('input',()=>setDuration(+slider.value));document.querySelectorAll('.presets button').forEach(b=>b.addEventListener('click',()=>setDuration(+b.dataset.minutes)));
$('#startButton').addEventListener('click',start);$('#pauseButton').addEventListener('click',pause);$('#resetButton').addEventListener('click',reset);
$('#hideSettings').addEventListener('change',e=>app.classList.toggle('settings-hidden',e.target.checked));$('#openSettings').addEventListener('click',()=>{app.classList.remove('settings-hidden');$('#hideSettings').checked=false});
mainVideo.addEventListener('loadedmetadata',()=>seekMain(0,true));mainVideo.muted=true;idleVideo.muted=true;

let audioCtx;
function tone(ctx,freq,start,dur,gain=.12,type='sine'){const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,start);g.gain.setValueAtTime(0,start);g.gain.linearRampToValueAtTime(gain,start+.018);g.gain.exponentialRampToValueAtTime(.0001,start+dur);o.connect(g).connect(ctx.destination);o.start(start);o.stop(start+dur+.03)}
function playFinishSound(name){if(name==='none')return;audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();const c=audioCtx,t=c.currentTime+.03;const map={
 'soft-chime':()=>{tone(c,659,t,1.7,.10);tone(c,988,t+.08,1.8,.055)},
 'glass-bell':()=>{tone(c,1046,t,1.2,.09,'sine');tone(c,1568,t+.03,1.0,.04)},
 'singing-bowl':()=>{tone(c,220,t,2.8,.10);tone(c,440,t+.02,2.4,.035)},
 'wind-chime':()=>{[784,988,1175].forEach((f,i)=>tone(c,f,t+i*.16,1.4,.055))},
 'wood-knock':()=>{tone(c,150,t,.18,.17,'triangle');tone(c,110,t+.08,.20,.09,'triangle')},
 'forest-bell':()=>{tone(c,523,t,2.1,.08);tone(c,784,t+.12,1.8,.04)},
 'gentle-piano':()=>{[261.6,329.6,392].forEach((f,i)=>tone(c,f,t+i*.035,2.2,.045,'triangle'))}
};(map[name]||map['soft-chime'])()}
setDuration(25);
