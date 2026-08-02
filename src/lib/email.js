import emailjs from "@emailjs/browser";

// EmailJS service/template IDs and public key are safe to ship client-side by design
// (see https://www.emailjs.com/docs/sdk/installation) — env vars can still override these
// for a future template/service change without a code edit.
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_84rtut4";
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_qrzexzp";
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "dphobgqfiSnw86q5o";

export const NOTIFY_EMAILS = ["Leanna.niemann@aliefisd.net", "Joany.cardona@aliefisd.net", "sable.banks@aliefisd.net"];

// EmailJS only reliably attaches files sent via sendForm (reading a real <form>'s fields
// and file inputs), not via send() with File objects passed as plain params — so the caller
// passes the actual form element here rather than a params object.
export async function sendSubmissionEmail(formElement) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn("EmailJS is not configured (missing VITE_EMAILJS_* env vars) — skipping email notification.");
    return { sent: false, reason: "not_configured" };
  }

  try {
    await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formElement, { publicKey: PUBLIC_KEY });
    return { sent: true };
  } catch (err) {
    console.error("Failed to send submission email:", err);
    return { sent: false, reason: "send_failed" };
  }
}
