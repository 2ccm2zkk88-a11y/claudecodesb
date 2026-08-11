# Ms. Edwards's Corner

A request-and-tracking form for Klentzman Intermediate School's Principal's
Secretary, Ms. Edwards. It is scoped intentionally: **for requests to the
Principal's Secretary only**, not a general campus office line. It enforces
a daily request limit, emails every submission straight to her inbox, and
gives her a simple dashboard to track and update the status of things she's
agreed to do.

- Public form + tracker: `/`
- Secretary dashboard (login required): `/secretary`

## Stack

- React + Vite + Tailwind (frontend)
- Firebase Hosting (gives you the real, shareable URL)
- Firebase Firestore (stores requests + the daily counter)
- Firebase Cloud Functions, Node.js (enforces the daily limit atomically,
  sends the routing email, powers the dashboard)
- Firebase Auth (single account, the secretary's dashboard login)
- EmailJS (sends the actual emails — no SMTP credentials to manage)

Firestore itself is locked down (`firestore.rules` denies all direct client
reads/writes) — every read and write goes through a Cloud Function, which is
what makes the daily limit and the secretary-only dashboard actually
enforceable instead of just a UI suggestion.

## 1. Add the logo

`public/tiger.png` is already in the repo. Still needed:

- `public/logo.png` — the Klentzman seal, shown top-left of the form

The page still works without it (the spot just stays empty), so you can
deploy first and add it later if that's easier.

## 2. Set up EmailJS

At <https://dashboard.emailjs.com>, create a free account (200 emails/month,
plenty for this), then:

1. **Email Services** -> Add New Service -> connect the inbox you want mail
   to actually send from (Gmail, Outlook, or any SMTP box). Copy its
   **Service ID**.
2. **Email Templates** -> Create New Template for the secretary's
   notification. Set "To Email" to `{{to_email}}` and "Reply To" to
   `{{reply_to}}`, then use these merge fields in the subject/body:

   | Variable | Example |
   |---|---|
   | `{{requester_name}}` | Jordan Lee |
   | `{{requester_email}}` | jlee@klentzman.example.org |
   | `{{department}}` | Teacher |
   | `{{request_type}}` | Paperwork / Forms |
   | `{{priority}}` | Standard |
   | `{{needed_by}}` | 2026-08-20 |
   | `{{details}}` | Free-text request details |
   | `{{reference_id}}` | KZ-20260811-004 |

   Copy this template's **Template ID** — you'll need it as
   `EMAILJS_SECRETARY_TEMPLATE_ID`.
3. *(Optional)* Create a second template that confirms receipt to the
   requester. Set "To Email" to `{{to_email}}` and use `{{requester_name}}`,
   `{{reference_id}}`, `{{priority}}`, and `{{secretary_name}}`. Copy its
   Template ID as `EMAILJS_REQUESTER_TEMPLATE_ID` — leave this blank in
   setup if you don't want a confirmation email sent.
4. **Account** -> General for your **Public Key**, and **Account** -> API
   Keys for your **Private Key**. The private key is what lets the Cloud
   Function send mail server-side (not from a browser) — keep it out of
   git, same as any other secret; `npm run setup` writes it to
   `functions/.env`, which is gitignored.

## 3. Create a Firebase project

At <https://console.firebase.google.com>, create a project (the free Spark
plan works for this volume of traffic, though Cloud Functions requires
upgrading to the pay-as-you-go Blaze plan — it stays free at this scale,
you just have to add a billing account). Then:

- Firestore Database -> Create database (any region close to Texas, e.g.
  `us-central` or `us-south1`) -> production mode.
- Authentication -> Sign-in method -> enable **Email/Password**.
- Project settings -> General -> "Your apps" -> add a **Web app**. You'll
  need its config values in the next step.

## 4. Run the setup wizard

```
npm install
npm run setup
```

This is the "terminal prompts" step — it asks for the secretary's name and
email, the daily request limit, the EmailJS values from step 2, and the Web
app config from step 3. It writes `.firebaserc`, `.env.local`, and
`functions/.env` for you. None of those are committed to git (see
`.gitignore`) since they contain project-specific and EmailJS credentials.

## 5. Deploy

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

## 6. Create her dashboard login

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
- **Email templates**: edit them directly in the EmailJS dashboard — no
  redeploy needed, just keep the merge field names listed in step 2 intact.

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
