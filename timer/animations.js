window.FocusAnimations = {
  build(type, mount) {
    if (type === 'jar') mount.innerHTML = this.jar();
  },

  update(type, progress) {
    if (type !== 'jar') return;
    const p = Math.max(0, Math.min(1, progress));
    const liquid = document.getElementById('jarLiquid');
    const waveBack = document.getElementById('jarWaveBack');
    const waveFront = document.getElementById('jarWaveFront');
    const meniscus = document.getElementById('jarMeniscus');
    const caustics = document.getElementById('jarCaustics');
    const glow = document.getElementById('waterGlow');
    const refraction = document.getElementById('jarRefraction');
    const bubbles = document.querySelectorAll('.jar-bubble');

    const bottom = 338;
    const maxHeight = 223;
    const height = maxHeight * p;
    const top = bottom - height;

    if (liquid) {
      liquid.setAttribute('y', top);
      liquid.setAttribute('height', Math.max(0, height));
    }
    if (meniscus) {
      meniscus.setAttribute('cy', top + 1);
      meniscus.style.opacity = p < .015 ? '0' : '.78';
    }
    if (waveBack) waveBack.setAttribute('transform', `translate(0 ${top - 122})`);
    if (waveFront) waveFront.setAttribute('transform', `translate(0 ${top - 126})`);
    if (caustics) caustics.style.opacity = String(Math.min(.72, .08 + p * .64));
    if (glow) glow.style.opacity = String(.1 + p * .5);
    if (refraction) refraction.style.opacity = String(.08 + p * .25);

    bubbles.forEach((bubble, index) => {
      const base = Number(bubble.dataset.base || 0);
      const travel = 130 + index * 19;
      const span = Math.max(34, height + 26);
      const y = bottom - ((p * travel * 1.7 + base) % span);
      bubble.setAttribute('cy', Math.max(top + 12, y));
      bubble.style.opacity = p > .055 ? String(.18 + (index % 4) * .1) : '0';
    });
  },

  jar() {
    return `
      <svg viewBox="0 0 560 440" role="img" aria-label="realistic filling glass jar on a wooden table">
        <defs>
          <linearGradient id="roomWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#e9e4dc"/>
            <stop offset="100%" stop-color="#cfc6b9"/>
          </linearGradient>
          <linearGradient id="tableWood" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#92705a"/>
            <stop offset="45%" stop-color="#aa8266"/>
            <stop offset="100%" stop-color="#80614e"/>
          </linearGradient>
          <linearGradient id="windowLight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#fffef8" stop-opacity=".95"/>
            <stop offset="100%" stop-color="#d9edff" stop-opacity=".35"/>
          </linearGradient>
          <radialGradient id="sceneGlow" cx="35%" cy="25%" r="78%">
            <stop offset="0%" stop-color="#fff" stop-opacity=".62"/>
            <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="glassBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#fff" stop-opacity=".62"/>
            <stop offset="20%" stop-color="#dfefff" stop-opacity=".15"/>
            <stop offset="58%" stop-color="#fff" stop-opacity=".04"/>
            <stop offset="100%" stop-color="#aac8dd" stop-opacity=".29"/>
          </linearGradient>
          <linearGradient id="glassEdge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#fff" stop-opacity=".92"/>
            <stop offset="45%" stop-color="#a7c2d3" stop-opacity=".45"/>
            <stop offset="100%" stop-color="#5f8095" stop-opacity=".68"/>
          </linearGradient>
          <linearGradient id="waterBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#caefff" stop-opacity=".92"/>
            <stop offset="40%" stop-color="#78c8ef" stop-opacity=".96"/>
            <stop offset="100%" stop-color="#2f79c2" stop-opacity=".98"/>
          </linearGradient>
          <radialGradient id="waterGlowGradient" cx="35%" cy="20%" r="80%">
            <stop offset="0%" stop-color="#fff" stop-opacity=".58"/>
            <stop offset="100%" stop-color="#72c8ef" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="rimGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#fff" stop-opacity=".92"/>
            <stop offset="100%" stop-color="#9fbfd5" stop-opacity=".36"/>
          </linearGradient>
          <clipPath id="jarInteriorClip">
            <path d="M192 90 C192 73 206 63 222 63 H338 C354 63 368 73 368 90 V310 C368 337 348 356 321 361 H239 C212 356 192 337 192 310 Z"/>
          </clipPath>
          <filter id="sceneBlur"><feGaussianBlur stdDeviation="7"/></filter>
          <filter id="softBlur"><feGaussianBlur stdDeviation="4"/></filter>
          <filter id="jarShadow" x="-45%" y="-45%" width="190%" height="200%">
            <feDropShadow dx="0" dy="18" stdDeviation="15" flood-color="#263b49" flood-opacity=".24"/>
          </filter>
          <filter id="innerWater" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.4" result="blur"/>
            <feSpecularLighting in="blur" surfaceScale="3" specularConstant=".45" specularExponent="18" lighting-color="#fff" result="spec">
              <feDistantLight azimuth="225" elevation="52"/>
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceAlpha" operator="in" result="specOut"/>
            <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="1" k2="1" k3=".35" k4="0"/>
          </filter>
        </defs>

        <!-- soft interior scene -->
        <rect x="8" y="8" width="544" height="424" rx="24" fill="url(#roomWall)"/>
        <rect x="8" y="8" width="544" height="424" rx="24" fill="url(#sceneGlow)"/>
        <g opacity=".72" filter="url(#sceneBlur)">
          <rect x="54" y="42" width="142" height="196" rx="10" fill="#d4e5ef"/>
          <rect x="66" y="54" width="58" height="172" fill="url(#windowLight)"/>
          <rect x="132" y="54" width="52" height="172" fill="url(#windowLight)"/>
          <path d="M96 54 V226 M54 138 H196" stroke="#a9b9c2" stroke-width="7" opacity=".72"/>
          <ellipse cx="472" cy="202" rx="54" ry="95" fill="#667a62" opacity=".43"/>
          <ellipse cx="452" cy="176" rx="36" ry="65" fill="#84937a" opacity=".55"/>
        </g>
        <rect x="8" y="315" width="544" height="117" rx="0 0 24 24" fill="url(#tableWood)"/>
        <path d="M8 350 C115 338 207 363 318 348 C416 335 486 350 552 342" fill="none" stroke="#6e503f" stroke-opacity=".28" stroke-width="3"/>
        <path d="M35 390 C140 374 235 401 362 384 C430 375 489 382 538 376" fill="none" stroke="#d3a987" stroke-opacity=".22" stroke-width="4"/>
        <ellipse cx="280" cy="365" rx="119" ry="18" fill="#2d2a28" opacity=".23" filter="url(#softBlur)"/>
        <ellipse cx="280" cy="358" rx="98" ry="11" fill="#213949" opacity=".14"/>

        <!-- jar -->
        <g filter="url(#jarShadow)">
          <path d="M192 90 C192 73 206 63 222 63 H338 C354 63 368 73 368 90 V310 C368 337 348 356 321 361 H239 C212 356 192 337 192 310 Z"
                fill="url(#glassBody)" stroke="url(#glassEdge)" stroke-width="5"/>

          <g clip-path="url(#jarInteriorClip)">
            <g id="jarRefraction" opacity=".08">
              <rect x="192" y="63" width="176" height="298" fill="#bde5fb" opacity=".17"/>
              <path d="M210 75 C242 143 226 237 212 345" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="21"/>
            </g>
            <rect id="jarLiquid" x="192" y="338" width="176" height="0" fill="url(#waterBody)" filter="url(#innerWater)"/>
            <rect id="waterGlow" x="192" y="104" width="176" height="250" fill="url(#waterGlowGradient)" opacity=".1"/>
            <path id="jarWaveBack" d="M172 122 C214 105 244 136 281 118 C320 100 349 135 389 116 L389 153 L172 153 Z" fill="#d8f6ff" opacity=".50"/>
            <path id="jarWaveFront" d="M172 127 C214 143 244 109 282 126 C320 143 351 112 389 127 L389 158 L172 158 Z" fill="#83d2f4" opacity=".72"/>
            <ellipse id="jarMeniscus" cx="280" cy="338" rx="87" ry="7.5" fill="#e5fbff" opacity="0"/>
            <g id="jarCaustics" opacity=".08">
              <path d="M211 244 C239 224 254 256 281 235 C309 214 331 247 354 226" fill="none" stroke="#effcff" stroke-width="8" stroke-linecap="round" opacity=".42"/>
              <path d="M218 297 C246 277 263 305 291 285 C314 269 337 291 354 276" fill="none" stroke="#dff9ff" stroke-width="7" stroke-linecap="round" opacity=".34"/>
            </g>
            ${[15,44,79,111,146,178,207].map((b,i)=>`<circle class="jar-bubble" data-base="${b}" cx="${218+i*20%118}" cy="326" r="${2.8+(i%3)*1.4}" fill="#f8feff" opacity="0"/>`).join('')}
          </g>

          <path d="M211 110 V292 C211 322 222 342 242 350" fill="none" stroke="#fff" stroke-opacity=".56" stroke-width="10" stroke-linecap="round"/>
          <path d="M226 103 V273" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="4" stroke-linecap="round"/>
          <path d="M350 116 V301 C350 324 341 342 323 351" fill="none" stroke="#88abc1" stroke-opacity=".28" stroke-width="6" stroke-linecap="round"/>
          <path d="M207 306 C220 338 242 349 273 352" fill="none" stroke="#fff" stroke-opacity=".24" stroke-width="5" stroke-linecap="round"/>
          <path d="M196 165 C188 216 190 278 203 317" fill="none" stroke="#d9efff" stroke-opacity=".22" stroke-width="7"/>

          <rect x="209" y="44" width="142" height="34" rx="11" fill="url(#rimGradient)" stroke="url(#glassEdge)" stroke-width="5"/>
          <path d="M218 55 H342" stroke="#fff" stroke-opacity=".72" stroke-width="5" stroke-linecap="round"/>
          <path d="M211 86 H349" stroke="#fff" stroke-opacity=".62" stroke-width="7" stroke-linecap="round"/>
        </g>
      </svg>`;
  }
};
