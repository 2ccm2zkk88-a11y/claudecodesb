# Klentzman Principal's Secretary Request Hub

A request-and-tracking form for Klentzman Intermediate School's Principal's
Secretary. It is scoped intentionally: **for requests to the Principal's
Secretary only**, not a general campus office line. It enforces a daily
request limit, emails every submission straight to her inbox, and gives her
a simple dashboard to track and update the status of things she's agreed to
do.

- Public form + tracker: `/`
- Secretary dashboard (login required): `/secretary`

## Stack

- React + Vite + Tailwind (frontend)
- Firebase Hosting (gives you the real, shareable URL)
- Firebase Firestore (stores requests + the daily counter)
- Firebase Cloud Functions, Node.js (enforces the daily limit atomically,
  sends the routing email, powers the dashboard)
- Firebase Auth (single account, the secretary's dashboard login)
- Nodemailer (sends the actual emails over SMTP — Gmail, Workspace, etc.)

Firestore itself is locked down (`firestore.rules` denies all direct client
reads/writes) — every read and write goes through a Cloud Function, which is
what makes the daily limit and the secretary-only dashboard actually
enforceable instead of just a UI suggestion.

## 1. Add the two images

Drop these two files in `public/` before you deploy:

- `public/logo.png` — the Klentzman seal, shown top-left of the form
- `public/tiger.jpg` — the tiger photo, shown bottom-left of the page

The page still works without them (the spots just stay empty), so you can
deploy first and add them later if that's easier.

## 2. Create a Firebase project

At <https://console.firebase.google.com>, create a project (the free Spark
plan works for this volume of traffic, though Cloud Functions requires
upgrading to the pay-as-you-go Blaze plan — it stays free at this scale,
you just have to add a billing account). Then:

- Firestore Database -> Create database (any region close to Texas, e.g.
  `us-central` or `us-south1`) -> production mode.
- Authentication -> Sign-in method -> enable **Email/Password**.
- Project settings -> General -> "Your apps" -> add a **Web app**. You'll
  need its config values in the next step.

## 3. Run the setup wizard

```
npm install
npm run setup
```

This is the "terminal prompts" step — it asks for the secretary's name and
email, the daily request limit, SMTP credentials to actually send mail, and
the Web app config from step 2. It writes `.firebaserc`, `.env.local`, and
`functions/.env` for you. None of those are committed to git (see
`.gitignore`) since they contain project-specific and SMTP credentials.

For Gmail/Google Workspace SMTP, use an **App Password**
(<https://myaccount.google.com/apppasswords>), not the normal account
password.

## 4. Deploy

```
cd functions && npm install && cd ..
npx firebase-tools login
npm run deploy
```

`npm run deploy` builds the frontend and runs `firebase deploy` (hosting +
functions + Firestore rules/indexes) in one shot. When it finishes, Firebase
prints the live URL — that's the actual link to hand the secretary:

```
https://<your-project-id>.web.app
```

## 5. Create her dashboard login

```
npm run create-secretary-account
```

This needs a service account key (Firebase console -> Project settings ->
Service accounts -> Generate new private key -> save as
`serviceAccountKey.json` in the project root, which is gitignored). It
creates her Firebase Auth account and grants the `secretary` role that the
dashboard functions check for. She signs in at
`https://<your-project-id>.web.app/secretary`.

Re-run this script any time to reset her password.

## How the daily limit works

Every submission runs inside a Firestore transaction in the `submitRequest`
function: it reads today's counter, and only creates the request (and
increments the counter) if `used < dailyLimit`. That means the limit holds
even if two people submit at the exact same moment — there's no race where
it goes over. "Today" is computed in the `America/Chicago` timezone (set
`TIMEZONE` in `functions/.env` to change it).

The limit itself isn't fixed at deploy time — the secretary can change it
any time from the dashboard, no redeploy needed.

## Changing things later

- **Daily limit**: change it from the `/secretary` dashboard, or edit the
  `settings/general` document in Firestore directly.
- **Routing email / secretary name**: edit `functions/.env`
  (`SECRETARY_EMAIL`, `SECRETARY_NAME`) and redeploy functions
  (`npx firebase-tools deploy --only functions`), or edit
  `settings/general.secretaryEmail` / `.secretaryName` in Firestore.
- **Request categories**: edit `REQUEST_TYPES` in `src/lib/constants.js`
  (frontend) and `REQUEST_TYPE_LABELS` in `functions/index.js` (backend) —
  keep the `id`s in sync between the two.

## Local development

```
npm run dev
```

The form will show "Firebase isn't configured yet" for anything that talks
to the backend until you've run the setup wizard and deployed at least
once — Cloud Functions callables need a real deployed project, they don't
run against `vite dev` alone. To iterate on backend logic locally, use the
Firebase Emulator Suite (`npx firebase-tools emulators:start`) and point
`src/firebase.js` at the emulator with `connectFunctionsEmulator`.
