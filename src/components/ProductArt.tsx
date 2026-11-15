import { useId } from 'react';
import type { ArtKind, ArtTone } from '../data/catalog';

/*
  Ilustraciones vectoriales provisionales de cada instrumento.
  Sirven para ver el diseño completo; se reemplazarán por fotos de producto.
*/

interface ProductArtProps {
  kind: ArtKind;
  tone?: ArtTone;
  className?: string;
}

const TONES: Record<ArtTone, [string, string, string]> = {
  sunburst: ['#E9A745', '#B5481C', '#4F150D'],
  negro: ['#4A433D', '#2A2521', '#110E0C'],
  blanco: ['#FBF6E6', '#E6DBBE', '#BDAE8A'],
  verde: ['#7DB59D', '#3E7F68', '#1D4538'],
  natural: ['#E7BC78', '#C48A45', '#7E4C21'],
};

const CHROME = '#C9CFCB';
const INK = '#14110F';

function BodyGradient({ id, tone }: { id: string; tone: ArtTone }) {
  const [a, b, c] = TONES[tone];
  return (
    <radialGradient id={id} cx="50%" cy="52%" r="62%">
      <stop offset="0" stopColor={a} />
      <stop offset="0.55" stopColor={b} />
      <stop offset="1" stopColor={c} />
    </radialGradient>
  );
}

/* Guitarra eléctrica y bajo, de pie y con la cabeza hacia arriba */
function Electric({ uid, tone, bass = false }: { uid: string; tone: ArtTone; bass?: boolean }) {
  const extra = bass ? 50 : 0;
  const neckEnd = 172 + extra;
  const fretCount = bass ? 15 : 12;
  const stringCount = bass ? 4 : 6;
  const guard = tone === 'blanco' ? '#2B1810' : '#F3EBD3';

  return (
    <svg viewBox={`0 0 160 ${330 + extra}`} aria-hidden="true" focusable="false">
      <defs>
        <BodyGradient id={`${uid}-body`} tone={tone} />
      </defs>

      {/* mástil */}
      <rect x="72" y="38" width="16" height={neckEnd - 38 + 20} fill="#D8B374" />
      <rect x="73.5" y="42" width="13" height={neckEnd - 42 + 14} fill="#3B2217" />
      {Array.from({ length: fretCount }, (_, i) => {
        const y = 48 + (i * (neckEnd - 48)) / fretCount;
        return <line key={i} x1="73.5" x2="86.5" y1={y} y2={y} stroke={CHROME} strokeWidth="0.8" />;
      })}
      <rect x="72" y="39" width="16" height="3" fill="#F3EBD3" />

      {/* cabeza y clavijas */}
      <path d="M71 40 L69 12 Q69 4 76 4 L84 4 Q91 4 91 12 L89 40 Z" fill="#D8B374" />
      {(bass ? [16, 28] : [14, 22, 30]).map((y) => (
        <g key={y}>
          <circle cx="66.5" cy={y} r="2.6" fill={CHROME} />
          <circle cx="93.5" cy={y} r="2.6" fill={CHROME} />
        </g>
      ))}

      <g transform={`translate(0 ${extra})`}>
        <path
          d="M80 132 C66 132 58 126 52 116 C47 108 38 108 36 120 C33 138 42 150 36 166 C29 184 18 196 20 222 C22 252 42 276 80 276 C118 276 138 252 140 222 C142 196 131 184 124 166 C118 150 127 138 124 120 C122 108 113 108 108 116 C102 126 94 132 80 132 Z"
          fill={`url(#${uid}-body)`}
          stroke="rgba(20,17,15,0.55)"
          strokeWidth="1.5"
        />
        <path
          d="M70 150 C56 156 48 178 54 208 C58 228 70 240 80 240 C96 240 108 226 110 204 C112 180 106 158 92 150 Z"
          fill={guard}
          opacity="0.95"
        />
        {(bass ? [180, 205] : [170, 190, 210]).map((y) => (
          <rect key={y} x="62" y={y} width="36" height={bass ? 10 : 8} rx="2" fill={INK} stroke="#6E6F6B" strokeWidth="0.6" />
        ))}
        <rect x="64" y="248" width="32" height="7" rx="2" fill={CHROME} />
        <circle cx="106" cy="256" r="5.5" fill={INK} stroke={CHROME} strokeWidth="1.2" />
        <circle cx="116" cy="243" r="5.5" fill={INK} stroke={CHROME} strokeWidth="1.2" />
      </g>

      {/* cuerdas */}
      {Array.from({ length: stringCount }, (_, i) => {
        const x1 = 74.4 + (i * 11.2) / (stringCount - 1);
        const x2 = 72.5 + (i * 15) / (stringCount - 1);
        return <line key={i} x1={x1} y1="40" x2={x2} y2={252 + extra} stroke="#D7DAD6" strokeWidth="0.55" />;
      })}
    </svg>
  );
}

