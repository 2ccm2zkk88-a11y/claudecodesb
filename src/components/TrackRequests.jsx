import { useState } from "react";
import { Search, Inbox } from "lucide-react";
import { callable } from "../firebase";
import { PALETTE, STATUS_META } from "../lib/constants";

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.pending;
  return (
    <span
      className="text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shrink-0"
      style={{ color: meta.color, backgroundColor: meta.bg }}
    >
      {meta.label}
    </span>
  );
}

export default function TrackRequests() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [requests, setRequests] = useState(null);

  async function handleSearch(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    setRequests(null);
    try {
      const res = await callable("getMyRequests")({ email: email.trim() });
      setRequests(res.data.requests);
    } catch (err) {
      setError(err.message || "Couldn't load your requests.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl p-6 md:p-8" style={{ backgroundColor: PALETTE.card }}>
      <p className="text-xs font-extrabold uppercase tracking-wide mb-1" style={{ color: PALETTE.accent }}>
        Track My Requests
      </p>
      <p className="text-sm mb-5" style={{ color: PALETTE.sub }}>
        Enter the email you submitted with to see the status of your requests.
      </p>
      <form onSubmit={handleSearch} className="flex gap-2 mb-5">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@klentzman.example.org"
          className="flex-1 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2"
          style={{ border: "1.5px solid #d7dae5", color: PALETTE.ink, "--tw-ring-color": PALETTE.accent + "55" }}
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white disabled:opacity-50"
          style={{ backgroundColor: PALETTE.ink }}
        >
          <Search size={15} />
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <p className="text-sm font-semibold mb-3" style={{ color: PALETTE.danger }}>
          {error}
        </p>
      )}

      {requests && requests.length === 0 && (
        <div className="flex flex-col items-center text-center py-6" style={{ color: PALETTE.sub }}>
          <Inbox size={24} className="mb-2" />
          <p className="text-sm">No requests found for that email.</p>
        </div>
      )}

      {requests && requests.length > 0 && (
        <ul className="space-y-3">
          {requests.map((r) => (
            <li
              key={r.id}
              className="flex items-start justify-between gap-3 p-4 rounded-2xl"
              style={{ backgroundColor: "#f6f7fb" }}
            >
              <div className="min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: PALETTE.ink }}>
                  {r.requestTypeLabel}
                </p>
                <p className="text-xs mt-0.5 line-clamp-2" style={{ color: PALETTE.sub }}>
                  {r.details}
                </p>
                <p className="text-[11px] mt-1 font-mono" style={{ color: PALETTE.sub }}>
                  {r.referenceId} &middot; {r.createdAtLabel}
                </p>
              </div>
              <StatusBadge status={r.status} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
