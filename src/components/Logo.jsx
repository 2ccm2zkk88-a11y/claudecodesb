import { Link } from "react-router-dom";
import FalconMark from "./FalconMark";

// Full logo lockup: falcon mark + wordmark. Use `compact` in tight spaces
// (mobile nav) to drop the "DIGITAL" line and shrink the mark.
export default function Logo({ compact = false, className = "", markOnly = false }) {
  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <FalconMark size={compact ? 34 : 42} decorative />
      {!markOnly && (
        <span className="flex flex-col leading-none">
          <span className="text-[1.05rem] sm:text-[1.15rem] font-semibold tracking-tight text-white">
            CyberFalcon
          </span>
          {!compact && (
            <span className="text-[0.6rem] font-bold tracking-[0.3em] text-[color:var(--cf-blue)]">
              DIGITAL
            </span>
          )}
        </span>
      )}
    </span>
  );

  return (
    <Link
      to="/"
      aria-label="CyberFalcon Digital — home"
      className="inline-flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cf-purple)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070D]"
    >
      {content}
    </Link>
  );
}
