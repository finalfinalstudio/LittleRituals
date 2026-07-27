window.FocusAnimations = {
  build(type, mount) {
    if (type === 'jar') mount.innerHTML = this.jar();
  },

  update(type, progress) {
    if (type !== 'jar') return;
    const liquid = document.getElementById('jarLiquid');
    const wave = document.getElementById('jarWave');
    const bubbles = document.querySelectorAll('.jar-bubble');
    const p = Math.max(0, Math.min(1, progress));
    if (liquid) {
      const top = 320 - (220 * p);
      liquid.setAttribute('y', top);
      liquid.setAttribute('height', 220 * p);
    }
    if (wave) wave.setAttribute('transform', `translate(0 ${-220 * p})`);
    bubbles.forEach((bubble, i) => {
      bubble.style.opacity = p > 0.08 ? String(0.3 + (i * 0.12)) : '0';
    });
  },

  jar() {
    return `
      <svg viewBox="0 0 420 420" role="img" aria-label="filling jar">
        <defs>
          <clipPath id="jarClip">
            <path d="M128 86 Q128 64 150 61 H270 Q292 64 292 86 V305 Q292 337 259 347 H161 Q128 337 128 305 Z"/>
          </clipPath>
          <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#9fdcff"/>
            <stop offset="100%" stop-color="#5688f2"/>
          </linearGradient>
          <linearGradient id="glassGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="rgba(255,255,255,.62)"/>
            <stop offset="45%" stop-color="rgba(255,255,255,.12)"/>
            <stop offset="100%" stop-color="rgba(255,255,255,.34)"/>
          </linearGradient>
          <filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="16" stdDeviation="14" flood-color="#315a8c" flood-opacity=".20"/>
          </filter>
        </defs>

        <ellipse cx="210" cy="353" rx="122" ry="20" fill="rgba(0,0,0,.10)"/>

        <g filter="url(#softShadow)">
          <path d="M128 86 Q128 64 150 61 H270 Q292 64 292 86 V305 Q292 337 259 347 H161 Q128 337 128 305 Z"
                fill="url(#glassGradient)" stroke="currentColor" stroke-width="7" opacity=".95"/>

          <g clip-path="url(#jarClip)">
            <rect id="jarLiquid" x="128" y="320" width="164" height="0" fill="url(#waterGradient)"/>
            <path id="jarWave" d="M118 318 C150 306 174 328 207 316 C240 304 265 328 302 316 L302 350 L118 350 Z"
                  fill="#b8e7ff" opacity=".78"/>
            <circle class="jar-bubble" cx="164" cy="294" r="6" fill="rgba(255,255,255,.76)"/>
            <circle class="jar-bubble" cx="222" cy="314" r="8" fill="rgba(255,255,255,.66)"/>
            <circle class="jar-bubble" cx="258" cy="281" r="5" fill="rgba(255,255,255,.72)"/>
          </g>

          <rect x="145" y="43" width="130" height="28" rx="9" fill="rgba(255,255,255,.44)" stroke="currentColor" stroke-width="7"/>
          <path d="M151 103 H269" stroke="rgba(255,255,255,.72)" stroke-width="8" stroke-linecap="round"/>
          <path d="M154 122 V284" stroke="rgba(255,255,255,.42)" stroke-width="11" stroke-linecap="round"/>
          <path d="M266 118 V302" stroke="rgba(255,255,255,.20)" stroke-width="6" stroke-linecap="round"/>
        </g>
      </svg>`;
  }
};
