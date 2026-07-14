import { useEffect, useRef, useState } from "react";
import { X, Users, Compass as CompassIcon, Rocket, AlertTriangle, Target, Search } from "lucide-react";

const PALETTE = {
  bg: "#FFF6E9",
  ink: "#2B2250",
  sub: "#6B5F91",
  card: "#FFFFFF",
  sky: "#2F9BD6",
  coral: "#FF6B6B",
  sun: "#FFB627",
  grass: "#3FA66B",
  outline: "#2B2250",
};

const APPS = [
  {
    id: "schoology",
    name: "Schoology",
    emoji: "📚",
    role: "Class Hub",
    color: PALETTE.sky,
    audience: "Teachers, students",
    core: "Where teachers post assignments, run discussion boards, and collect student coursework.",
    painPoint: "A teacher's gradebook categories don't match their grading period weights, so report card grades come out wrong at the end of a six weeks.",
    coach: "Walk the category weights with them before week one, not after the first grades post. This is the single most common Schoology ticket on any campus.",
    ttess: "Domain 2: Instruction",
  },
  {
    id: "classlink",
    name: "ClassLink LaunchPad",
    emoji: "🚀",
    role: "Mission Control",
    color: PALETTE.coral,
    audience: "Students, staff, parents",
    core: "Single click access to every educational and administrative app a person is provisioned for, no separate logins.",
    painPoint: "A student says an app 'disappeared' from their LaunchPad. Almost always a provisioning or rostering sync issue, not a student error.",
    coach: "Check the rostering feed before you touch the student's account. Teach campus techs to triage there first, it saves a help desk escalation nine times out of ten.",
    ttess: "Liaison / Technology Services",
  },
  {
    id: "parentsquare",
    name: "ParentSquare",
    emoji: "💬",
    role: "Home Base Radio",
    color: PALETTE.grass,
    audience: "Parents, teachers, staff",
    core: "School to home messaging: text and email notifications, digital form signing, direct teacher messaging.",
    painPoint: "A parent says they 'never get notifications.' Usually a language or notification preference setting, not a delivery failure.",
    coach: "Coach teachers to confirm parent preference settings during Meet the Teacher, not mid-semester when a form deadline is already missed.",
    ttess: "Positive Stakeholder Relationships",
  },
  {
    id: "destiny",
    name: "Destiny Library Manager",
    emoji: "📖",
    role: "Book Vault",
    color: PALETTE.sun,
    audience: "Students, teachers, librarians",
    core: "One portal to search and access print books, eBooks, and licensed digital databases.",
    painPoint: "Students can find a print title but the eBook or database version doesn't show, usually a licensing or catalog sync gap, not a missing resource.",
    coach: "Loop in the campus librarian before troubleshooting the account. This is a resource-selection conversation as much as a tech one.",
    ttess: "Domain 1: Planning",
  },
  {
    id: "brainpop",
    name: "BrainPOP",
    emoji: "🧠",
    role: "Brain Lab",
    color: PALETTE.coral,
    audience: "Students, teachers",
    core: "Animated content and quizzes supplementing core instruction across subjects.",
    painPoint: "Teachers default to the video and skip the quiz and concept map, missing the formative check built into the tool.",
    coach: "Model a full BrainPOP cycle in a coaching visit, video, quiz, concept map, so teachers see it as an assessment tool, not a five minute filler.",
    ttess: "Domain 2: Instruction",
  },
  {
    id: "britannica",
    name: "Britannica School",
    emoji: "🦉",
    role: "Research Roost",
    color: PALETTE.grass,
    audience: "Students, teachers",
    core: "Leveled encyclopedia articles for research skills across elementary through high school.",
    painPoint: "Students default to open web search because they don't know the database exists or how to search it.",
    coach: "Bundle it into a research skills mini-lesson with the campus librarian rather than assuming students will discover it on their own.",
    ttess: "Domain 1: Planning",
  },
  {
    id: "gale",
    name: "Gale",
    emoji: "🔍",
    role: "Deep Dive Desk",
    color: PALETTE.sky,
    audience: "Students, teachers",
    core: "Broader academic and reference database library supporting research across content areas.",
    painPoint: "Students hit a login wall off-campus and give up rather than troubleshoot single sign-on.",
    coach: "Confirm ClassLink provisioning covers off-campus access before assigning research homework that depends on it.",
    ttess: "Liaison / Technology Services",
  },
  {
    id: "storyline",
    name: "Storyline Online",
    emoji: "🎬",
    role: "Story Theater",
    color: PALETTE.sun,
    audience: "Students, teachers",
    core: "Celebrity-narrated read-alouds of children's books for literacy support.",
    painPoint: "Used as a passive video break instead of a paired reading or listening comprehension activity.",
    coach: "Pair it with a simple retell or prediction protocol so it counts as instruction time, not screen time.",
    ttess: "Domain 2: Instruction",
  },
  {
    id: "worldbook",
    name: "World Book Online",
    emoji: "🌎",
    role: "Explorer's Atlas",
    color: PALETTE.grass,
    audience: "Students, teachers",
    core: "Encyclopedia and research database with leveled content for younger learners.",
    painPoint: "Overlaps with Britannica School, teachers often don't know which one to point a student toward for a given task.",
    coach: "Give teachers a one line rule of thumb per database rather than presenting all of them as interchangeable choices.",
    ttess: "Domain 1: Planning",
  },
];

