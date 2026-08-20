import { useEffect, useState } from "react";
import { CheckCircle2, Inbox } from "lucide-react";
import { managementRequests } from "../config/site";

// Animated visual: incoming website-update requests moving into a
// "managed" queue with a checkmark once handled. Purely decorative —
// cycles through the request list on an interval and pauses for
// prefers-reduced-motion.
export default function RequestQueue() {
  const [activeCount, setActiveCount] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setActiveCount(managementRequests.length);
      return;
    }
    const interval = setInterval(() => {
      setActiveCount((count) => (count >= managementRequests.length ? 1 : count + 1));
    }, 1600);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  return (
    <div
      className="relative rounded-2xl border border-cf-border bg-cf-surface/70 p-5 sm:p-6"
      role="group"
      aria-label="Example website update requests handled by CyberFalcon Digital"
    >
      <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-cf-gray-dim">
        <Inbox size={14} aria-hidden="true" />
        Incoming requests
      </div>

      <ul className="flex flex-col gap-2.5">
        {managementRequests.map((request, index) => {
          const isHandled = index < activeCount;
          return (
            <li
              key={request}
              className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm transition-all duration-500 ${
                isHandled
                  ? "border-cf-purple/40 bg-cf-bg-soft text-white"
                  : "border-cf-border/60 bg-transparent text-cf-gray-dim opacity-60"
              }`}
            >
              <span>{request}</span>
              <CheckCircle2
                size={17}
                aria-hidden="true"
                className={`shrink-0 transition-all duration-500 ${
                  isHandled ? "text-cf-blue-bright scale-100 opacity-100" : "scale-75 opacity-0"
                }`}
              />
            </li>
          );
        })}
      </ul>

      <p className="mt-5 border-t border-cf-border pt-4 text-center text-sm font-medium text-cf-gray">
        Send it to <span className="text-white">CyberFalcon Digital.</span>
      </p>
    </div>
  );
}
