#!/usr/bin/env node
// Creates (or updates) the secretary's Firebase Auth login for the
// /secretary dashboard, and grants it the "secretary" custom claim that
// the Cloud Functions check before returning any request data.
//
// Requires a service account key: Firebase console -> Project settings ->
// Service accounts -> Generate new private key.

import { createInterface } from "node:readline/promises";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const rl = createInterface({ input: process.stdin, output: process.stdout });

async function main() {
  console.log("\nCreate/update the secretary's login for the request dashboard\n");
  console.log("Note: the password you type below will be echoed to the terminal.\n");

  const defaultKeyPath = path.join(root, "serviceAccountKey.json");
  const keyPathInput = await rl.question(
    `Path to Firebase service account JSON (${existsSync(defaultKeyPath) ? "serviceAccountKey.json" : "download from Firebase console"}): `
  );
  const keyPath = keyPathInput.trim() || defaultKeyPath;
  if (!existsSync(keyPath)) {
    console.error(`\nCouldn't find a service account key at ${keyPath}.`);
    console.error("Firebase console -> Project settings -> Service accounts -> Generate new private key.");
    process.exit(1);
  }
  const serviceAccount = JSON.parse(readFileSync(keyPath, "utf8"));

  const { initializeApp, cert } = await import("firebase-admin/app");
  const { getAuth } = await import("firebase-admin/auth");
  initializeApp({ credential: cert(serviceAccount) });
  const auth = getAuth();

  const functionsEnv = {};
  const functionsEnvPath = path.join(root, "functions", ".env");
  if (existsSync(functionsEnvPath)) {
    for (const line of readFileSync(functionsEnvPath, "utf8").split("\n")) {
      const [key, ...rest] = line.split("=");
      if (key) functionsEnv[key.trim()] = rest.join("=").trim();
    }
  }

  const emailInput = await rl.question(
    `Secretary's login email${functionsEnv.SECRETARY_EMAIL ? ` (${functionsEnv.SECRETARY_EMAIL})` : ""}: `
  );
  const email = emailInput.trim() || functionsEnv.SECRETARY_EMAIL;
  if (!email) {
    console.error("An email address is required.");
    process.exit(1);
  }
  const password = (await rl.question("Set a password for the dashboard (min 6 characters): ")).trim();
  rl.close();

  if (password.length < 6) {
    console.error("Password must be at least 6 characters.");
    process.exit(1);
  }

  let user;
  try {
    user = await auth.getUserByEmail(email);
    await auth.updateUser(user.uid, { password });
    console.log(`\nUpdated existing account for ${email}.`);
  } catch {
    user = await auth.createUser({ email, password });
    console.log(`\nCreated account for ${email}.`);
  }

  await auth.setCustomUserClaims(user.uid, { role: "secretary" });
  console.log('Granted the "secretary" role.');
  console.log("\nShe can now sign in at https://<your-project-id>.web.app/secretary\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
