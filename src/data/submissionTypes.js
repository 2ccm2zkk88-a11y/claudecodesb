import { Megaphone, CalendarDays, Image, FileText, UserCog, PenSquare } from "lucide-react";

export const SUBMISSION_TYPES = [
  {
    id: "announcement",
    label: "Announcement",
    description: "News, reminders, or homepage banners",
    icon: Megaphone,
    color: "#E86D22",
    titleField: "headline",
    fields: [
      { name: "headline", label: "Headline", type: "text", required: true, placeholder: "e.g. Early Dismissal on Friday" },
      { name: "body", label: "Announcement text", type: "textarea", required: true, placeholder: "What should families and staff know?" },
      { name: "placement", label: "Where should this appear?", type: "select", required: true, options: ["Homepage banner", "News page", "Both homepage and news"] },
      { name: "expireDate", label: "Take down after (optional)", type: "date", required: false },
    ],
  },
  {
    id: "event",
    label: "Event",
    description: "Add or update something on the events calendar",
    icon: CalendarDays,
    color: "#7C3AED",
    titleField: "eventName",
    fields: [
      { name: "eventName", label: "Event name", type: "text", required: true, placeholder: "e.g. Fall Book Fair" },
      { name: "eventDate", label: "Event date", type: "date", required: true },
      { name: "eventTime", label: "Start / end time", type: "text", required: false, placeholder: "e.g. 5:00 PM - 7:00 PM" },
      { name: "eventLocation", label: "Location", type: "text", required: false, placeholder: "e.g. Cafeteria" },
      { name: "body", label: "Event description", type: "textarea", required: true, placeholder: "Details for the calendar listing" },
    ],
  },
  {
    id: "photo",
    label: "Photo / Video",
    description: "Media for the gallery, social feed, or homepage",
    icon: Image,
    color: "#DB2777",
    titleField: "caption",
    fields: [
      { name: "caption", label: "Caption / context", type: "textarea", required: true, placeholder: "Who, what, when — how should this be captioned?" },
      { name: "album", label: "Suggested gallery / album", type: "text", required: false, placeholder: "e.g. Fall Festival 2026" },
      { name: "fileLink", label: "Link to files (Drive, Photos, etc.)", type: "url", required: false, placeholder: "https://..." },
      { name: "releaseConfirmed", label: "I confirm everyone shown has a photo release on file", type: "checkbox", required: true },
    ],
  },
  {
    id: "document",
    label: "Document / Flyer",
    description: "PDFs, flyers, newsletters, or forms to post",
    icon: FileText,
    color: "#0D9488",
    titleField: "docTitle",
    fields: [
      { name: "docTitle", label: "Document title", type: "text", required: true, placeholder: "e.g. October Newsletter" },
      { name: "docLocation", label: "Where should it be posted?", type: "text", required: true, placeholder: "e.g. Parent Resources page" },
      { name: "fileLink", label: "Link to the file", type: "url", required: false, placeholder: "https://..." },
      { name: "body", label: "Notes for the webmaster", type: "textarea", required: false },
    ],
  },
  {
    id: "staff",
    label: "Staff / Directory Update",
    description: "New hire, photo, title, or contact change",
    icon: UserCog,
    color: "#4F46E5",
    titleField: "staffName",
    fields: [
      { name: "staffName", label: "Staff member name", type: "text", required: true },
      { name: "changeType", label: "What's changing?", type: "select", required: true, options: ["New staff listing", "Photo update", "Title / role change", "Contact info", "Remove listing"] },
      { name: "body", label: "Details", type: "textarea", required: true, placeholder: "Include the exact text or info to use" },
    ],
  },
  {
    id: "other",
    label: "Other Update (including ParentSquare, etc.)",
    description: "Anything else on the site that needs a change",
    icon: PenSquare,
    color: "#64748B",
    titleField: "pageUrl",
    fields: [
      { name: "pageUrl", label: "Page or section", type: "text", required: true, placeholder: "e.g. About Us page" },
      { name: "body", label: "Describe the change", type: "textarea", required: true },
    ],
  },
];

export const DEPARTMENTS = [
  "Administration",
  "Front Office",
  "Pre-K / Kindergarten",
  "1st - 2nd Grade",
  "3rd - 4th Grade",
  "5th Grade",
  "Counseling",
  "Special Programs",
  "Athletics / Fine Arts",
  "PTA / PTO",
  "Other",
];

export const PRIORITIES = [
  { id: "standard", label: "Standard", description: "3-5 business days" },
  { id: "urgent", label: "Urgent", description: "Needed within 24-48 hours" },
];

export const STATUSES = ["Submitted", "In Review", "Published", "Declined"];
