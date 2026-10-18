import falconMarkSrc from "../assets/falcon-mark-gold.png";

// Original supplied PNG, unchanged. The viewBox removes transparent margins
// without redrawing, recoloring, or distorting the approved falcon.
const ASPECT_RATIO = 789 / 548;

export default function FalconMark({ size = 40, glow = false, className = "", decorative = false }) {
  return (
    <svg
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "CyberFalconDigital"}
      aria-hidden={decorative ? true : undefined}
      width={size}
      height={Math.round(size / ASPECT_RATIO)}
      viewBox="319 490 820 422"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={{
        width: size,
        height: Math.round(size / ASPECT_RATIO),
        filter: glow ? "drop-shadow(0 0 22px rgba(212,175,55,0.55)) drop-shadow(0 0 44px rgba(255,215,0,0.25))" : undefined,
      }}
    >
      <image href={falconMarkSrc} width="1414" height="2000" />
    </svg>
  );
}
