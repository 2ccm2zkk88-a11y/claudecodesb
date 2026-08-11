import { useEffect, useState } from "react";
import {
  CalendarClock,
  FileText,
  Mail,
  ShoppingCart,
  Building2,
  MoreHorizontal,
  Send,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { callable } from "../firebase";
import { DEPARTMENTS, PALETTE, REQUEST_TYPES } from "../lib/constants";

const TYPE_ICONS = {
  scheduling: CalendarClock,
  paperwork: FileText,
  correspondence: Mail,
  purchasing: ShoppingCart,
  frontoffice: Building2,
  other: MoreHorizontal,
};

const EMPTY_FORM = {
  name: "",
  email: "",
  department: "",
  requestType: "",
  priority: "standard",
  neededBy: "",
  details: "",
};

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-bold mb-1.5" style={{ color: PALETTE.ink }}>
        {label} {required && <span style={{ color: PALETTE.danger }}>*</span>}
      </span>
      {children}
    </label>
  );
}

const inputStyle = {
  border: `1.5px solid #d7dae5`,
  color: PALETTE.ink,
};

export default function RequestForm() {
  const [meta, setMeta] = useState(null);
  const [metaError, setMetaError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { ok, message, referenceId }

  useEffect(() => {
    let cancelled = false;
    callable("getFormMeta")()
      .then((res) => {
        if (!cancelled) setMeta(res.data);
      })
      .catch((err) => {
        if (!cancelled) setMetaError(err.message || "Couldn't load today's request status.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const remaining = meta ? Math.max(meta.dailyLimit - meta.used, 0) : null;
  const limitReached = remaining === 0;

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting || limitReached) return;
    setSubmitting(true);
    setResult(null);
    try {
      const res = await callable("submitRequest")(form);
      setResult({ ok: true, referenceId: res.data.referenceId });
      setForm(EMPTY_FORM);
      setMeta((m) => (m ? { ...m, used: m.used + 1 } : m));
    } catch (err) {
      if (err.code === "functions/resource-exhausted") {
        setMeta((m) => (m ? { ...m, used: m.dailyLimit } : m));
        setResult({ ok: false, message: "Today's request limit has been reached. Please try again tomorrow." });
      } else {
        setResult({ ok: false, message: err.message || "Something went wrong. Please try again." });
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (result?.ok) {
    return (
      <div className="rounded-3xl p-8 text-center" style={{ backgroundColor: PALETTE.card }}>
        <div
          className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ backgroundColor: "#e9f8ef" }}
        >
          <CheckCircle2 size={28} style={{ color: PALETTE.ok }} />
        </div>
        <h2 className="text-xl font-extrabold mb-2" style={{ color: PALETTE.ink }}>
          Request Sent
        </h2>
        <p className="text-sm mb-1" style={{ color: PALETTE.sub }}>
          Your reference number is
        </p>
        <p className="text-lg font-mono font-bold mb-4" style={{ color: PALETTE.ink }}>
          {result.referenceId}
        </p>
        <p className="text-sm max-w-sm mx-auto mb-6" style={{ color: PALETTE.sub }}>
          The Principal's Secretary has been notified by email. You can check the status of this request
          any time using the Track My Requests panel below.
        </p>
        <button
          onClick={() => setResult(null)}
          className="px-5 py-2.5 rounded-xl font-bold text-sm text-white"
          style={{ backgroundColor: PALETTE.orange }}
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-3xl p-6 md:p-8" style={{ backgroundColor: PALETTE.card }}>
        <p className="text-xs font-extrabold uppercase tracking-wide mb-5" style={{ color: PALETTE.accent }}>
          Your Information
        </p>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Name" required>
            <input
              required
              value={form.name}
              onChange={set("name")}
              className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2"
              style={{ ...inputStyle, "--tw-ring-color": PALETTE.accent + "55" }}
            />
          </Field>
          <Field label="Email" required>
            <input
              required
              type="email"
              value={form.email}
              onChange={set("email")}
              className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2"
              style={{ ...inputStyle, "--tw-ring-color": PALETTE.accent + "55" }}
            />
          </Field>
          <Field label="Department / Role" required>
            <select
              required
              value={form.department}
              onChange={set("department")}
              className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 bg-white"
              style={{ ...inputStyle, "--tw-ring-color": PALETTE.accent + "55" }}
            >
              <option value="" disabled>
                Select one...
              </option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Needed by (optional)">
            <input
              type="date"
              value={form.neededBy}
              onChange={set("neededBy")}
              className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2"
              style={{ ...inputStyle, "--tw-ring-color": PALETTE.accent + "55" }}
            />
          </Field>
        </div>

        <div className="mt-5">
          <span className="block text-sm font-bold mb-2" style={{ color: PALETTE.ink }}>
            Priority
          </span>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "standard", label: "Standard", hint: "3-5 business days" },
              { id: "urgent", label: "Urgent", hint: "Needed within 24-48 hours" },
            ].map((p) => {
              const active = form.priority === p.id;
              return (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setForm((f) => ({ ...f, priority: p.id }))}
                  className="text-left px-4 py-3 rounded-xl transition-colors"
                  style={{
                    border: `2px solid ${active ? PALETTE.accent : "#d7dae5"}`,
                    backgroundColor: active ? PALETTE.accent + "0d" : "white",
                  }}
                >
                  <span className="block font-bold text-sm" style={{ color: PALETTE.ink }}>
                    {p.label}
                  </span>
                  <span className="block text-xs" style={{ color: PALETTE.sub }}>
                    {p.hint}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-3xl p-6 md:p-8" style={{ backgroundColor: PALETTE.card }}>
        <p className="text-xs font-extrabold uppercase tracking-wide mb-5" style={{ color: PALETTE.accent }}>
          What You Need
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {REQUEST_TYPES.map((t) => {
            const Icon = TYPE_ICONS[t.id];
            const active = form.requestType === t.id;
            return (
              <button
                type="button"
                key={t.id}
                onClick={() => setForm((f) => ({ ...f, requestType: t.id }))}
                className="flex flex-col items-start gap-2 p-3.5 rounded-2xl text-left transition-colors"
                style={{
                  border: `2px solid ${active ? PALETTE.accent : "#d7dae5"}`,
                  backgroundColor: active ? PALETTE.accent + "0d" : "white",
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: active ? PALETTE.accent : "#eef0f7" }}
                >
                  <Icon size={18} color={active ? "white" : PALETTE.sub} />
                </div>
                <span className="text-xs font-bold leading-tight" style={{ color: PALETTE.ink }}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>

        <Field label="Details" required>
          <textarea
            required
            rows={4}
            value={form.details}
            onChange={set("details")}
            placeholder="Tell her exactly what you need and any relevant context..."
            className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 resize-none"
            style={{ ...inputStyle, "--tw-ring-color": PALETTE.accent + "55" }}
          />
        </Field>
      </div>

      {result && !result.ok && (
        <div
          className="flex items-start gap-2 rounded-2xl p-4 text-sm font-semibold"
          style={{ backgroundColor: "#fdeceb", color: PALETTE.danger }}
        >
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <span>{result.message}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <p className="text-sm text-white/70">
          {metaError}
          {!metaError && meta && (
            <>
              <span className="font-bold text-white">{remaining}</span> of{" "}
              <span className="font-bold text-white">{meta.dailyLimit}</span> requests remaining today
            </>
          )}
          {!metaError && !meta && "Loading today's request status..."}
        </p>
        <button
          type="submit"
          disabled={submitting || limitReached || !meta}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: PALETTE.orange }}
        >
          <Send size={16} />
          {limitReached ? "Daily Limit Reached" : submitting ? "Sending..." : "Send Request"}
        </button>
      </div>
    </form>
  );
}
