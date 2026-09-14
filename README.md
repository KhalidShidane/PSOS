# Personal Student OS (PSOS)

A personal student productivity and university management system. PSOS
brings a student's schedule, courses, study time, assignments, tasks,
prayer times, and coding practice into one place, and answers four
questions at a glance: **What am I doing now? What's next? What do I
still need to finish? How am I progressing?**

University and study/revision are the primary focus; coding is tracked
but stays visually secondary throughout the app.

## Features

- **Authentication** — JWT-based register/login/logout, profile view/edit
  with a photo, change password.
- **University** — courses, weekly/daily timetable, course detail pages.
- **Study & Revision** — a start/pause/resume/stop/complete study timer,
  manual session logging, history, and by-course breakdown.
- **Assignments & Tasks** — full CRUD, quick-complete, overdue/due-today/
  upcoming/completed views, priority highlighting.
- **Prayer** — user-configurable Fajr/Dhuhr/Asr/Maghrib/Isha times with a
  live current/next-prayer indicator and countdown.
- **Coding** — lightweight session tracking (secondary activity).
- **Dashboard** — current activity, next activity, next prayer, today's
  schedule, what still needs attention, and today's progress, plus
  one-click quick actions.
- **Analytics** — daily/weekly/monthly study, task, assignment, coding,
  and course-progress statistics, backed entirely by real database
  aggregation (no fabricated numbers).
