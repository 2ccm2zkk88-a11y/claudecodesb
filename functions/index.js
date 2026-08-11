import { onCall, HttpsError } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2/options";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

setGlobalOptions({ maxInstances: 10, region: "us-central1" });

initializeApp();
const db = getFirestore();

const TIMEZONE = process.env.TIMEZONE || "America/Chicago";
const DEFAULT_DAILY_LIMIT = Number(process.env.DAILY_LIMIT_DEFAULT || 8);
const DEFAULT_SECRETARY_EMAIL = process.env.SECRETARY_EMAIL || "";
const DEFAULT_SECRETARY_NAME = process.env.SECRETARY_NAME || "the Principal's Secretary";

const REQUEST_TYPE_LABELS = {
  scheduling: "Schedule Time with the Principal",
  paperwork: "Paperwork / Forms",
  correspondence: "Correspondence / Communication",
  purchasing: "Purchase Order / Supplies",
  frontoffice: "Front Office Task",
  other: "Something Else",
};

const STATUS_VALUES = ["pending", "in_progress", "done", "declined"];

function todayKey() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(
    new Date()
  );
}

function formatTimestamp(ts) {
  if (!ts) return "";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

async function sendViaEmailJS(templateId, templateParams) {
  const { EMAILJS_SERVICE_ID, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY } = process.env;
  if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY || !templateId) {
    console.warn("EmailJS is not configured; skipping email delivery.");
    return;
  }
  try {
    const res = await fetch(EMAILJS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: templateId,
        user_id: EMAILJS_PUBLIC_KEY,
        accessToken: EMAILJS_PRIVATE_KEY || undefined,
        template_params: templateParams,
      }),
    });
    if (!res.ok) {
      console.error("EmailJS send failed", res.status, await res.text());
    }
  } catch (err) {
    console.error("Failed to send email via EmailJS", err);
  }
}

async function getSettings() {
  const snap = await db.collection("settings").doc("general").get();
  const data = snap.exists ? snap.data() : {};
  return {
    dailyLimit: Number(data.dailyLimit) || DEFAULT_DAILY_LIMIT,
    secretaryEmail: data.secretaryEmail || DEFAULT_SECRETARY_EMAIL,
    secretaryName: data.secretaryName || DEFAULT_SECRETARY_NAME,
  };
}

function requireSecretary(request) {
  if (request.auth?.token?.role !== "secretary") {
    throw new HttpsError("permission-denied", "You must be signed in as the secretary to do that.");
  }
}

export const getFormMeta = onCall(async () => {
  const settings = await getSettings();
  const key = todayKey();
  const counterSnap = await db.collection("counters").doc(key).get();
  const used = counterSnap.exists ? Number(counterSnap.data().count) || 0 : 0;
  return {
    dailyLimit: settings.dailyLimit,
    used,
    secretaryName: settings.secretaryName,
  };
});

