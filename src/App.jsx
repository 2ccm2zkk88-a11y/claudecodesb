import { useEffect, useState } from "react";
import { ClipboardList, SendHorizonal, LifeBuoy } from "lucide-react";
import RequestForm from "./components/RequestForm";
import SubmissionsList from "./components/SubmissionsList";
import { loadSubmissions, saveSubmissions } from "./lib/submissions";
import { PALETTE, RING_STYLE, CARD_SHADOW } from "./theme";

export default function App() {
  const [tab, setTab] = useState("submit");
  const [submissions, setSubmissions] = useState(() => loadSubmissions());

  useEffect(() => {
    saveSubmissions(submissions);
  }, [submissions]);

  const addSubmission = (submission) => {
    setSubmissions((prev) => [...prev, submission]);
  };

  const updateStatus = (reference, status) => {
    setSubmissions((prev) => prev.map((s) => (s.reference === reference ? { ...s, status } : s)));
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: PALETTE.bg,
        backgroundImage: "url(/page-bg.jpg)",
        backgroundRepeat: "repeat",
      }}
    >
      <div className="max-w-3xl mx-auto p-6 md:p-10 relative z-10" style={{ fontFamily: "system-ui, sans-serif" }}>
        <header className="mb-8 flex items-start gap-3">
          <img
            src="/klentzman-logo.jpg"
            alt="Klentzman Intermediate School Citgo Innovation Academy logo"
            className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover shrink-0"
            style={{ border: `3px solid ${PALETTE.cardBorder}` }}
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: PALETTE.orange }}>
              Klentzman
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold mb-1" style={{ color: PALETTE.onBg }}>
              Website & Content Submission Hub
            </h1>
            <p className="text-sm max-w-xl" style={{ color: PALETTE.onBgMuted }}>
              Request announcements, events, photos, documents, and other updates for the campus website in one place.
            </p>
          </div>
        </header>

        <nav className="flex flex-wrap gap-2 mb-6" aria-label="Hub sections">
          <button
            onClick={() => setTab("submit")}
            className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2"
            style={{
              backgroundColor: tab === "submit" ? PALETTE.navy : "#fff",
              color: tab === "submit" ? "#fff" : PALETTE.navy,
              border: `1.5px solid ${tab === "submit" ? PALETTE.cardBorder : PALETTE.navy}`,
              boxShadow: CARD_SHADOW,
              ...RING_STYLE,
            }}
          >
            <SendHorizonal size={15} aria-hidden="true" /> Submit a Request
          </button>
          <button
            onClick={() => setTab("tech")}
            className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2"
            style={{
              backgroundColor: tab === "tech" ? PALETTE.navy : "#fff",
              color: tab === "tech" ? "#fff" : PALETTE.navy,
              border: `1.5px solid ${tab === "tech" ? PALETTE.cardBorder : PALETTE.navy}`,
              boxShadow: CARD_SHADOW,
              ...RING_STYLE,
            }}
          >
            <LifeBuoy size={15} aria-hidden="true" /> Tech Support Request
          </button>
          <button
            onClick={() => setTab("track")}
            className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2"
            style={{
              backgroundColor: tab === "track" ? PALETTE.navy : "#fff",
              color: tab === "track" ? "#fff" : PALETTE.navy,
              border: `1.5px solid ${tab === "track" ? PALETTE.cardBorder : PALETTE.navy}`,
              boxShadow: CARD_SHADOW,
              ...RING_STYLE,
            }}
          >
            <ClipboardList size={15} aria-hidden="true" /> Track Submissions
            {submissions.length > 0 && (
              <span className="text-[10px] font-bold px-1.5 rounded-full" style={{ backgroundColor: PALETTE.accent, color: "#fff" }}>
                {submissions.length}
              </span>
            )}
          </button>
        </nav>

        {tab === "submit" && <RequestForm submissions={submissions} onSubmit={addSubmission} onViewTrack={() => setTab("track")} />}
        {tab === "tech" && <RequestForm submissions={submissions} onSubmit={addSubmission} onViewTrack={() => setTab("track")} lockedTypeId="tech" />}
        {tab === "track" && <SubmissionsList submissions={submissions} onStatusChange={updateStatus} />}
      </div>

      <img
        src="/tiger-cutout.webp"
        alt=""
        aria-hidden="true"
        className="hidden sm:block fixed pointer-events-none select-none"
        style={{
          bottom: "-2%",
          right: "-2%",
          zIndex: 0,
          width: "clamp(220px, 35vw, 620px)",
          height: "auto",
          filter: "drop-shadow(0 12px 20px rgba(13, 42, 92, 0.45))",
          maskImage: "linear-gradient(120deg, transparent 2%, rgba(0,0,0,0.5) 30%, black 55%)",
          WebkitMaskImage: "linear-gradient(120deg, transparent 2%, rgba(0,0,0,0.5) 30%, black 55%)",
        }}
      />
    </div>
  );
}
