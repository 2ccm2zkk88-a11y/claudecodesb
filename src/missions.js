export const PALETTE = {
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

export const APPS = [
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

export const FILTERS = ["All", "Students", "Teachers", "Parents", "Staff"];

export function matchesFilter(app, filter) {
  if (filter === "All") return true;
  return app.audience.toLowerCase().includes(filter.toLowerCase());
}

export function matchesQuery(app, query) {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  return (
    app.name.toLowerCase().includes(q) ||
    app.role.toLowerCase().includes(q) ||
    app.audience.toLowerCase().includes(q) ||
    app.ttess.toLowerCase().includes(q)
  );
}
