export const SCHOOL_NAME = "Klentzman Intermediate School";
export const SCHOOL_SHORT = "KLENTZMAN";

export const PALETTE = {
  navy: "#0b1330",
  navyDeep: "#070c22",
  card: "#ffffff",
  ink: "#14204a",
  sub: "#5b6485",
  orange: "#e8703a",
  orangeDeep: "#c85a29",
  accent: "#3d5cff",
  danger: "#c0392b",
  ok: "#2f9e5f",
};

export const REQUEST_TYPES = [
  { id: "scheduling", label: "Schedule Time with the Principal", icon: "CalendarClock" },
  { id: "paperwork", label: "Paperwork / Forms", icon: "FileText" },
  { id: "correspondence", label: "Correspondence / Communication", icon: "Mail" },
  { id: "purchasing", label: "Purchase Order / Supplies", icon: "ShoppingCart" },
  { id: "frontoffice", label: "Front Office Task", icon: "Building2" },
  { id: "other", label: "Something Else", icon: "MoreHorizontal" },
];

export const STATUS_META = {
  pending: { label: "Pending", color: "#c88a1e", bg: "#fdf2df" },
  in_progress: { label: "In Progress", color: "#2f6fd1", bg: "#e9f1fd" },
  done: { label: "Done", color: "#2f9e5f", bg: "#e9f8ef" },
  declined: { label: "Declined", color: "#c0392b", bg: "#fdeceb" },
};

export const DEPARTMENTS = [
  "Teacher",
  "Front Office Staff",
  "Support Staff / Paraprofessional",
  "Counselor",
  "Nurse",
  "Custodial / Maintenance",
  "Parent / Guardian",
  "Other Klentzman Staff",
];
