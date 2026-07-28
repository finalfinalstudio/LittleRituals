(() => {
  'use strict';
  const clamp = n => Math.max(0, Math.min(1, n));
  const show = (node, amount) => { if (node) { node.style.opacity = String(clamp(amount)); node.style.transform = `scale(${.72 + .28 * clamp(amount)})`; } };
  const q = (mount, selector) => mount.querySelector(selector);
  const qa = (mount, selector) => [...mount.querySelectorAll(selector)];

  const defs = (accent = '#8ea34f') => `
    <defs>
      <filter id="paper"><feTurbulence baseFrequency=".75" numOctaves="2" seed="7" type="fractalNoise" result="n"/><feColorMatrix in="n" type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .045"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter>
      <filter id="soft"><feGaussianBlur stdDeviation="10"/></filter>
      <filter id="glow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <linearGradient id="paperBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#f5e9cf"/></linearGradient>
      <linearGradient id="wood" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#b78862"/><stop offset=".5" stop-color="#c99b73"/><stop offset="1" stop-color="#ad7d58"/></linearGradient>
      <radialGradient id="sunGlow"><stop stop-color="#fff7c2" stop-opacity=".95"/><stop offset="1" stop-color="#ffd16a" stop-opacity=".15"/></radialGradient>
      <style>
        .ink{stroke:#5d594e;stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round}.thin{stroke-width:2}.soft-line{stroke:#736c5f;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}.grow{transform-box:fill-box;transform-origin:center bottom}.petal{transform-box:fill-box;transform-origin:center}.leaf{transform-box:fill-box;transform-origin:center}.spark{filter:url(#glow)}
      </style>
    </defs>`;

  const base = (content, label, accent='#8ea34f') => `
    <svg viewBox="0 0 900 520" role="img" aria-label="${label}">
      ${defs(accent)}
      ${content}
      <rect width="900" height="520" fill="transparent" filter="url(#paper)" pointer-events="none"/>
    </svg>`;

  const scenes = {
    jar() {
      return base(`
        <rect width="900" height="520" fill="url(#paperBg)"/>
        <g opacity=".34" filter="url(#soft)"><rect x="65" y="48" width="230" height="240" rx="12" fill="#d8e7e9"/><path d="M180 48v240M65 165h230" stroke="#91acb0" stroke-width="10"/><ellipse cx="760" cy="240" rx="74" ry="120" fill="#8da17a"/></g>
        <rect y="366" width="900" height="154" fill="url(#wood)"/><path d="M0 410q180-18 360 2t540-4M30 472q180-25 390 3t450-12" fill="none" stroke="#8f664d" stroke-width="5" opacity=".3"/>
        <ellipse cx="450" cy="427" rx="150" ry="22" fill="#5e5048" opacity=".18" filter="url(#soft)"/>
        <defs><clipPath id="jarClip"><path d="M338 132q0-32 32-38h160q32 6 32 38v224q0 48-48 60H386q-48-12-48-60z"/></clipPath><linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#bcecff"/><stop offset="1" stop-color="#6db8df"/></linearGradient></defs>
        <g>
          <path d="M338 132q0-32 32-38h160q32 6 32 38v224q0 48-48 60H386q-48-12-48-60z" fill="#fff" fill-opacity=".18" stroke="#7ca5b8" stroke-width="8"/>
          <g clip-path="url(#jarClip)"><rect id="jarLiquid" x="338" y="406" width="224" height="0" fill="url(#water)"/><path id="jarWave" d="M326 400q58-28 115 0t135 0v52H326z" fill="#d1f3ff" opacity=".8"/>
            <g id="jarBubbles" fill="none" stroke="#fff" stroke-width="3" opacity="0"><circle cx="398" cy="355" r="6"/><circle cx="472" cy="380" r="9"/><circle cx="520" cy="344" r="5"/><circle cx="430" cy="310" r="4"/></g>
          </g>
          <rect x="365" y="74" width="170" height="43" rx="15" fill="#eef8fb" fill-opacity=".6" stroke="#7ca5b8" stroke-width="8"/>
          <path d="M375 145h150M372 175v164M527 178v174" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".6"/>
        </g>
        <g id="jarFinal" opacity="0"><circle cx="450" cy="235" r="38" fill="none" stroke="#fff" stroke-width="4" opacity=".5"/><circle cx="450" cy="235" r="62" fill="none" stroke="#fff" stroke-width="3" opacity=".3"/></g>
      `,'filling jar');
    },

    ice() {
      return base(`
        <rect width="900" height="520" fill="#dfeaf0"/>
        <rect y="350" width="900" height="170" fill="#cbdbe3"/><path d="M0 410q220-25 440 2t460-6" fill="none" stroke="#afc3cd" stroke-width="5" opacity=".5"/>
        <g opacity=".22" filter="url(#soft)"><circle cx="160" cy="110" r="80" fill="#fff"/><path d="M720 90q80 55 95 140" fill="none" stroke="#b9cbd2" stroke-width="35"/></g>
        <ellipse id="icePuddle" cx="450" cy="392" rx="70" ry="18" fill="#86c5e2" opacity=".42"/>
        <g id="iceCube" class="grow">
          <path d="M337 175l113-55 118 58-6 174-111 58-112-60z" fill="#bce8f7" fill-opacity=".72" stroke="#6baac5" stroke-width="7"/>
          <path d="M337 175l113 63 118-60-118-58z" fill="#e8f9ff" fill-opacity=".86"/>
          <path d="M450 238v172" stroke="#75bad6" stroke-width="5" opacity=".65"/>
          <path d="M380 182l54-28M490 161l45 25M370 258q30-22 55 8M474 298q42-34 66 5" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".8"/>
          <path d="M398 215l35 33-28 43M500 232l-29 46 31 39" fill="none" stroke="#7eb9d0" stroke-width="3" opacity=".55"/>
        </g>
        <g id="iceDrops" fill="#6bb7d5" opacity="0"><circle cx="360" cy="340" r="7"/><circle cx="550" cy="360" r="5"/><circle cx="512" cy="395" r="4"/></g>
        <g id="iceFinal" opacity="0"><path d="M400 390q50-15 100 0" fill="none" stroke="#fff" stroke-width="4"/><circle cx="450" cy="384" r="5" fill="#fff"/></g>
      `,'melting ice','#6baac5');
    },

    candle() {
      return base(`
        <rect width="900" height="520" fill="#f2dfc4"/><g opacity=".22" filter="url(#soft)"><ellipse cx="160" cy="190" rx="100" ry="160" fill="#b98961"/><ellipse cx="760" cy="170" rx="80" ry="130" fill="#8b9b76"/></g>
        <rect y="370" width="900" height="150" fill="url(#wood)"/>
        <ellipse cx="450" cy="425" rx="155" ry="32" fill="#6f4d32" opacity=".25"/><ellipse cx="450" cy="398" rx="115" ry="36" fill="#9d6d3f" stroke="#704926" stroke-width="6"/>
        <g id="candleBody" class="grow"><rect id="wax" x="385" y="170" width="130" height="220" rx="28" fill="#f7dfad" stroke="#b8864f" stroke-width="6"/><path d="M405 182q20 34 36 2 23 38 52-2" fill="none" stroke="#e5bf7b" stroke-width="12" stroke-linecap="round"/><path d="M405 210v120M487 220v92" stroke="#fff7dd" stroke-width="8" stroke-linecap="round" opacity=".55"/></g>
        <line id="wick" x1="450" y1="150" x2="450" y2="174" stroke="#5a4434" stroke-width="6" stroke-linecap="round"/>
        <g id="flame" class="fx-flicker"><path d="M450 78q-45 50 0 88 45-38 0-88z" fill="#f7a52e"/><path d="M450 112q-18 24 0 42 18-18 0-42z" fill="#fff4a8"/></g>
        <ellipse id="candleGlow" cx="450" cy="145" rx="150" ry="125" fill="url(#sunGlow)" opacity=".35"/>
        <path id="smoke" d="M450 145q-25-22 0-42t0-38" fill="none" stroke="#767676" stroke-width="4" opacity="0"/>
      `,'burning candle','#b8864f');
    },

    flower() {
      const stages = [
        ['seed',95,418],['sprout1',205,410],['sprout2',315,400],['plant1',425,372],['plant2',535,340],['bud',645,300],['bloom',765,240]
      ];
      const stageSvg = stages.map(([id,x,y],i) => {
        const h = [0,36,72,125,175,225,285][i];
        const flower = i >= 5 ? `<g class="flower-head"><circle cx="${x}" cy="${y-h}" r="${i===5?18:26}" fill="#f3b1c6"/><g fill="#ed87aa">${[0,45,90,135,180,225,270,315].map(a=>`<ellipse cx="${x}" cy="${y-h-22}" rx="11" ry="25" transform="rotate(${a} ${x} ${y-h})"/>`).join('')}</g><circle cx="${x}" cy="${y-h}" r="12" fill="#e8b74d"/></g>`:'';
        return `<g id="${id}" class="plant-stage grow" opacity="0"><ellipse cx="${x}" cy="430" rx="46" ry="11" fill="#7a4f2c"/><path d="M${x-46} 430q46-28 92 0" fill="#8a5a31"/><path d="M${x} 426q${i%2?10:-8}-${h*.55} 0-${h}" fill="none" stroke="#557c32" stroke-width="8" stroke-linecap="round"/>${i>1?`<ellipse cx="${x-18}" cy="${y-h*.48}" rx="28" ry="12" fill="#6d943d" transform="rotate(-28 ${x-18} ${y-h*.48})"/><ellipse cx="${x+20}" cy="${y-h*.68}" rx="29" ry="13" fill="#5f8736" transform="rotate(30 ${x+20} ${y-h*.68})"/>`:''}${i===0?`<ellipse cx="${x}" cy="416" rx="18" ry="10" fill="#5d351f" transform="rotate(-20 ${x} 416)"/>`:''}${flower}</g>`;
      }).join('');
      return base(`<rect width="900" height="520" fill="#fbefcf"/><g opacity=".18" filter="url(#soft)"><path d="M60 360q60-220 125 0M735 350q55-210 110 0" fill="none" stroke="#82945d" stroke-width="34"/></g><rect y="438" width="900" height="82" fill="#efdcb5"/>${stageSvg}`,'growing flower','#83983d');
    },

    hourglass() {
      return base(`
        <rect width="900" height="520" fill="#efe1c7"/><g opacity=".18" filter="url(#soft)"><rect x="80" y="70" width="180" height="260" fill="#9e7659"/><rect x="660" y="90" width="150" height="230" fill="#88936f"/></g><rect y="375" width="900" height="145" fill="url(#wood)"/>
        <ellipse cx="450" cy="430" rx="130" ry="20" fill="#6a4a32" opacity=".2"/>
        <g><rect x="335" y="76" width="230" height="32" rx="14" fill="#9a6b3f" stroke="#664728" stroke-width="5"/><rect x="335" y="402" width="230" height="32" rx="14" fill="#9a6b3f" stroke="#664728" stroke-width="5"/><path d="M365 108q8 95 85 151-77 55-85 143M535 108q-8 95-85 151 77 55 85 143" fill="#fff" fill-opacity=".3" stroke="#8e795f" stroke-width="6"/>
          <polygon id="sandTop" points="382,132 518,132 470,245 430,245" fill="#d7a64d"/><polygon id="sandBottom" points="450,383 450,383 450,383 450,383" fill="#d7a64d"/><line id="sandStream" x1="450" y1="238" x2="450" y2="370" stroke="#d7a64d" stroke-width="5" stroke-dasharray="7 8"/>
        </g>
      `,'hourglass','#a17642');
    },

    sunrise() {
      return base(`
        <rect id="sunSky" width="900" height="520" fill="#f7cda7"/>
        <g id="sunClouds" fill="#fff" opacity=".4" class="fx-float-slow"><ellipse cx="220" cy="130" rx="75" ry="22"/><ellipse cx="270" cy="130" rx="55" ry="18"/><ellipse cx="650" cy="110" rx="65" ry="20"/><ellipse cx="700" cy="110" rx="48" ry="16"/></g>
        <circle id="sunGlowDisc" cx="90" cy="365" r="105" fill="url(#sunGlow)"/><circle id="sunDisc" cx="90" cy="365" r="35" fill="#ffe49a" stroke="#f1b354" stroke-width="4"/>
        <path d="M0 355q120-90 245 10 110-135 245 5 120-110 250 4 80-70 160 0v146H0z" fill="#9aaa70"/><path d="M0 404q150-86 305 5 150-100 310 0 140-90 285 0v111H0z" fill="#6f845a"/>
        <path id="sunArc" d="M90 365Q450 30 810 365" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="6 9" opacity=".5"/>
      `,'sunrise','#e7a84e');
    },

    books() {
      const books = [
        ['#c77c67',245,354,410,48],['#708aa2',225,306,450,48],['#9b9b62',255,258,390,48],['#d5ad72',235,210,430,48],['#b6808e',260,162,380,48]
      ];
      return base(`
        <rect width="900" height="520" fill="#f4e5ce"/><g opacity=".17" filter="url(#soft)"><rect x="85" y="65" width="210" height="270" fill="#8e765f"/><rect x="655" y="80" width="165" height="240" fill="#9f8b70"/></g><rect y="395" width="900" height="125" fill="url(#wood)"/>
        <ellipse cx="450" cy="430" rx="160" ry="20" fill="#614c3e" opacity=".18"/>
        ${books.map(([c,x,y,w,h],i)=>`<g class="book" data-book="${i}" style="transform-box:fill-box;transform-origin:center"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" fill="${c}" stroke="#5f5148" stroke-width="4"/><path d="M${x+28} ${y+7}v${h-14}M${x+w-18} ${y+9}q-25 16 0 ${h-18}" fill="none" stroke="#f7e9ce" stroke-width="5" opacity=".75"/></g>`).join('')}
        <path id="bookFinal" d="M326 448q124 10 248 0" fill="none" stroke="#6f5946" stroke-width="4" opacity="0"/>
      `,'book stack','#8d8061');
    },

    autumn() {
      const leaves = Array.from({length:34},(_,i)=>{
        const angle = (i/34)*Math.PI*2; const rx=135*(.55+(i%5)/10); const ry=118*(.55+((i*3)%5)/10); const x=450+Math.cos(angle)*rx+(i%3-1)*14; const y=232+Math.sin(angle)*ry*.72+(i%4-1)*8; const c=['#d9782c','#e89b35','#bd5e2b','#dca93c'][i%4]; return `<ellipse class="autumn-leaf" data-leaf="${i}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="12" ry="7" fill="${c}" transform="rotate(${i*23} ${x} ${y})"/>`;
      }).join('');
      return base(`
        <rect width="900" height="520" fill="#f4dfbd"/><g opacity=".18" filter="url(#soft)"><path d="M80 350q60-220 120 0M720 340q55-190 110 0" fill="none" stroke="#b4946d" stroke-width="30"/></g><rect y="430" width="900" height="90" fill="#dec394"/>
        <path d="M450 425q-20-130 4-235M454 285q-70-70-125-75M452 270q80-80 150-70M445 330q-100-50-150-10M458 330q95-55 145-15" fill="none" stroke="#76513a" stroke-width="18" stroke-linecap="round"/>
        <g id="autumnLeaves" class="fx-sway">${leaves}</g>
        <g id="fallenLeaves"></g>
      `,'autumn tree','#d47a2d');
    },

    vine() {
      const leaves = Array.from({length:18},(_,i)=>{ const x=190+i*31; const y=400-i*16+(i%3)*18; return `<ellipse class="vine-leaf" data-leaf="${i}" cx="${x}" cy="${y}" rx="23" ry="12" fill="${i%2?'#6d8845':'#7e9a51'}" transform="rotate(${i%2?28:-25} ${x} ${y})" opacity="0"/>`; }).join('');
      const flowers = Array.from({length:12},(_,i)=>{ const x=285+i*34; const y=350-i*15+(i%2)*22; return `<g class="vine-flower" data-flower="${i}" opacity="0" style="transform-box:fill-box;transform-origin:center"><circle cx="${x}" cy="${y}" r="5" fill="#f0c85d"/>${[0,72,144,216,288].map(a=>`<ellipse cx="${x}" cy="${y-9}" rx="6" ry="10" fill="#6da5cf" transform="rotate(${a} ${x} ${y})"/>`).join('')}</g>`; }).join('');
      return base(`
        <rect width="900" height="520" fill="#efe4cf"/><g opacity=".3"><path d="M0 0h900v520H0z" fill="#f4ead7"/><path d="M120 0v520M300 0v520M480 0v520M660 0v520M0 120h900M0 250h900M0 390h900" stroke="#d4c2a6" stroke-width="5"/></g><g opacity=".16" filter="url(#soft)"><path d="M70 430q45-180 95 0M760 425q40-170 90 0" fill="none" stroke="#788b55" stroke-width="28"/></g>
        <path id="vineStem" d="M120 438C260 400 285 330 385 315S520 210 615 220 710 145 790 115" fill="none" stroke="#5f7b3c" stroke-width="12" stroke-linecap="round" stroke-dasharray="900" stroke-dashoffset="900"/>
        ${leaves}${flowers}
        <g id="vineSparks" opacity="0" fill="#f7da70" class="spark">${[0,1,2,3,4,5].map(i=>`<circle class="fx-float" cx="${310+i*70}" cy="${265-(i%2)*60}" r="${3+i%2}"/>`).join('')}</g>
      `,'enchanted vine','#718b48');
    },

    fairy() {
      return base(`
        <rect width="900" height="520" fill="#dce4c5"/><g opacity=".25" filter="url(#soft)"><circle cx="150" cy="160" r="110" fill="#66815c"/><circle cx="760" cy="145" r="135" fill="#587351"/></g><rect y="420" width="900" height="100" fill="#b7b98a"/>
        <g id="fairyMoss" opacity="0"><path d="M205 430q90-90 180-10 70-95 160 0 80-70 155 12H205z" fill="#6f8950"/><circle cx="285" cy="407" r="28" fill="#819b5e"/><circle cx="590" cy="414" r="34" fill="#789152"/></g>
        <g id="fairyMushrooms" opacity="0"><g transform="translate(350 275)"><rect x="-12" y="68" width="24" height="72" rx="12" fill="#ead5b4"/><path d="M-72 76q72-110 144 0z" fill="#c96842" stroke="#824832" stroke-width="5"/><g fill="#f8e8cf"><circle cx="-35" cy="48" r="8"/><circle cx="18" cy="32" r="7"/><circle cx="45" cy="60" r="6"/></g></g><g transform="translate(500 335) scale(.68)"><rect x="-12" y="68" width="24" height="72" rx="12" fill="#ead5b4"/><path d="M-72 76q72-110 144 0z" fill="#d27a48" stroke="#824832" stroke-width="5"/></g></g>
        <g id="fairyFerns" opacity="0" fill="none" stroke="#4f753f" stroke-width="7" stroke-linecap="round"><path d="M245 420q10-120 70-170M620 430q-10-130-75-185"/><path d="M275 350l-45-22M285 325l48-28M605 350l44-22M590 320l-42-28"/></g>
        <g id="fairyFlowers" opacity="0">${[265,410,555,650].map((x,i)=>`<g transform="translate(${x} ${395-(i%2)*28})"><circle r="7" fill="#f0c760"/>${[0,90,180,270].map(a=>`<ellipse cy="-12" rx="7" ry="12" fill="${i%2?'#8b79ba':'#77a4d0'}" transform="rotate(${a})"/>`).join('')}</g>`).join('')}</g>
        <g id="fairyLights" opacity="0" fill="#ffe88a" class="spark">${Array.from({length:14},(_,i)=>`<circle class="fx-float" cx="${220+(i*47)%480}" cy="${130+(i*67)%220}" r="${3+i%3}" style="animation-delay:${(i%5)*.4}s"/>`).join('')}</g>
      `,'fairy garden','#728d49');
    }
  };

  const updates = {
    jar(p,m){ const top=406-250*p; const liquid=q(m,'#jarLiquid'), wave=q(m,'#jarWave'); if(liquid){liquid.setAttribute('y',top);liquid.setAttribute('height',250*p);} if(wave)wave.setAttribute('transform',`translate(0 ${-250*p})`); const b=q(m,'#jarBubbles'); if(b)b.style.opacity=String(clamp((p-.08)/.2)); const f=q(m,'#jarFinal'); if(f)f.style.opacity=String(clamp((p-.92)/.08)); },
    ice(p,m){ const cube=q(m,'#iceCube'), puddle=q(m,'#icePuddle'); if(cube){const s=1-.73*p;cube.style.transform=`translateY(${78*p}px) scale(${s})`;cube.style.opacity=String(1-.78*p);} if(puddle){puddle.setAttribute('rx',70+125*p);puddle.setAttribute('ry',18+23*p);puddle.style.opacity=String(.35+.5*p);} const d=q(m,'#iceDrops');if(d)d.style.opacity=String(clamp((p-.2)/.35)); const f=q(m,'#iceFinal');if(f)f.style.opacity=String(clamp((p-.9)/.1));},
    candle(p,m){ const wax=q(m,'#wax'), body=q(m,'#candleBody'), wick=q(m,'#wick'), flame=q(m,'#flame'), smoke=q(m,'#smoke'); const s=Math.max(.08,1-.9*p); if(body)body.style.transform=`translateY(${188*(1-s)}px) scaleY(${s})`; if(wick){wick.setAttribute('y1',150+188*(1-s));wick.setAttribute('y2',174+188*(1-s));} if(flame){flame.style.transform=`translateY(${188*(1-s)}px)`;flame.style.opacity=p>.985?'0':'1';} if(smoke)smoke.style.opacity=String(clamp((p-.97)/.03));},
    flower(p,m){ const stages=qa(m,'.plant-stage'); const active=Math.min(stages.length-1,Math.floor(p*stages.length)); stages.forEach((s,i)=>{const local=clamp(p*stages.length-i);s.style.opacity=String(local);s.style.transform=`scale(${.75+.25*local})`;});},
    hourglass(p,m){ const top=q(m,'#sandTop'),bottom=q(m,'#sandBottom'),stream=q(m,'#sandStream'); if(top)top.setAttribute('points',`382,132 518,132 ${450+20*(1-p)},${245-95*p} ${450-20*(1-p)},${245-95*p}`); if(bottom)bottom.setAttribute('points',`${450-92*p},383 ${450+92*p},383 ${450+28*p},${383-145*p} ${450-28*p},${383-145*p}`); if(stream)stream.style.opacity=p>.98?'0':'1';},
    sunrise(p,m){ const sun=q(m,'#sunDisc'),glow=q(m,'#sunGlowDisc'),sky=q(m,'#sunSky'); const x=90+720*p; const y=365-285*Math.sin(Math.PI*p); [sun,glow].forEach(n=>{if(n){n.setAttribute('cx',x);n.setAttribute('cy',y);}}); if(sky){const hue=28+18*Math.sin(Math.PI*p); const light=77+10*Math.sin(Math.PI*p);sky.setAttribute('fill',`hsl(${hue} 78% ${light}%)`);}},
    books(p,m){ const books=qa(m,'.book'); const removed=Math.floor(p*books.length+1e-6); books.forEach((book,i)=>{const should=i>=books.length-removed; if(should){const order=books.length-1-i;book.style.transform=`translate(${order%2?180:-180}px,${-70-order*8}px) rotate(${order%2?12:-12}deg)`;book.style.opacity='0';}else{book.style.transform='none';book.style.opacity='1';}}); const f=q(m,'#bookFinal');if(f)f.style.opacity=String(clamp((p-.94)/.06));},
    autumn(p,m){ const leaves=qa(m,'.autumn-leaf'); const fallen=q(m,'#fallenLeaves'); let html=''; leaves.forEach((leaf,i)=>{const threshold=i/leaves.length; const local=clamp((p-threshold)*leaves.length); if(local>0){leaf.style.opacity=String(1-local);leaf.style.transform=`translate(${Math.sin(i*2.3)*80*local}px,${230*local}px) rotate(${i*31+220*local}deg)`; if(local>.82){const x=170+(i*47)%560; const y=440+(i%4)*10; html+=`<ellipse cx="${x}" cy="${y}" rx="12" ry="6" fill="${['#d9782c','#e89b35','#bd5e2b','#dca93c'][i%4]}" transform="rotate(${i*23} ${x} ${y})"/>`;}}else{leaf.style.opacity='1';leaf.style.transform='none';}}); if(fallen)fallen.innerHTML=html;},
    vine(p,m){ const stem=q(m,'#vineStem'); if(stem)stem.style.strokeDashoffset=String(900*(1-clamp(p/.65))); qa(m,'.vine-leaf').forEach((n,i)=>{const local=clamp((p-.15-i*.025)/.16);show(n,local);}); qa(m,'.vine-flower').forEach((n,i)=>{const local=clamp((p-.78-i*.012)/.16);show(n,local);}); const s=q(m,'#vineSparks');if(s)s.style.opacity=String(clamp((p-.9)/.1));},
    fairy(p,m){ [['#fairyMoss',0,.18],['#fairyMushrooms',.18,.22],['#fairyFerns',.38,.2],['#fairyFlowers',.58,.2],['#fairyLights',.78,.2]].forEach(([sel,start,dur])=>{const n=q(m,sel);if(n){const local=clamp((p-start)/dur);n.style.opacity=String(local);n.style.transform=`scale(${.82+.18*local})`;n.style.transformOrigin='center bottom';}});}
  };

  window.FocusAnimations = {
    build(type,mount){ const maker=scenes[type]||scenes.jar; mount.innerHTML=maker(); this.update(type,0,mount); },
    update(type,progress,mount){ const fn=updates[type]||updates.jar; fn(clamp(progress),mount); },
    finish(type,mount){ this.update(type,1,mount); }
  };
})();