const FILTERS = ["All", "Students", "Teachers", "Parents", "Staff"];

function matchesFilter(app, filter) {
  if (filter === "All") return true;
  return app.audience.toLowerCase().includes(filter.toLowerCase());
}

function matchesQuery(app, query) {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  return (
    app.name.toLowerCase().includes(q) ||
    app.role.toLowerCase().includes(q) ||
    app.audience.toLowerCase().includes(q) ||
    app.ttess.toLowerCase().includes(q)
  );
}

function Tile({ app, onOpen }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={() => onOpen(app)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className="flex flex-col items-center gap-2 p-4 rounded-3xl transition-transform focus:outline-none focus-visible:ring-4"
      style={{
        backgroundColor: PALETTE.card,
        border: `3px solid ${PALETTE.outline}`,
        boxShadow: hover ? `5px 5px 0px ${app.color}` : `3px 3px 0px ${app.color}`,
        transform: hover ? "translate(-2px, -2px)" : "none",
        "--tw-ring-color": app.color + "55",
      }}
      aria-haspopup="dialog"
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
        style={{ backgroundColor: app.color + "22", border: `2px solid ${app.color}` }}
      >
        <span aria-hidden="true">{app.emoji}</span>
      </div>
      <span className="text-sm font-bold text-center leading-tight" style={{ color: PALETTE.ink, fontFamily: "Baloo 2, sans-serif" }}>
        {app.name}
      </span>
      <span
        className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
        style={{ color: "white", backgroundColor: app.color }}
      >
        {app.role}
      </span>
    </button>
  );
}

function Section({ icon, label, color, children, italic }) {
  return (
    <div className="mb-4">
      <p
        className="text-xs font-bold uppercase tracking-wide mb-1 flex items-center gap-1.5"
        style={{ color, fontFamily: "Baloo 2, sans-serif" }}
      >
        {icon} {label}
      </p>
      <p className={`text-sm leading-relaxed ${italic ? "italic" : ""}`} style={{ color: PALETTE.ink }}>
        {children}
      </p>
    </div>
  );
}

