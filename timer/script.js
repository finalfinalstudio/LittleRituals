const $=id=>document.getElementById(id);
const els={timer:$('timer'),frame:$('sceneFrame'),bar:$('bar'),percent:$('percent'),left:$('left'),hours:$('hours'),minutes:$('minutes'),seconds:$('seconds'),start:$('startBtn'),pause:$('pauseBtn'),reset:$('resetBtn'),sound:$('sound'),hide:$('hideSettings'),settings:$('settings'),show:$('showSettings'),bg:$('background'),modal:$('doneModal'),restart:$('restartBtn'),app:document.querySelector('.app')};
const FRAME_COUNT=12;
let totalMs=25*60*1000,remainingMs=totalMs,endAt=0,running=false,raf=null,lastFrame=-1;

const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function durationMs(){const h=clamp(+els.hours.value||0,0,23),m=clamp(+els.minutes.value||0,0,59),s=clamp(+els.seconds.value||0,0,59);return Math.max(1000,(h*3600+m*60+s)*1000)}
function fmt(ms){let n=Math.max(0,Math.ceil(ms/1000)),h=Math.floor(n/3600),m=Math.floor(n%3600/60),s=n%60;return h?`${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`:`${m}:${String(s).padStart(2,'0')}`}
function progress(){return totalMs?clamp(1-remainingMs/totalMs,0,1):0}
function setFrame(p){const i=Math.min(FRAME_COUNT,Math.floor(p*(FRAME_COUNT-1))+1);if(i===lastFrame)return;lastFrame=i;els.frame.style.opacity=.55;setTimeout(()=>{els.frame.src=`assets/growing-flower/${String(i).padStart(2,'0')}.webp`;els.frame.onload=()=>els.frame.style.opacity=1},90)}
function render(){const p=progress();els.timer.textContent=fmt(remainingMs);els.left.textContent=`${fmt(remainingMs)} left`;els.percent.textContent=`${Math.round(p*100)}%`;els.bar.style.width=`${p*100}%`;setFrame(p)}
function start(){if(running||remainingMs<=0)return;running=true;endAt=performance.now()+remainingMs;tick()}
function pause(){if(!running)return;remainingMs=Math.max(0,endAt-performance.now());running=false;cancelAnimationFrame(raf);render()}
function reset(){running=false;cancelAnimationFrame(raf);totalMs=durationMs();remainingMs=totalMs;lastFrame=-1;els.modal.classList.add('hidden');render()}
function tick(){if(!running)return;remainingMs=Math.max(0,endAt-performance.now());render();if(remainingMs<=0){running=false;els.modal.classList.remove('hidden');if(els.sound.checked)chime();return}raf=requestAnimationFrame(tick)}
function chime(){try{const c=new(window.AudioContext||window.webkitAudioContext)(),t=c.currentTime;[523.25,659.25,783.99].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.frequency.value=f;g.gain.setValueAtTime(.001,t+i*.12);g.gain.exponentialRampToValueAtTime(.1,t+i*.12+.02);g.gain.exponentialRampToValueAtTime(.001,t+i*.12+.55);o.connect(g).connect(c.destination);o.start(t+i*.12);o.stop(t+i*.12+.6)})}catch(e){}}
function luminance(hex){const c=hex.replace('#','');const rgb=[0,2,4].map(i=>parseInt(c.slice(i,i+2),16)/255).map(v=>v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4));return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]}
function applyBg(c){document.documentElement.style.setProperty('--bg',c);document.body.classList.toggle('dark-ui',luminance(c)<.28);localStorage.setItem('lr-bg',c)}
els.start.onclick=start;els.pause.onclick=pause;els.reset.onclick=reset;els.restart.onclick=reset;
[els.hours,els.minutes,els.seconds].forEach(x=>x.onchange=()=>{if(!running)reset()});
els.hide.onchange=()=>{els.app.classList.toggle('settings-hidden',els.hide.checked);els.show.classList.toggle('hidden',!els.hide.checked);localStorage.setItem('lr-hide',els.hide.checked?'1':'0')};
els.show.onclick=()=>{els.hide.checked=false;els.hide.onchange()};
els.bg.oninput=()=>applyBg(els.bg.value);
(function restore(){const bg=localStorage.getItem('lr-bg')||'#f7efdc';els.bg.value=bg;applyBg(bg);if(localStorage.getItem('lr-hide')==='1'){els.hide.checked=true;els.hide.onchange()}render()})();
