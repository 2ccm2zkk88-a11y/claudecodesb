import { useMemo, useState } from "react";
import { Search, Inbox } from "lucide-react";
import { SUBMISSION_TYPES, STATUSES } from "../data/submissionTypes";
import { PALETTE, CARD_SHADOW, RING_STYLE } from "../theme";
import StatusBadge from "./StatusBadge";

function getTypeConfig(typeId) {
  return SUBMISSION_TYPES.find((t) => t.id === typeId);
}

function getTitle(submission) {
  const type = getTypeConfig(submission.typeId);
  const titleField = type?.titleField;
  return (titleField && submission.fields[titleField]) || type?.label || "Submission";
}

const selectClass = "px-3 py-2 rounded-lg text-sm focus:outline-none focus-visible:ring-2";
const selectStyle = { backgroundColor: PALETTE.onBgSurface, border: `1.5px solid ${PALETTE.border}`, color: "#FFFFFF", ...RING_STYLE };
const resultCardStyle = { backgroundColor: "#fff", border: `1.5px solid ${PALETTE.cardBorder}`, boxShadow: CARD_SHADOW };

export default function SubmissionsList({ submissions, onStatusChange }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const filtered = useMemo(() => {
    return submissions
      .filter((s) => statusFilter === "All" || s.status === statusFilter)
      .filter((s) => typeFilter === "All" || s.typeId === typeFilter)
      .filter((s) => {
        if (!query.trim()) return true;
        const q = query.trim().toLowerCase();
        return s.reference.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || getTitle(s).toLowerCase().includes(q);
      })
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  }, [submissions, query, statusFilter, typeFilter]);

  if (submissions.length === 0) {
    return (
      <div className="p-10 rounded-2xl text-center" style={{ backgroundColor: "#fff", border: `1.5px dashed ${PALETTE.border}` }}>
        <Inbox size={28} style={{ color: PALETTE.sub }} className="mx-auto mb-2" aria-hidden="true" />
        <p className="font-bold mb-1" style={{ color: PALETTE.ink }}>
          No submissions yet
        </p>
        <p className="text-sm" style={{ color: PALETTE.sub }}>
          Requests submitted through this hub will show up here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: PALETTE.onBgMuted }} aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by reference, name, or title..."
            aria-label="Search submissions"
            className="track-search w-full pl-9 pr-3 py-2 rounded-lg text-sm focus:outline-none focus-visible:ring-2"
            style={{ backgroundColor: PALETTE.onBgSurface, border: `1.5px solid ${PALETTE.border}`, color: "#FFFFFF", ...RING_STYLE }}
          />
        </div>
        <select aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass} style={selectStyle}>
          <option value="All">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select aria-label="Filter by type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={selectClass} style={selectStyle}>
          <option value="All">All types</option>
          {SUBMISSION_TYPES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm" style={{ color: PALETTE.sub }}>
          No submissions match your filters.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((s) => {
            const type = getTypeConfig(s.typeId);
            const Icon = type?.icon;
            return (
              <li key={s.reference} className="p-4 rounded-xl" style={resultCardStyle}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: type?.color + "20" }}>
                      {Icon && <Icon size={16} style={{ color: type.color }} aria-hidden="true" />}
                    </div>
                    <div>
                      <p className="text-xs font-mono font-bold" style={{ color: PALETTE.sub }}>
                        {s.reference}
                      </p>
                      <p className="font-bold text-sm" style={{ color: PALETTE.ink }}>
                        {getTitle(s)}
                      </p>
                      <p className="text-xs" style={{ color: PALETTE.sub }}>
                        {s.name} · {s.department} · Submitted {new Date(s.submittedAt).toLocaleDateString()}
                        {s.priority === "urgent" && <span style={{ color: PALETTE.warning }}> · Urgent</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={s.status} />
                    <select
                      aria-label={`Update status for ${s.reference}`}
                      value={s.status}
                      onChange={(e) => onStatusChange(s.reference, e.target.value)}
                      className="text-xs px-2 py-1 rounded-lg focus:outline-none focus-visible:ring-2"
                      style={{ border: `1.5px solid ${PALETTE.border}`, color: PALETTE.ink, ...RING_STYLE }}
                    >
                      {STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