function MissionBriefing({ app, onClose }) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!app) return;
    closeBtnRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [app, onClose]);

  if (!app) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ backgroundColor: "rgba(43, 34, 80, 0.55)" }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mission-briefing-title"
        className="max-w-lg w-full rounded-3xl p-6 relative max-h-[85vh] overflow-y-auto"
        style={{ backgroundColor: PALETTE.card, border: `4px solid ${PALETTE.ink}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeBtnRef}
          onClick={onClose}
          aria-label="Close mission briefing"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center focus:outline-none focus-visible:ring-2"
          style={{ backgroundColor: PALETTE.bg, color: PALETTE.ink, border: `2px solid ${PALETTE.ink}` }}
        >
          <X size={16} />
        </button>

        <div
          className="flex items-center gap-3 mb-4 -mx-6 -mt-6 px-6 py-4 rounded-t-2xl"
          style={{ backgroundColor: app.color + "1a" }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
            style={{ backgroundColor: PALETTE.card, border: `2px solid ${app.color}` }}
          >
            <span aria-hidden="true">{app.emoji}</span>
          </div>
          <div>
            <h2 id="mission-briefing-title" className="text-2xl leading-tight" style={{ color: PALETTE.ink, fontFamily: "Baloo 2, sans-serif" }}>
              {app.name}
            </h2>
            <span
              className="inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mt-1"
              style={{ color: "white", backgroundColor: app.color }}
            >
              {app.role}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 text-xs font-semibold" style={{ color: PALETTE.sub }}>
          <Users size={14} />
          <span>{app.audience}</span>
        </div>

        <Section icon={<Target size={14} />} label="What it does" color={PALETTE.sky}>
          {app.core}
        </Section>

        <Section icon={<AlertTriangle size={14} />} label="What trips people up" color={PALETTE.coral}>
          {app.painPoint}
        </Section>

        <div className="rounded-2xl p-3" style={{ backgroundColor: PALETTE.bg }}>
          <Section icon={<CompassIcon size={14} />} label="Coach's move" color={PALETTE.grass} italic>
            {app.coach}
          </Section>
          <span
            className="inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full"
            style={{ color: PALETTE.ink, border: `2px solid ${PALETTE.ink}` }}
          >
            Ties to: {app.ttess}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function LaunchConsole() {
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = APPS.filter((app) => matchesFilter(app, filter) && matchesQuery(app, query));

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ backgroundColor: PALETTE.bg }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700&family=Nunito:wght@400;700&display=swap');`}</style>
      <div className="max-w-4xl mx-auto" style={{ fontFamily: "Nunito, sans-serif" }}>
        <div className="mb-8 flex items-start gap-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
            style={{ backgroundColor: PALETTE.card, border: `3px solid ${PALETTE.ink}` }}
          >
            <Rocket size={28} style={{ color: PALETTE.coral }} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: PALETTE.sky }}>
              Alief ISD Digital Learning
            </p>
            <h1 className="text-3xl md:text-4xl mb-1" style={{ color: PALETTE.ink, fontFamily: "Baloo 2, sans-serif" }}>
              Learning Launch Pad
            </h1>
            <p className="text-sm max-w-xl" style={{ color: PALETTE.sub }}>
              Tap a mission to see how it works, what to watch out for, and how a coach helps a classroom use it well.
            </p>
          </div>
        </div>

        <div className="mb-5 flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: PALETTE.sub }}
              aria-hidden="true"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search missions by name, audience, or focus area..."
              aria-label="Search missions"
              className="w-full pl-9 pr-3 py-2 rounded-2xl text-sm focus:outline-none focus-visible:ring-4"
              style={{
                backgroundColor: PALETTE.card,
                border: `3px solid ${PALETTE.outline}`,
                color: PALETTE.ink,
                "--tw-ring-color": PALETTE.sky + "55",
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter missions by audience">
            {FILTERS.map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  aria-pressed={active}
                  className="text-xs font-bold uppercase tracking-wide px-3 py-2 rounded-full transition-colors focus:outline-none focus-visible:ring-2"
                  style={{
                    backgroundColor: active ? PALETTE.ink : PALETTE.card,
                    color: active ? "white" : PALETTE.ink,
                    border: `2px solid ${PALETTE.ink}`,
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
            {filtered.map((app) => (
              <Tile key={app.id} app={app} onOpen={setSelected} />
            ))}
          </div>
        ) : (
          <div
            className="mb-4 p-8 rounded-3xl text-center"
            style={{ backgroundColor: PALETTE.card, border: `3px dashed ${PALETTE.sub}` }}
          >
            <p className="font-bold mb-1" style={{ color: PALETTE.ink, fontFamily: "Baloo 2, sans-serif" }}>
              No missions match "{query}"
            </p>
            <p className="text-sm" style={{ color: PALETTE.sub }}>
              Try a different search term or clear the audience filter.
            </p>
          </div>
        )}

        <p className="text-xs font-bold uppercase tracking-wide" style={{ color: PALETTE.sub }}>
          {filtered.length} of {APPS.length} missions {filtered.length === APPS.length ? "ready for launch" : "shown"}
        </p>
      </div>

      <MissionBriefing app={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
