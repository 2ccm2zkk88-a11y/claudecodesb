import falconMarkSrc from "../assets/falcon-mark.png";

// The CyberFalcon brand mark, cropped from the official logo asset.
// This is the ONE falcon image used everywhere in the app — the navbar,
// hero, footer, and about/404 pages all render this same file so the mark
// never drifts in proportion or style. Do not substitute another glyph.
const ASPECT_RATIO = 789 / 548;

export default function FalconMark({ size = 40, glow = false, className = "", decorative = false }) {
  return (
    <img
      src={falconMarkSrc}
      alt={decorative ? "" : "CyberFalcon Digital"}
      width={size}
      height={Math.round(size / ASPECT_RATIO)}
      className={className}
      style={{
        width: size,
        height: "auto",
        filter: glow ? "drop-shadow(0 0 22px rgba(139,92,246,0.55)) drop-shadow(0 0 44px rgba(61,139,255,0.25))" : undefined,
      }}
    />
  );
}