- **Weekly Review** — an editable reflection (achievements, challenges,
  next week's plan) paired with live-computed, non-editable weekly
  statistics.

## Tech Stack

100% MERN, JavaScript only (no TypeScript, no SQL database):

- **MongoDB** + **Mongoose** — database
- **Express.js** — REST API (helmet security headers, rate-limited auth
  endpoints, centralized error handling)
- **React** (Vite) — frontend (Tailwind CSS, React Router, React Hook
  Form, Axios)
- **Node.js** — backend runtime

Brand colors: emerald `#10B981` (primary/actions) and charcoal `#1F2937`
(text/sidebar). No blue/indigo/cyan is used anywhere in the UI.

## Project Structure

```text
personal-student-os/
├── client/                       React (Vite) frontend
│   ├── src/
│   │   ├── components/           Reusable UI, grouped by feature
│   │   │   └── common/           Shared primitives: Modal, Badge, StatCard,
│   │   │                         ProgressBar, RingProgress, StatusBar, Tabs,
│   │   │                         Avatar, EmptyState/LoadingState/ErrorState
│   │   ├── pages/                One component per route
│   │   ├── layouts/               MainLayout (sidebar+navbar), AuthLayout
│   │   ├── hooks/                 Data-fetching + timer/clock hooks
│   │   ├── services/              Axios API clients, one per resource
│   │   ├── context/                AuthContext
│   │   └── utils/                  Pure helpers (dates, formatting, grouping)
│   └── .env.example
│
├── server/                        Express/MongoDB backend
│   ├── config/db.js               MongoDB connection
│   ├── controllers/                Thin request handlers
│   ├── services/                   Business logic (incl. analyticsService)
│   ├── models/                     Mongoose schemas
│   ├── middleware/                 auth, error, 404 handling
│   ├── routes/                     REST endpoints, mounted under /api
│   ├── utils/                      ApiError, response format, date ranges
│   ├── seed.js                     Development-only sample data
│   ├── app.js                      Express app configuration
│   └── server.js                   Entry point
│
└── package.json                    Root scripts to run both apps together
```

## Installation & Local Development

### 1. Prerequisites

- Node.js 18+
- A MongoDB instance — either installed locally, or a free
  [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (see below)

### 2. Install dependencies

```bash
npm run install:all
```

(or individually: `npm install` at the root, then `cd client && npm install`, then `cd server && npm install`)

### 3. Configure environment variables

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

`server/.env`:

```env
MONGODB_URI=            # your MongoDB connection string
JWT_SECRET=              # long random string - never commit a real one
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

`client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Never commit real `.env` files — both are already git-ignored.

### 4. Run the app

```bash
npm run dev              # runs client + server together from the root
```

Or separately: `cd server && npm run dev` / `cd client && npm run dev`.

- Frontend: http://localhost:5173
- Backend health check: http://localhost:5000/api/health

### 5. (Optional) seed sample data

```bash
cd server && npm run seed
```

Creates `dev@example.com` / `DevPassword123!` with a sample course,
schedule, assignment, task, and prayer schedule. Refuses to run when
`NODE_ENV=production`.

## MongoDB Setup

### Local MongoDB

Install MongoDB Community Server and use:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/psos
```

### MongoDB Atlas (recommended for production)

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. **Database Access** → add a database user with a strong, generated password.
3. **Network Access** → add the IP address(es) that need to connect (your
   hosting platform's egress IPs, or `0.0.0.0/0` only if your platform
   requires it and you understand the tradeoff).
4. **Database** → Connect → "Drivers" → copy the connection string, e.g.
   `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/psos?retryWrites=true&w=majority`.
5. Set that string as `MONGODB_URI` in your production environment
   variables — never in source code.

## Production Build

```bash
cd client && npm run build     # outputs client/dist
```

`vite build` fails loudly on missing imports/broken code, so a clean
build is a real correctness check, not just a formality.

## Deployment

Recommended architecture:

```text
React (client/dist) → static hosting (Vercel/Netlify/Cloudflare Pages/similar)
                                    ↓  (VITE_API_URL)
Express API (server/) → Node hosting (Render/Railway/Fly.io/similar)
                                    ↓  (MONGODB_URI)
MongoDB Atlas
```

No URL is hardcoded anywhere in the source — both the frontend's API base
URL and the backend's allowed CORS origin come entirely from environment
variables, so the same code deploys to any hosting combination.

### Backend deployment

1. Deploy the `server/` directory to a Node.js host.
2. Set environment variables on the host: `MONGODB_URI`, `JWT_SECRET`,
   `PORT` (most platforms set this for you), `CLIENT_URL` (your deployed
   frontend's exact origin — CORS will reject anything else), `NODE_ENV=production`.
3. Start command: `npm start` (runs `node server.js`).

### Frontend deployment

1. Set `VITE_API_URL` in the hosting platform's environment variables to
   your deployed backend's URL, e.g. `https://your-api.example.com/api`.
2. Build command: `npm run build` (inside `client/`). Output directory: `dist`.
3. Configure the host to rewrite all routes to `index.html` (this is a
   single-page app using client-side routing).

## API Overview

All endpoints are mounted under `/api` and return the same envelope:

```json
{ "success": true, "message": "...", "data": {} }
{ "success": false, "message": "...", "error": null }
```

| Area | Endpoints |
|---|---|
| Health | `GET /health` |
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/logout` (rate-limited) |
| Profile | `GET /users/me`, `PATCH /users/me`, `PATCH /users/change-password` |
| Courses | `GET/POST /courses`, `GET/PATCH/DELETE /courses/:id` |
| Schedules | `GET/POST /schedules`, `GET/PATCH/DELETE /schedules/:id` |
| Study | `GET/POST /study`, `GET/PATCH/DELETE /study/:id` |
| Assignments | `GET/POST /assignments`, `GET/PATCH/DELETE /assignments/:id` |
| Tasks | `GET/POST /tasks`, `GET/PATCH/DELETE /tasks/:id` |
| Prayer | `GET/POST /prayer`, `GET/PATCH/DELETE /prayer/:id` |
| Coding | `GET/POST /coding`, `GET/PATCH/DELETE /coding/:id` |
| Weekly Review | `GET/POST /weekly-review`, `GET/PATCH/DELETE /weekly-review/:id` |
| Analytics | `GET /analytics/{dashboard,study,tasks,assignments,coding,courses,weekly}` |

Every route except `health`, `auth/register`, and `auth/login` requires
`Authorization: Bearer <token>` and returns only the authenticated
user's own data — cross-user access returns `404`, not `403`, so a
request never reveals whether a resource ID exists at all.

## Security Notes

- Passwords are hashed with bcrypt and never returned in any response
  (schema-level `select: false` plus an explicit `toJSON` strip).
- JWTs carry only a user ID, are signed with a secret from the
  environment, and expire (`JWT_EXPIRES_IN`).
- `helmet` sets standard security headers; `express-rate-limit` throttles
  the register/login endpoints against brute-force attempts.
- CORS is locked to the single configured `CLIENT_URL` — no wildcard.
- Every user-owned query is filtered by the authenticated user's ID at
  the service layer, not just checked after the fact.
- Login/register/profile inputs are validated to be actual strings
  before touching a database query, closing off NoSQL query-operator
  injection via a crafted JSON body.
- In production (`NODE_ENV=production`), unexpected server errors never
  leak their internal message or stack trace to the client — only the
  intentional, already-safe error paths (validation, not-found,
  duplicate-key, etc.) produce their specific message.
- `.env` files are git-ignored on both client and server; nothing secret
  is committed to source control.

## Current Status

All planned development steps are complete: project foundation, the full
MongoDB/Mongoose data layer, JWT authentication, university/timetable
management, study/assignments/tasks/prayer/coding tracking, dashboard +
analytics + weekly review, and this final integration/security/
production-readiness pass.
