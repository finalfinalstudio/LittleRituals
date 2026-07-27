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
    const caustics = document.getElementById('jarCaustics');
    const bubbles = document.querySelectorAll('.jar-bubble');
    const meniscus = document.getElementById('jarMeniscus');

    const bottom = 330;
    const maxHeight = 225;
    const height = maxHeight * p;
    const top = bottom - height;

    if (liquid) {
      liquid.setAttribute('y', top);
      liquid.setAttribute('height', Math.max(0, height));
    }
    if (meniscus) meniscus.setAttribute('cy', top + 1);
    if (waveBack) waveBack.setAttribute('transform', `translate(0 ${top - 115})`);
    if (waveFront) waveFront.setAttribute('transform', `translate(0 ${top - 119})`);
    if (caustics) caustics.style.opacity = String(Math.min(.7, .12 + p * .58));

    bubbles.forEach((bubble, index) => {
      const base = Number(bubble.dataset.base || 0);
      const travel = 145 + index * 13;
      const y = bottom - ((p * travel + base) % Math.max(30, height + 30));
      bubble.setAttribute('cy', Math.max(top + 10, y));
      bubble.style.opacity = p > .08 ? String(.2 + index * .07) : '0';
    });
  },

  jar() {
    return `
      <svg viewBox="0 0 440 440" role="img" aria-label="filling glass jar">
        <defs>
          <clipPath id="jarInteriorClip">
            <path d="M132 92 C132 77 145 67 160 67 H280 C295 67 308 77 308 92 V310 C308 336 289 354 263 359 H177 C151 354 132 336 132 310 Z"/>
          </clipPath>

          <linearGradient id="glassBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffffff" stop-opacity=".55"/>
            <stop offset="24%" stop-color="#dcecff" stop-opacity=".12"/>
            <stop offset="58%" stop-color="#ffffff" stop-opacity=".04"/>
            <stop offset="100%" stop-color="#b9d6ef" stop-opacity=".26"/>
          </linearGradient>

          <linearGradient id="waterBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#aee7ff" stop-opacity=".92"/>
            <stop offset="45%" stop-color="#79c8f2" stop-opacity=".95"/>
            <stop offset="100%" stop-color="#3f83d4" stop-opacity=".98"/>
          </linearGradient>

          <linearGradient id="rimGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f9fdff" stop-opacity=".85"/>
            <stop offset="100%" stop-color="#a9c8df" stop-opacity=".34"/>
          </linearGradient>

          <radialGradient id="floorGlow">
            <stop offset="0%" stop-color="#77b9ee" stop-opacity=".26"/>
            <stop offset="100%" stop-color="#77b9ee" stop-opacity="0"/>
          </radialGradient>

          <filter id="jarShadow" x="-40%" y="-40%" width="180%" height="190%">
            <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#315a78" flood-opacity=".19"/>
          </filter>

          <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4"/>
          </filter>
        </defs>

        <ellipse cx="220" cy="372" rx="132" ry="27" fill="url(#floorGlow)"/>
        <ellipse cx="220" cy="365" rx="104" ry="16" fill="rgba(26,53,75,.12)" filter="url(#softBlur)"/>

        <g filter="url(#jarShadow)">
          <path d="M132 92 C132 77 145 67 160 67 H280 C295 67 308 77 308 92 V310 C308 336 289 354 263 359 H177 C151 354 132 336 132 310 Z"
                fill="url(#glassBody)" stroke="rgba(98,132,158,.72)" stroke-width="5"/>

          <g clip-path="url(#jarInteriorClip)">
            <rect id="jarLiquid" x="132" y="330" width="176" height="0" fill="url(#waterBody)"/>

            <path id="jarWaveBack" d="M112 116 C150 101 182 127 220 112 C258 97 291 126 328 111 L328 145 L112 145 Z"
                  fill="#d1f4ff" opacity=".48"/>
            <path id="jarWaveFront" d="M112 120 C150 135 184 104 221 119 C258 134 292 108 328 120 L328 151 L112 151 Z"
                  fill="#8fd8f7" opacity=".70"/>
            <ellipse id="jarMeniscus" cx="220" cy="330" rx="87" ry="7" fill="#d9f7ff" opacity=".62"/>

            <g id="jarCaustics" opacity=".12">
              <path d="M150 245 C178 226 192 254 219 235 C246 217 266 245 293 224" fill="none" stroke="#e5fbff" stroke-width="8" stroke-linecap="round" opacity=".34"/>
              <path d="M161 294 C190 275 206 302 231 284 C252 269 274 288 294 275" fill="none" stroke="#d7f7ff" stroke-width="6" stroke-linecap="round" opacity=".26"/>
            </g>

            <circle class="jar-bubble" data-base="12" cx="165" cy="316" r="4.5" fill="#f5fdff"/>
            <circle class="jar-bubble" data-base="48" cx="194" cy="327" r="6.5" fill="#f5fdff"/>
            <circle class="jar-bubble" data-base="82" cx="244" cy="310" r="3.5" fill="#f5fdff"/>
            <circle class="jar-bubble" data-base="118" cx="274" cy="332" r="5" fill="#f5fdff"/>
            <circle class="jar-bubble" data-base="153" cx="218" cy="320" r="2.8" fill="#f5fdff"/>
          </g>

          <path d="M148 111 V294 C148 321 159 339 180 347" fill="none" stroke="#ffffff" stroke-opacity=".50" stroke-width="10" stroke-linecap="round"/>
          <path d="M164 106 V276" fill="none" stroke="#ffffff" stroke-opacity=".22" stroke-width="4" stroke-linecap="round"/>
          <path d="M289 116 V300 C289 321 280 337 263 346" fill="none" stroke="#8fb8d3" stroke-opacity=".24" stroke-width="6" stroke-linecap="round"/>
          <path d="M145 303 C158 333 177 341 206 344" fill="none" stroke="#ffffff" stroke-opacity=".21" stroke-width="5" stroke-linecap="round"/>

          <rect x="149" y="48" width="142" height="34" rx="11" fill="url(#rimGradient)" stroke="rgba(89,124,151,.72)" stroke-width="5"/>
          <path d="M158 59 H282" stroke="#ffffff" stroke-opacity=".62" stroke-width="5" stroke-linecap="round"/>
          <path d="M151 88 H289" stroke="#ffffff" stroke-opacity=".56" stroke-width="7" stroke-linecap="round"/>
        </g>
      </svg>`;
  }
};
