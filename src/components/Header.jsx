import { PALETTE, SCHOOL_SHORT } from "../lib/constants";

export default function Header() {
  return (
    <div className="mb-8">
      <div className="flex items-start gap-4">
        <img
          src="/logo.png"
          alt="Klentzman Intermediate School logo"
          className="w-20 h-20 rounded-full shrink-0 object-cover"
          style={{ border: "3px solid rgba(255,255,255,0.35)", backgroundColor: PALETTE.navyDeep }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div>
          <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: PALETTE.orange }}>
            {SCHOOL_SHORT}
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-1 leading-tight">
            Ms. Edwards's Corner
          </h1>
          <p className="text-sm text-white/70 max-w-xl leading-relaxed">
            Submit a request or check on something you're waiting for. This hub routes only to the
            Principal's Secretary &mdash; for general campus office needs, please contact the front office
            directly.
          </p>
        </div>
      </div>
    </div>
  );
}
