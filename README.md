# Klentzman Website & Content Submission Hub

A staff-facing form for requesting announcements, events, photos, documents, and other updates
for the campus website, plus a tracking view for submitted requests.

## Development

```
npm install
npm run dev
```

## Email notifications

Submitted requests are emailed to `Leanna.niemann@aliefisd.net`, `Joany.cardona@aliefisd.net`,
and `sable.banks@aliefisd.net` via [EmailJS](https://www.emailjs.com), which sends email directly
from the browser — no backend server is required. Until it's configured, submissions are still
saved in the browser (see "Data storage" below) but no email is sent.

To turn on email delivery:

1. Create a free EmailJS account at [emailjs.com](https://www.emailjs.com).
2. Add an **Email Service** (connect the sending mailbox you want the notifications to come from)
   and note its **Service ID**.
3. Create an **Email Template**. In the template's "To Email" field, enter all three addresses
   above separated by commas. In the template body, use these variables to show the submission
   details: `{{reference}}`, `{{submission_type}}`, `{{requester_name}}`, `{{requester_email}}`,
   `{{department}}`, `{{priority}}`, `{{needed_by}}`, `{{notes}}`, `{{details}}`. Note the
   **Template ID**.
4. Find your **Public Key** under Account > General.
5. Copy `.env.example` to `.env` and fill in the three values:
   ```
   VITE_EMAILJS_SERVICE_ID=...
   VITE_EMAILJS_TEMPLATE_ID=...
   VITE_EMAILJS_PUBLIC_KEY=...
   ```
6. Restart the dev server (or rebuild) so Vite picks up the new environment variables.

If email delivery ever fails (bad config, EmailJS outage, etc.), the request is still recorded —
the confirmation screen will say the notification couldn't be sent so staff know to follow up
directly.

### File attachments

Staff can attach up to 3 files (5MB each) when submitting a request. For these to actually arrive
as email attachments, your EmailJS template needs three **Attachment**-type variables named
`attachment_1`, `attachment_2`, and `attachment_3` (in the template editor: Attachments > Add
Attachment > Dynamic from parameter, using those exact names). Attachments are a paid-plan feature
on EmailJS — check your plan's attachment size limits, since very large files may be silently
dropped or cause the send to fail even though they pass the app's 5MB check. If a request comes in
with no visible attachment, that's the first thing to check.

## Deploying to Firebase Hosting

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com) (or use
   an existing one for the district).
2. Install the CLI and log in from your machine:
   ```
   npm install -g firebase-tools
   firebase login
   ```
3. Copy `.firebaserc.example` to `.firebaserc` and replace `your-firebase-project-id` with your
   actual Firebase project ID.
4. Build and deploy:
   ```
   npm run build
   firebase deploy
   ```
   Firebase will print the live URL (`https://<project-id>.web.app`) when it finishes.
5. Set the `VITE_EMAILJS_*` variables (see "Email notifications" above) in your `.env` file
   *before* running `npm run build`, since Vite bakes them into the build at build time.

Once live, that URL can be linked from or embedded in the district's existing site (e.g. as an
embedded page in Google Sites) if it isn't the primary campus site itself.

## Data storage

This app has no backend of its own. Submitted requests are stored in the submitting browser's
`localStorage`, which is how the "Track Submissions" tab works. This means submissions are not
shared across devices or visible to anyone else unless the email notification (above) is
configured and delivered.
