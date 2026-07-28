const STORAGE_KEY = "klentzman-hub-submissions";

export function loadSubmissions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSubmissions(submissions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
}

export function nextReference(submissions) {
  const year = new Date().getFullYear();
  const count = submissions.filter((s) => s.reference.startsWith(`KLZ-${year}`)).length;
  return `KLZ-${year}-${String(count + 1).padStart(3, "0")}`;
}
