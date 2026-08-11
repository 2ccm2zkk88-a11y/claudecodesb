import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { LogOut, RefreshCw, Save, ShieldAlert } from "lucide-react";
import { auth, callable, configIsMissing } from "../firebase";
import { PALETTE, STATUS_META } from "../lib/constants";

const STATUS_ORDER = ["pending", "in_progress", "done", "declined"];

function LoginForm({ onSignedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSignedIn();
    } catch {
      setError("Couldn't sign in. Check your email and password and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: PALETTE.navy }}>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl p-8"
        style={{ backgroundColor: PALETTE.card }}
      >
        <h1 className="text-xl font-extrabold mb-1" style={{ color: PALETTE.ink }}>
          Secretary Login
        </h1>
        <p className="text-sm mb-6" style={{ color: PALETTE.sub }}>
          Sign in to view and manage requests.
        </p>
        <div className="space-y-3 mb-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2"
            style={{ border: "1.5px solid #d7dae5", color: PALETTE.ink, "--tw-ring-color": PALETTE.accent + "55" }}
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2"
            style={{ border: "1.5px solid #d7dae5", color: PALETTE.ink, "--tw-ring-color": PALETTE.accent + "55" }}
          />
        </div>
        {error && (
          <p className="text-sm font-semibold mb-4" style={{ color: PALETTE.danger }}>
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="w-full py-2.5 rounded-xl font-bold text-sm text-white disabled:opacity-50"
          style={{ backgroundColor: PALETTE.orange }}
        >
          {busy ? "Signing in..." : "Sign In"}
        </button>
        <p className="text-xs mt-4" style={{ color: PALETTE.sub }}>
          Don't have an account yet? Run <code>npm run create-secretary-account</code> from the terminal setup
          to create one.
        </p>
      </form>
    </div>
  );
}

function RequestRow({ req, onUpdateStatus }) {
  return (
    <li className="p-4 rounded-2xl" style={{ backgroundColor: "#f6f7fb" }}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <p className="text-sm font-bold" style={{ color: PALETTE.ink }}>
            {req.requestTypeLabel}{" "}
            {req.priority === "urgent" && (
              <span className="ml-1 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#fdeceb", color: PALETTE.danger }}>
                Urgent
              </span>
            )}
          </p>
          <p className="text-xs mt-0.5" style={{ color: PALETTE.sub }}>
            {req.name} &middot; {req.email} &middot; {req.department}
          </p>
        </div>
        <span className="text-[11px] font-mono shrink-0" style={{ color: PALETTE.sub }}>
          {req.createdAtLabel}
        </span>
      </div>
      <p className="text-sm mb-3" style={{ color: PALETTE.ink }}>
        {req.details}
      </p>
      {req.neededBy && (
        <p className="text-xs mb-3" style={{ color: PALETTE.sub }}>
          Needed by: {req.neededBy}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {STATUS_ORDER.map((s) => {
          const meta = STATUS_META[s];
          const active = req.status === s;
          return (
            <button
              key={s}
              onClick={() => onUpdateStatus(req.id, s)}
              className="text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full transition-transform"
              style={{
                color: active ? "white" : meta.color,
                backgroundColor: active ? meta.color : meta.bg,
              }}
            >
              {meta.label}
            </button>
          );
        })}
      </div>
    </li>
  );
}

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [limitDraft, setLimitDraft] = useState("");
  const [savingLimit, setSavingLimit] = useState(false);
  const [filter, setFilter] = useState("all");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await callable("getDashboardData")();
      setData(res.data);
      setLimitDraft(String(res.data.dailyLimit));
    } catch (err) {
      setError(err.message || "Couldn't load the dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpdateStatus(id, status) {
    setData((d) => ({
      ...d,
      requests: d.requests.map((r) => (r.id === id ? { ...r, status } : r)),
    }));
    try {
      await callable("updateRequestStatus")({ id, status });
    } catch (err) {
      setError(err.message || "Couldn't update that request. Refresh and try again.");
    }
  }

  async function handleSaveLimit(e) {
    e.preventDefault();
    const n = Number(limitDraft);
    if (!Number.isInteger(n) || n < 1) return;
    setSavingLimit(true);
    try {
      await callable("updateSettings")({ dailyLimit: n });
      setData((d) => ({ ...d, dailyLimit: n }));
    } catch (err) {
      setError(err.message || "Couldn't save the daily limit.");
    } finally {
      setSavingLimit(false);
    }
  }

  const visibleRequests = data?.requests.filter((r) => filter === "all" || r.status === filter) ?? [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f2f3f8" }}>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between gap-3 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold" style={{ color: PALETTE.ink }}>
              Request Dashboard
            </h1>
            <p className="text-sm" style={{ color: PALETTE.sub }}>
              {data ? `${data.usedToday} of ${data.dailyLimit} requests used today` : "Loading..."}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={load}
              className="w-10 h-10 flex items-center justify-center rounded-xl"
              style={{ backgroundColor: "white", color: PALETTE.ink }}
              aria-label="Refresh"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={() => signOut(auth)}
              className="w-10 h-10 flex items-center justify-center rounded-xl"
              style={{ backgroundColor: "white", color: PALETTE.ink }}
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-2xl p-4 mb-6 text-sm font-semibold" style={{ backgroundColor: "#fdeceb", color: PALETTE.danger }}>
            <ShieldAlert size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSaveLimit} className="rounded-2xl p-5 mb-6 flex items-center gap-3 flex-wrap" style={{ backgroundColor: "white" }}>
          <label className="text-sm font-bold" style={{ color: PALETTE.ink }}>
            Daily request limit
          </label>
          <input
            type="number"
            min={1}
            value={limitDraft}
            onChange={(e) => setLimitDraft(e.target.value)}
            className="w-20 px-3 py-1.5 rounded-lg text-sm"
            style={{ border: "1.5px solid #d7dae5", color: PALETTE.ink }}
          />
          <button
            type="submit"
            disabled={savingLimit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs text-white disabled:opacity-50"
            style={{ backgroundColor: PALETTE.accent }}
          >
            <Save size={13} />
            Save
          </button>
        </form>

        <div className="flex flex-wrap gap-2 mb-5">
          {["all", "pending", "in_progress", "done", "declined"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full"
              style={{
                backgroundColor: filter === f ? PALETTE.ink : "white",
                color: filter === f ? "white" : PALETTE.ink,
              }}
            >
              {f === "all" ? "All" : STATUS_META[f].label}
            </button>
          ))}
        </div>

        {loading && <p style={{ color: PALETTE.sub }}>Loading requests...</p>}

        {!loading && visibleRequests.length === 0 && (
          <p className="text-sm" style={{ color: PALETTE.sub }}>
            No requests here.
          </p>
        )}

        <ul className="space-y-3">
          {visibleRequests.map((req) => (
            <RequestRow key={req.id} req={req} onUpdateStatus={handleUpdateStatus} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function SecretaryDashboard() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    if (!auth) {
      setUser(null);
      return;
    }
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  if (configIsMissing) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center" style={{ backgroundColor: PALETTE.navy }}>
        <p className="text-white/70 max-w-sm text-sm">
          Firebase isn't configured yet. Run <code>npm run setup</code> in the terminal and deploy before
          using the dashboard.
        </p>
      </div>
    );
  }

  if (user === undefined) return null;
  if (!user) return <LoginForm onSignedIn={() => {}} />;
  return <Dashboard />;
}
