import { useState } from "react";
import { Send, ClipboardList } from "lucide-react";
import Header from "./Header";
import RequestForm from "./RequestForm";
import TrackRequests from "./TrackRequests";
import TigerDecoration from "./TigerDecoration";
import { PALETTE } from "../lib/constants";

export default function Hub() {
  const [tab, setTab] = useState("submit");

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundColor: PALETTE.navy,
        backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 26px)`,
      }}
    >
      <TigerDecoration />
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-10 md:py-14">
        <Header />

        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setTab("submit")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors"
            style={{
              backgroundColor: tab === "submit" ? PALETTE.orange : "rgba(255,255,255,0.08)",
              color: "white",
            }}
          >
            <Send size={16} />
            Submit a Request
          </button>
          <button
            onClick={() => setTab("track")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors"
            style={{
              backgroundColor: tab === "track" ? PALETTE.orange : "rgba(255,255,255,0.08)",
              color: "white",
            }}
          >
            <ClipboardList size={16} />
            Track My Requests
          </button>
        </div>

        {tab === "submit" ? <RequestForm /> : <TrackRequests />}

        <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-white/40">
          <p>This hub is for requests directed to the Klentzman Principal's Secretary only.</p>
          <a href="/secretary" className="underline hover:text-white/70">
            Secretary Login
          </a>
        </div>
      </div>
    </div>
  );
}
