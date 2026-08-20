// The CyberFalcon brand mark: a single angular falcon glyph.
// This is the ONE falcon silhouette used everywhere in the app — the navbar,
// hero, footer, and favicon all render this same component so the mark never
// drifts in proportion or style. Do not introduce a second falcon shape.
import { useId } from "react";

export default function FalconMark({ size = 40, glow = false, className = "" }) {
  const id = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 240 200"
      fill="none"
      role="img"
      aria-label="CyberFalcon Digital"
      className={className}
    >
      <defs>
        <linearGradient id={`cf-wing-${id}`} x1="70" y1="60" x2="238" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c9b8ff" />
          <stop offset="35%" stopColor="#8b5cf6" />
          <stop offset="70%" stopColor="#5b21d6" />
          <stop offset="100%" stopColor="#2a1470" />
        </linearGradient>
        <linearGradient id={`cf-head-${id}`} x1="14" y1="70" x2="100" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e8e0ff" />
          <stop offset="55%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        {glow && (
          <filter id={`cf-glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>
      <g filter={glow ? `url(#cf-glow-${id})` : undefined}>
        {/* Wing feathers, fanning back-to-front */}
        <path
          d="M95 70 L230 20 L150 75 L100 90 Z"
          fill={`url(#cf-wing-${id})`}
        />
        <path
          d="M100 90 L235 60 L160 105 L105 110 Z"
          fill={`url(#cf-wing-${id})`}
        />
        <path
          d="M105 110 L238 100 L165 135 L108 130 Z"
          fill={`url(#cf-wing-${id})`}
        />
        <path
          d="M90 120 L108 130 L140 155 L210 150 L150 158 L95 140 Z"
          fill={`url(#cf-wing-${id})`}
        />
        {/* Head + beak */}
        <path
          d="M18 108 L55 88 L70 70 L95 95 L92 118 L60 132 L30 118 Z"
          fill={`url(#cf-head-${id})`}
        />
        {/* Eye */}
        <circle cx="49" cy="97" r="4.5" fill="#0a0620" />
      </g>
    </svg>
  );
}