function Acoustic({ uid, tone }: { uid: string; tone: ArtTone }) {
  return (
    <svg viewBox="0 0 170 330" aria-hidden="true" focusable="false">
      <defs>
        <BodyGradient id={`${uid}-body`} tone={tone} />
      </defs>
      <rect x="78" y="38" width="14" height="120" fill="#D8B374" />
      <rect x="79.5" y="42" width="11" height="112" fill="#3B2217" />
      {Array.from({ length: 11 }, (_, i) => (
        <line key={i} x1="79.5" x2="90.5" y1={48 + i * 10} y2={48 + i * 10} stroke={CHROME} strokeWidth="0.8" />
      ))}
      <path d="M77 40 L75 12 Q75 4 82 4 L88 4 Q95 4 95 12 L93 40 Z" fill="#D8B374" />
      {[14, 22, 30].map((y) => (
        <g key={y}>
          <circle cx="72.5" cy={y} r="2.6" fill={CHROME} />
          <circle cx="97.5" cy={y} r="2.6" fill={CHROME} />
        </g>
      ))}
      <path
        d="M85 140 C62 140 52 156 54 176 C55 190 66 198 66 208 C66 218 44 228 42 252 C40 282 62 300 85 300 C108 300 130 282 128 252 C126 228 104 218 104 208 C104 198 115 190 116 176 C118 156 108 140 85 140 Z"
        fill={`url(#${uid}-body)`}
        stroke="rgba(20,17,15,0.55)"
        strokeWidth="1.5"
      />
      <circle cx="85" cy="196" r="15" fill="#1A0F0A" />
      <circle cx="85" cy="196" r="18" fill="none" stroke="#E2CE9C" strokeWidth="2" />
      <rect x="68" y="268" width="34" height="8" rx="2" fill="#2B1810" />
      {Array.from({ length: 6 }, (_, i) => (
        <line key={i} x1={80.4 + i * 1.8} y1="40" x2={73 + i * 4.8} y2="270" stroke="#D7DAD6" strokeWidth="0.5" />
      ))}
    </svg>
  );
}

function Amp({ uid }: { uid: string }) {
  return (
    <svg viewBox="0 0 240 200" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={`${uid}-tweed`} width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#D8BE84" />
          <rect width="2" height="10" fill="#8A6A36" opacity="0.55" />
        </pattern>
        <pattern id={`${uid}-grill`} width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#4A2A18" />
          <path d="M0 0L6 6M6 0L0 6" stroke="#7A4A2A" strokeWidth="0.8" />
        </pattern>
        <linearGradient id={`${uid}-plate`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E0B65A" />
          <stop offset="1" stopColor="#B5832E" />
        </linearGradient>
      </defs>
      <rect x="86" y="6" width="68" height="12" rx="6" fill="#1A0F0A" />
      <rect x="10" y="14" width="220" height="172" rx="8" fill={`url(#${uid}-tweed)`} stroke="#2B1810" strokeWidth="2.5" />
      <rect x="18" y="22" width="204" height="34" rx="3" fill={`url(#${uid}-plate)`} stroke="#2B1810" strokeWidth="1.5" />
      {[38, 66, 94, 122, 150].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="39" r="7" fill="#1A0F0A" stroke="#E8ECE9" strokeWidth="1" />
          <line x1={cx} y1="39" x2={cx + 3} y2="34" stroke="#F3EBD3" strokeWidth="1.4" strokeLinecap="round" />
        </g>
      ))}
      <circle cx="198" cy="39" r="6" fill="#A3301F" stroke="#E0B65A" strokeWidth="1.5" />
      <rect x="26" y="66" width="188" height="108" rx="3" fill={`url(#${uid}-grill)`} stroke="#2B1810" strokeWidth="1.5" />
      <rect x="24" y="186" width="20" height="8" rx="2" fill="#1A0F0A" />
      <rect x="196" y="186" width="20" height="8" rx="2" fill="#1A0F0A" />
    </svg>
  );
}

function Keys() {
  const whites = 14;
  const keyWidth = 20.4;
  const x0 = 8;
  return (
    <svg viewBox="0 0 300 130" aria-hidden="true" focusable="false">
      <rect x="4" y="6" width="292" height="118" rx="6" fill="#2B1810" />
      <rect x="4" y="6" width="292" height="50" rx="6" fill="#3B2217" />
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i}>
          <circle cx={28 + i * 26} cy="24" r="7" fill={CHROME} />
          <line x1={28 + i * 26} y1="24" x2={30 + i * 26} y2="19" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
        </g>
      ))}
      <rect x="200" y="14" width="64" height="22" rx="2" fill="#1D4538" stroke="#6FA58E" strokeWidth="1" />
      {Array.from({ length: whites }, (_, i) => (
        <rect key={i} x={x0 + i * keyWidth} y="62" width={keyWidth - 1} height="56" fill="#F3EBD3" stroke="#2B1810" strokeWidth="0.6" />
      ))}
      {Array.from({ length: whites - 1 }, (_, i) =>
        [0, 1, 3, 4, 5].includes(i % 7) ? (
          <rect key={i} x={x0 + (i + 1) * keyWidth - 6.5} y="62" width="12" height="34" rx="1.5" fill={INK} />
        ) : null,
      )}
    </svg>
  );
}

