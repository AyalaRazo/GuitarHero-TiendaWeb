import { useEffect, useId, useState } from 'react';
import type { CSSProperties } from 'react';

/*
  Mástil de guitarra horizontal: cabeza con clavijas, cejuela, trastes con la
  separación real de 12 notas por octava, incrustaciones de perla y seis cuerdas
  que vibran al pasar el cursor.
*/

const VIEW_W = 2400;
const VIEW_H = 480;
const NUT_X = 240;
const SCALE_LENGTH = 1760;
const BOARD_TOP = 50;
const BOARD_BOTTOM = 430;
const FRET_COUNT = 24;

const fretX = (n: number) => NUT_X + SCALE_LENGTH * (1 - Math.pow(2, -n / 12));
const midFret = (n: number) => (fretX(n - 1) + fretX(n)) / 2;

const SINGLE_INLAYS = [3, 5, 7, 9, 15, 17, 19, 21];
const DOUBLE_INLAYS = [12, 24];

interface GuitarString {
  y: number;
  width: number;
  wound: boolean;
  post: { x: number; y: number };
}

const STRINGS: GuitarString[] = [
  { y: 90, width: 4.6, wound: true, post: { x: 190, y: 36 } },
  { y: 150, width: 3.8, wound: true, post: { x: 130, y: 36 } },
  { y: 210, width: 3.0, wound: true, post: { x: 70, y: 36 } },
  { y: 270, width: 2.2, wound: false, post: { x: 70, y: 444 } },
  { y: 330, width: 1.7, wound: false, post: { x: 130, y: 444 } },
  { y: 390, width: 1.3, wound: false, post: { x: 190, y: 444 } },
];

// Vetas de la madera: generadas de forma determinista para que no cambien entre renders
const GRAIN = Array.from({ length: 46 }, (_, i) => {
  const r1 = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
  const r2 = Math.abs(Math.sin(i * 78.233) * 12345.6789) % 1;
  const r3 = Math.abs(Math.sin(i * 39.425) * 9876.5432) % 1;
  const x1 = NUT_X + 10 + r2 * 900;
  return {
    y: BOARD_TOP + 6 + r1 * (BOARD_BOTTOM - BOARD_TOP - 12),
    x1,
    x2: Math.min(x1 + 260 + r3 * 900, VIEW_W),
    opacity: 0.05 + r3 * 0.1,
  };
});

interface FretboardProps {
  className?: string;
}

