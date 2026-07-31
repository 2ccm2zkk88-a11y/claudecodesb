import { useEffect, useState } from "react";
import { ClipboardList, SendHorizonal } from "lucide-react";
import RequestForm from "./components/RequestForm";
import SubmissionsList from "./components/SubmissionsList";
import { loadSubmissions, saveSubmissions } from "./lib/submissions";
import { PALETTE, RING_STYLE } from "./theme";

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
    <div className="min-h-screen" style={{ backgroundColor: PALETTE.bg }}>
      <div className="max-w-3xl mx-auto p-6 md:p-10" style={{ fontFamily: "system-ui, sans-serif" }}>
        <header className="mb-8 flex items-start gap-3">
          <img
            src="/klentzman-logo.jpg"
            alt="Klentzman Intermediate School Citgo Innovation Academy logo"
            className="w-16 h-16 rounded-full object-cover shrink-0"
            style={{ border: `2px solid ${PALETTE.border}` }}
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: PALETTE.accent }}>
              Klentzman
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold mb-1" style={{ color: PALETTE.ink }}>
              Website & Content Submission Hub
            </h1>
            <p className="text-sm max-w-xl" style={{ color: PALETTE.sub }}>
              Request announcements, events, photos, documents, and other updates for the campus website in one place.
            </p>
          </div>
        </header>

        <nav className="flex gap-2 mb-6" role="tablist" aria-label="Hub sections">
          <button
            role="tab"
            aria-selected={tab === "submit"}
            onClick={() => setTab("submit")}
            className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2"
            style={{
              backgroundColor: tab === "submit" ? PALETTE.navy : "#fff",
              color: tab === "submit" ? "#fff" : PALETTE.ink,
              border: `1.5px solid ${PALETTE.navy}`,
              ...RING_STYLE,
            }}
          >
            <SendHorizonal size={15} aria-hidden="true" /> Submit a Request
          </button>
          <button
            role="tab"
            aria-selected={tab === "track"}
            onClick={() => setTab("track")}
            className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2"
            style={{
              backgroundColor: tab === "track" ? PALETTE.navy : "#fff",
              color: tab === "track" ? "#fff" : PALETTE.ink,
              border: `1.5px solid ${PALETTE.navy}`,
              ...RING_STYLE,
            }}
          >
            <ClipboardList size={15} aria-hidden="true" /> Track Submissions
            {submissions.length > 0 && (
              <span
                className="text-[10px] font-bold px-1.5 rounded-full"
                style={{ backgroundColor: tab === "track" ? PALETTE.accent : PALETTE.bg, color: tab === "track" ? "#fff" : PALETTE.sub }}
              >
                {submissions.length}
              </span>
            )}
          </button>
        </nav>

        {tab === "submit" ? (
          <RequestForm submissions={submissions} onSubmit={addSubmission} onViewTrack={() => setTab("track")} />
        ) : (
          <SubmissionsList submissions={submissions} onStatusChange={updateStatus} />
        )}
      </div>
    </div>
  );
}
