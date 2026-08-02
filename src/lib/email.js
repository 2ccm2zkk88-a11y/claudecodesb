import emailjs from "@emailjs/browser";

// EmailJS service/template IDs and public key are safe to ship client-side by design
// (see https://www.emailjs.com/docs/sdk/installation) — env vars can still override these
// for a future template/service change without a code edit.
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_84rtut4";
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_qrzexzp";
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "dphobgqfiSnw86q5o";

export const NOTIFY_EMAILS = ["Leanna.niemann@aliefisd.net", "Joany.cardona@aliefisd.net", "sable.banks@aliefisd.net"];

function formatDetails(submission) {
  return Object.entries(submission.fields)
    .filter(([, value]) => value !== "" && value !== false && value != null)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

export async function sendSubmissionEmail(submission, typeLabel) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn("EmailJS is not configured (missing VITE_EMAILJS_* env vars) — skipping email notification.");
    return { sent: false, reason: "not_configured" };
  }

  const templateParams = {
    to_emails: NOTIFY_EMAILS.join(", "),
    reference: submission.reference,
    submission_type: typeLabel,
    requester_name: submission.name,
    requester_email: submission.email,
    department: submission.department,
    priority: submission.priority,
    needed_by: submission.neededBy || "Not specified",
    notes: submission.notes || "None",
    details: formatDetails(submission),
  };

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, { publicKey: PUBLIC_KEY });
    return { sent: true };
  } catch (err) {
    console.error("Failed to send submission email:", err);
    return { sent: false, reason: "send_failed" };
  }
}