function Pedal({ uid, tone }: { uid: string; tone: ArtTone }) {
  const [a, b] = TONES[tone];
  return (
    <svg viewBox="0 0 140 200" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${uid}-pedal`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
        <radialGradient id={`${uid}-switch`} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#F0F2F0" />
          <stop offset="1" stopColor="#8D9591" />
        </radialGradient>
      </defs>
      <rect x="10" y="70" width="8" height="18" fill="#6E7773" />
      <rect x="122" y="70" width="8" height="18" fill="#6E7773" />
      <rect x="16" y="8" width="108" height="184" rx="10" fill={`url(#${uid}-pedal)`} stroke={INK} strokeWidth="2.5" />
      {[40, 70, 100].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="44" r="11" fill={INK} stroke="#E8ECE9" strokeWidth="1.5" />
          <line x1={cx} y1="44" x2={cx + 4} y2="36" stroke="#F3EBD3" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      ))}
      <text x="70" y="110" textAnchor="middle" fontFamily="Caprasimo, Georgia, serif" fontSize="17" fill={INK}>
        Overdrive
      </text>
      <circle cx="70" cy="80" r="4" fill="#A3301F" />
      <circle cx="70" cy="150" r="21" fill={`url(#${uid}-switch)`} stroke={INK} strokeWidth="2" />
      <circle cx="70" cy="150" r="12" fill="none" stroke="#6E7773" strokeWidth="1.5" />
    </svg>
  );
}

function Strings() {
  return (
    <svg viewBox="0 0 200 140" aria-hidden="true" focusable="false">
      <rect x="24" y="12" width="152" height="116" rx="5" fill="#A3301F" stroke="#2B1810" strokeWidth="2" />
      <rect x="36" y="24" width="128" height="44" rx="3" fill="#F3EBD3" />
      <text x="100" y="54" textAnchor="middle" fontFamily="Caprasimo, Georgia, serif" fontSize="22" fill="#2B1810">
        Cuerdas
      </text>
      {[70, 130].map((cx) => (
        <g key={cx} fill="none" stroke="#E8ECE9" strokeWidth="2">
          <circle cx={cx} cy="100" r="19" />
          <circle cx={cx} cy="100" r="13" />
          <circle cx={cx} cy="100" r="7" />
        </g>
      ))}
    </svg>
  );
}

function Drum({ uid, tone }: { uid: string; tone: ArtTone }) {
  return (
    <svg viewBox="0 0 220 200" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${uid}-shell`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={TONES[tone][2]} />
          <stop offset="0.35" stopColor={TONES[tone][0]} />
          <stop offset="0.7" stopColor={TONES[tone][1]} />
          <stop offset="1" stopColor={TONES[tone][2]} />
        </linearGradient>
      </defs>
      <ellipse cx="110" cy="150" rx="90" ry="24" fill={TONES[tone][2]} />
      <rect x="20" y="60" width="180" height="90" fill={`url(#${uid}-shell)`} />
      <ellipse cx="110" cy="150" rx="90" ry="24" fill="none" stroke={CHROME} strokeWidth="4" />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={34 + i * 30} y="74" width="8" height="64" rx="2" fill={CHROME} opacity="0.9" />
      ))}
      <ellipse cx="110" cy="60" rx="90" ry="24" fill={CHROME} />
      <ellipse cx="110" cy="60" rx="82" ry="19" fill="#F3EBD3" />
      <line x1="58" y1="22" x2="140" y2="64" stroke="#D8B374" strokeWidth="6" strokeLinecap="round" />
      <line x1="168" y1="20" x2="92" y2="66" stroke="#D8B374" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export function ProductArt({ kind, tone = 'sunburst', className }: ProductArtProps) {
  const uid = useId().replace(/:/g, '');

  const art = (() => {
    switch (kind) {
      case 'electric':
        return <Electric uid={uid} tone={tone} />;
      case 'bass':
        return <Electric uid={uid} tone={tone} bass />;
      case 'acoustic':
        return <Acoustic uid={uid} tone={tone} />;
      case 'amp':
        return <Amp uid={uid} />;
      case 'keys':
        return <Keys />;
      case 'pedal':
        return <Pedal uid={uid} tone={tone} />;
      case 'strings':
        return <Strings />;
      case 'drum':
        return <Drum uid={uid} tone={tone} />;
    }
  })();

  return <div className={className}>{art}</div>;
}
