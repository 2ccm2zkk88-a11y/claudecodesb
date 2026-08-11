#!/usr/bin/env node
// Terminal setup wizard for the Klentzman Principal's Secretary Request Hub.
// Collects Firebase + email config and writes .firebaserc, .env.local, and
// functions/.env. Run `firebase deploy` afterwards to get the live URL.

import { createInterface } from "node:readline/promises";
import { writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const rl = createInterface({ input: process.stdin, output: process.stdout });

async function ask(question, { defaultValue = "", validate } = {}) {
  const suffix = defaultValue ? ` (${defaultValue})` : "";
  while (true) {
    const answer = (await rl.question(`${question}${suffix}: `)).trim();
    const value = answer || defaultValue;
    if (validate) {
      const problem = validate(value);
      if (problem) {
        console.log(`  ! ${problem}`);
        continue;
      }
    }
    return value;
  }
}

function required(label) {
  return (value) => (value ? null : `${label} is required.`);
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "That doesn't look like a valid email address.";
}

function isPositiveInt(value) {
  return Number.isInteger(Number(value)) && Number(value) > 0 ? null : "Enter a whole number of at least 1.";
}

async function main() {
  console.log("\nKlentzman Principal's Secretary Request Hub — setup wizard\n");
  console.log("Have these ready before you start:");
  console.log("  1. A Firebase project (create one free at https://console.firebase.google.com)");
  console.log("  2. That project's Web App config (Project settings -> General -> Your apps -> Web app)");
  console.log("  3. The secretary's email address, and SMTP credentials to send mail from\n");

  const projectId = await ask("Firebase project ID", { validate: required("Project ID") });

  console.log("\n-- Secretary details --");
  const secretaryName = await ask("Secretary's name", { validate: required("Name") });
  const secretaryEmail = await ask("Secretary's email (submissions are routed here)", { validate: isEmail });
  const dailyLimit = await ask("Daily request limit", { defaultValue: "8", validate: isPositiveInt });

  console.log("\n-- Outgoing email (SMTP) --");
  console.log("For Gmail/Google Workspace, use smtp.gmail.com and a 16-character App Password,");
  console.log("not the account's normal login password: https://myaccount.google.com/apppasswords\n");
  const smtpHost = await ask("SMTP host", { defaultValue: "smtp.gmail.com" });
  const smtpPort = await ask("SMTP port", { defaultValue: "587" });
  const smtpUser = await ask("SMTP username / sending address", { validate: isEmail });
  const smtpPass = await ask("SMTP password / app password", { validate: required("SMTP password") });
  const smtpFrom = await ask("\"From\" address shown to requesters", { defaultValue: smtpUser });

  console.log("\n-- Firebase Web App config --");
  console.log("Firebase console -> Project settings -> General -> scroll to \"Your apps\" -> Web app -> SDK setup and configuration.\n");
  const apiKey = await ask("apiKey", { validate: required("apiKey") });
  const authDomain = await ask("authDomain", { defaultValue: `${projectId}.firebaseapp.com` });
  const storageBucket = await ask("storageBucket", { defaultValue: `${projectId}.firebasestorage.app` });
  const messagingSenderId = await ask("messagingSenderId", { validate: required("messagingSenderId") });
  const appId = await ask("appId", { validate: required("appId") });

  rl.close();

  await writeFile(
    path.join(root, ".firebaserc"),
    JSON.stringify({ projects: { default: projectId } }, null, 2) + "\n"
  );

  const envLocal = [
    `VITE_FIREBASE_API_KEY=${apiKey}`,
    `VITE_FIREBASE_AUTH_DOMAIN=${authDomain}`,
    `VITE_FIREBASE_PROJECT_ID=${projectId}`,
    `VITE_FIREBASE_STORAGE_BUCKET=${storageBucket}`,
    `VITE_FIREBASE_MESSAGING_SENDER_ID=${messagingSenderId}`,
    `VITE_FIREBASE_APP_ID=${appId}`,
    "",
  ].join("\n");
  await writeFile(path.join(root, ".env.local"), envLocal);

  const functionsEnv = [
    "TIMEZONE=America/Chicago",
    `DAILY_LIMIT_DEFAULT=${dailyLimit}`,
    `SECRETARY_EMAIL=${secretaryEmail}`,
    `SECRETARY_NAME=${secretaryName}`,
    `SMTP_HOST=${smtpHost}`,
    `SMTP_PORT=${smtpPort}`,
    `SMTP_USER=${smtpUser}`,
    `SMTP_PASS=${smtpPass}`,
    `SMTP_FROM=${smtpFrom}`,
    "",
  ].join("\n");
  await writeFile(path.join(root, "functions", ".env"), functionsEnv);

  console.log("\nWrote .firebaserc, .env.local, and functions/.env\n");
  console.log("Next steps:");
  console.log("  1. npm install && (cd functions && npm install)");
  console.log("  2. npx firebase-tools login");
  console.log("  3. npx firebase-tools deploy");
  console.log("  4. npm run create-secretary-account   (creates her dashboard login at /secretary)\n");
  console.log(`Once deployed, her form URL will be:  https://${projectId}.web.app`);
  console.log(`Her dashboard URL will be:            https://${projectId}.web.app/secretary\n`);

  const dropLogo = !existsSync(path.join(root, "public", "logo.png"));
  const dropTiger = !existsSync(path.join(root, "public", "tiger.jpg"));
  if (dropLogo || dropTiger) {
    console.log("Reminder: drop your image files in before deploying:");
    if (dropLogo) console.log("  - public/logo.png  (the Klentzman seal, shown top-left)");
    if (dropTiger) console.log("  - public/tiger.jpg (the tiger photo, shown bottom-left)");
    console.log("");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