export function Fretboard({ className }: FretboardProps) {
  const uid = useId().replace(/:/g, '');
  const [strumming, setStrumming] = useState(true);

  // Un solo rasgueo al cargar la página; después las cuerdas solo suenan al tocarlas
  useEffect(() => {
    const timer = window.setTimeout(() => setStrumming(false), 2600);
    return () => window.clearTimeout(timer);
  }, []);

  const boardHeight = BOARD_BOTTOM - BOARD_TOP;
  // El rasgueo inicial escalona cada cuerda según su índice (--i)
  const movesClass = [
    'will-change-transform',
    strumming ? '[animation:pluck_1000ms_ease-out_calc(900ms+var(--i)*120ms)_both]' : '',
    'group-hover/string:[animation:pluck-again_900ms_ease-out_0ms_both]',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <svg className={className} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${uid}-board`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#432818" />
          <stop offset="0.5" stopColor="#351f14" />
          <stop offset="1" stopColor="#2b190f" />
        </linearGradient>
        <linearGradient id={`${uid}-head`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4d2f1e" />
          <stop offset="1" stopColor="#2f1b12" />
        </linearGradient>
        <linearGradient id={`${uid}-fret`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8d9591" />
          <stop offset="0.5" stopColor="#e8ece9" />
          <stop offset="1" stopColor="#8d9591" />
        </linearGradient>
        <radialGradient id={`${uid}-peg`} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#f0f2f0" />
          <stop offset="1" stopColor="#7d8581" />
        </radialGradient>
      </defs>

      {/* cabeza */}
      <path
        d="M40 20 H190 C214 20 228 40 240 50 V430 C228 440 214 460 190 460 H40 C22 460 10 448 10 430 V50 C10 32 22 20 40 20 Z"
        fill={`url(#${uid}-head)`}
        stroke="rgba(243,235,211,0.14)"
        strokeWidth="2"
      />
      <text
        x="125"
        y="236"
        textAnchor="middle"
        fontFamily="Caprasimo, Georgia, serif"
        fontSize="40"
        fill="#c99a3a"
      >
        Guitar
      </text>
      <text
        x="125"
        y="282"
        textAnchor="middle"
        fontFamily="Caprasimo, Georgia, serif"
        fontSize="40"
        fill="#c99a3a"
      >
        Hero
      </text>

      {/* clavijas */}
      {STRINGS.map(({ post }, i) => {
        const buttonY = post.y < VIEW_H / 2 ? 10 : 470;
        return (
          <g key={i}>
            <line x1={post.x} y1={post.y} x2={post.x} y2={buttonY} stroke="#8d9591" strokeWidth="5" />
            <circle cx={post.x} cy={buttonY} r="10" fill={`url(#${uid}-peg)`} stroke="#5f6764" strokeWidth="1.5" />
            <circle cx={post.x} cy={post.y} r="7" fill="#c99a3a" stroke="#7a5a1e" strokeWidth="1.5" />
          </g>
        );
      })}

      {/* diapasón */}
      <rect x={NUT_X} y={BOARD_TOP} width={VIEW_W - NUT_X} height={boardHeight} fill={`url(#${uid}-board)`} />
      {GRAIN.map((g, i) => (
        <line key={i} x1={g.x1} x2={g.x2} y1={g.y} y2={g.y} stroke="#0d0603" strokeWidth="2" opacity={g.opacity} />
      ))}
      <rect x={NUT_X} y={BOARD_TOP - 5} width={VIEW_W - NUT_X} height="5" fill="#e2ce9c" />
      <rect x={NUT_X} y={BOARD_BOTTOM} width={VIEW_W - NUT_X} height="5" fill="#e2ce9c" />

      {/* trastes */}
      {Array.from({ length: FRET_COUNT }, (_, i) => {
        const x = fretX(i + 1);
        return (
          <g key={i}>
            <rect x={x + 2.5} y={BOARD_TOP} width="3" height={boardHeight} fill="rgba(0,0,0,0.28)" />
            <rect x={x - 2.5} y={BOARD_TOP} width="5" height={boardHeight} fill={`url(#${uid}-fret)`} />
          </g>
        );
      })}

      {/* incrustaciones de perla */}
      {SINGLE_INLAYS.map((n) => (
        <circle key={n} cx={midFret(n)} cy={(BOARD_TOP + BOARD_BOTTOM) / 2} r="15" fill="#f3ebd3" opacity="0.92" />
      ))}
      {DOUBLE_INLAYS.map((n) => (
        <g key={n}>
          <circle cx={midFret(n)} cy="150" r="15" fill="#f3ebd3" opacity="0.92" />
          <circle cx={midFret(n)} cy="330" r="15" fill="#f3ebd3" opacity="0.92" />
        </g>
      ))}

      {/* cejuela */}
      <rect x={NUT_X - 8} y={BOARD_TOP - 5} width="12" height={boardHeight + 10} fill="#f3ebd3" />
      <rect x={NUT_X + 4} y={BOARD_TOP} width="3" height={boardHeight} fill="rgba(0,0,0,0.35)" />

      {/* cuerdas: tramo de la cabeza */}
      {STRINGS.map((s, i) => (
        <line
          key={i}
          x1={NUT_X}
          y1={s.y}
          x2={s.post.x}
          y2={s.post.y}
          stroke={s.wound ? '#c9a86b' : '#d9ddda'}
          strokeWidth={s.width * 0.8}
        />
      ))}

      {/* cuerdas: tramo vibrante */}
      {STRINGS.map((s, i) => (
        <g key={i} className="group/string cursor-pointer" style={{ '--i': i } as CSSProperties}>
          <line
                        x1={NUT_X}
            y1={s.y}
            x2={VIEW_W}
            y2={s.y}
            stroke="transparent"
            strokeWidth="30"
            pointerEvents="stroke"
          />
          <g className={movesClass}>
            <line x1={NUT_X} y1={s.y + 7} x2={VIEW_W} y2={s.y + 7} stroke="rgba(0,0,0,0.4)" strokeWidth={s.width} />
            <line
              x1={NUT_X}
              y1={s.y}
              x2={VIEW_W}
              y2={s.y}
              stroke={s.wound ? '#c9a86b' : '#d9ddda'}
              strokeWidth={s.width}
            />
            {s.wound && (
              <line
                x1={NUT_X}
                y1={s.y}
                x2={VIEW_W}
                y2={s.y}
                stroke="rgba(43,24,16,0.55)"
                strokeWidth={s.width}
                strokeDasharray="1.6 3.4"
              />
            )}
          </g>
        </g>
      ))}
    </svg>
  );
}