export const submitRequest = onCall(async (request) => {
  const data = request.data || {};
  const name = String(data.name || "").trim();
  const email = String(data.email || "").trim();
  const department = String(data.department || "").trim();
  const requestType = String(data.requestType || "").trim();
  const priority = data.priority === "urgent" ? "urgent" : "standard";
  const neededBy = String(data.neededBy || "").trim();
  const details = String(data.details || "").trim();

  if (!name || !email || !department || !details) {
    throw new HttpsError("invalid-argument", "Please fill in all required fields.");
  }
  if (!REQUEST_TYPE_LABELS[requestType]) {
    throw new HttpsError("invalid-argument", "Please choose what you're submitting.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpsError("invalid-argument", "Please enter a valid email address.");
  }

  const key = todayKey();
  const settings = await getSettings();
  const counterRef = db.collection("counters").doc(key);
  const requestRef = db.collection("requests").doc();

  const referenceId = await db.runTransaction(async (tx) => {
    const counterSnap = await tx.get(counterRef);
    const used = counterSnap.exists ? Number(counterSnap.data().count) || 0 : 0;
    if (used >= settings.dailyLimit) {
      throw new HttpsError("resource-exhausted", "Today's request limit has been reached. Please try again tomorrow.");
    }
    const newCount = used + 1;
    tx.set(counterRef, { count: newCount, date: key }, { merge: true });

    const ref = `KZ-${key.replace(/-/g, "")}-${String(newCount).padStart(3, "0")}`;
    tx.set(requestRef, {
      name,
      email,
      emailLower: email.toLowerCase(),
      department,
      requestType,
      requestTypeLabel: REQUEST_TYPE_LABELS[requestType],
      priority,
      neededBy,
      details,
      status: "pending",
      referenceId: ref,
      dateKey: key,
      createdAt: FieldValue.serverTimestamp(),
    });
    return ref;
  });

  if (settings.secretaryEmail) {
    await sendViaEmailJS(process.env.EMAILJS_SECRETARY_TEMPLATE_ID, {
      to_email: settings.secretaryEmail,
      reply_to: email,
      requester_name: name,
      requester_email: email,
      department,
      request_type: REQUEST_TYPE_LABELS[requestType],
      priority: priority === "urgent" ? "Urgent" : "Standard",
      needed_by: neededBy || "Not specified",
      details,
      reference_id: referenceId,
    });
  }

  if (process.env.EMAILJS_REQUESTER_TEMPLATE_ID) {
    await sendViaEmailJS(process.env.EMAILJS_REQUESTER_TEMPLATE_ID, {
      to_email: email,
      requester_name: name,
      reference_id: referenceId,
      priority: priority === "urgent" ? "Urgent" : "Standard",
      secretary_name: settings.secretaryName,
    });
  }

  return { referenceId };
});

export const getMyRequests = onCall(async (request) => {
  const email = String(request.data?.email || "").trim().toLowerCase();
  if (!email) throw new HttpsError("invalid-argument", "Please enter an email address.");

  const snap = await db
    .collection("requests")
    .where("emailLower", "==", email)
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  const requests = snap.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      referenceId: d.referenceId,
      requestTypeLabel: d.requestTypeLabel,
      details: d.details,
      status: d.status,
      neededBy: d.neededBy || "",
      createdAtLabel: formatTimestamp(d.createdAt),
    };
  });

  return { requests };
});

export const getDashboardData = onCall(async (request) => {
  requireSecretary(request);
  const settings = await getSettings();
  const key = todayKey();
  const counterSnap = await db.collection("counters").doc(key).get();
  const usedToday = counterSnap.exists ? Number(counterSnap.data().count) || 0 : 0;

  const snap = await db.collection("requests").orderBy("createdAt", "desc").limit(300).get();
  const requests = snap.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      referenceId: d.referenceId,
      name: d.name,
      email: d.email,
      department: d.department,
      requestTypeLabel: d.requestTypeLabel,
      priority: d.priority,
      neededBy: d.neededBy || "",
      details: d.details,
      status: d.status,
      createdAtLabel: formatTimestamp(d.createdAt),
    };
  });

  return { dailyLimit: settings.dailyLimit, usedToday, requests };
});

export const updateRequestStatus = onCall(async (request) => {
  requireSecretary(request);
  const id = String(request.data?.id || "");
  const status = String(request.data?.status || "");
  if (!id || !STATUS_VALUES.includes(status)) {
    throw new HttpsError("invalid-argument", "Invalid status update.");
  }
  await db.collection("requests").doc(id).update({ status, statusUpdatedAt: FieldValue.serverTimestamp() });
  return { ok: true };
});

export const updateSettings = onCall(async (request) => {
  requireSecretary(request);
  const dailyLimit = Number(request.data?.dailyLimit);
  if (!Number.isInteger(dailyLimit) || dailyLimit < 1) {
    throw new HttpsError("invalid-argument", "Daily limit must be a whole number of at least 1.");
  }
  await db.collection("settings").doc("general").set({ dailyLimit }, { merge: true });
  return { ok: true };
});
