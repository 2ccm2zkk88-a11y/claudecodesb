import { useId } from "react";

/**
 * Reusable PCB-style circuit background. Renders low-opacity right-angle
 * traces with junction nodes, tiled via an SVG <pattern>. Meant to sit
 * behind content with `absolute inset-0 -z-10` on the parent.
 *
 * variant:
 *  - "grid"   even tile across a section (subtle, for section backgrounds)
 *  - "radial" fades out toward the edges (for hero / focal moments)
 */
export default function CircuitBackground({
  variant = "grid",
  opacity = 0.16,
  glow = false,
  className = "",
}) {
  const id = useId();
  const patternId = `cf-circuit-${id}`;
  const maskId = `cf-circuit-mask-${id}`;

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ opacity }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id={patternId} width="180" height="180" patternUnits="userSpaceOnUse">
          <g stroke="#8b5cf6" strokeWidth="1" fill="none">
            <path d="M0 40 H60 V90 H140" />
            <path d="M20 0 V25 H70 V70" opacity="0.7" />
            <path d="M180 100 H120 V150 H60 V180" opacity="0.8" />
            <path d="M110 20 H160 V60" opacity="0.6" stroke="#3d8bff" />
            <path d="M0 130 H30 V170" opacity="0.6" stroke="#3d8bff" />
          </g>
          <g fill="#8b5cf6">
            <circle cx="60" cy="40" r="2.5" />
            <circle cx="140" cy="90" r="2.5" />
            <circle cx="70" cy="25" r="2" />
            <circle cx="120" cy="100" r="2.5" />
            <circle cx="60" cy="180" r="2" />
          </g>
          <g fill="#3d8bff">
            <circle cx="160" cy="20" r="2" />
            <circle cx="30" cy="130" r="2" />
          </g>
        </pattern>
        {variant === "radial" && (
          <radialGradient id={maskId} cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="70%" stopColor="white" stopOpacity="0.55" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        )}
        {variant === "radial" && (
          <mask id={`mask-${maskId}`}>
            <rect width="100%" height="100%" fill={`url(#${maskId})`} />
          </mask>
        )}
      </defs>
      <rect
        width="100%"
        height="100%"
        fill={`url(#${patternId})`}
        mask={variant === "radial" ? `url(#mask-${maskId})` : undefined}
      />
      {glow && (
        <>
          <circle cx="20%" cy="30%" r="2.5" fill="#5ec8ff" className="cf-node-pulse" />
          <circle cx="78%" cy="62%" r="2.5" fill="#8b5cf6" className="cf-node-pulse" style={{ animationDelay: "1.1s" }} />
          <circle cx="55%" cy="18%" r="2" fill="#8b5cf6" className="cf-node-pulse" style={{ animationDelay: "2s" }} />
        </>
      )}
    </svg>
  );
}
