import { Lock } from "lucide-react";
import { PALETTE, SCHOOL_SHORT } from "../lib/constants";

export default function Header() {
  return (
    <div className="mb-8">
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wide mb-6"
        style={{ borderColor: PALETTE.orange, color: PALETTE.orange, backgroundColor: "rgba(232,112,58,0.08)" }}
      >
        <Lock size={12} />
        For Administrative Staff Use Only
      </div>

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
            Principal's Secretary Request Hub
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
