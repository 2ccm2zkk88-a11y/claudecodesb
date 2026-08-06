# Learning Launch Pad

A React + Vite single-page app for Alief ISD Digital Learning: a searchable, filterable grid of
the district's classroom apps, each with a "mission briefing" explaining what it does, what trips
people up, and a coach's move for supporting teachers who use it.

## Development

```
npm install
npm run dev
```

## Testing

```
npm test        # run the suite once
npm run test:watch
```

Tests cover the search/filter logic (`src/missions.js`), mission data integrity, and the
`LaunchConsole` component (grid rendering, search, filters, and the mission briefing modal).

## Deploying to Firebase Hosting

This app has no backend of its own — it's a static build, so any static host works. The steps
below use Firebase Hosting:

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

Once live, that URL can be linked from or embedded in the district's existing site (e.g. as an
embedded page in Google Sites) if it isn't the primary campus site itself.

## Linting

```
npm run lint
```
