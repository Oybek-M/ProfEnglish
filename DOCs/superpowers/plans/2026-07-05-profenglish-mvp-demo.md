# ProfEnglish Demo Day MVP — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a working web-app demo (IT + Business professions) with real AI-generated personalized lessons, live AI role-play chat, and live AI writing evaluation, deployable to the team's VPS without Docker, in time for Demo Day (2026-07-06).

**Architecture:** Single Node.js/Express backend (JSON-file storage, JWT auth, OpenRouter/gpt-4o-mini integration) serving a React+Vite+TypeScript+Tailwind SPA. No database, no Docker — PM2 + existing Nginx reverse proxy.

**Tech Stack:** Node.js 18+, Express, bcryptjs, jsonwebtoken, uuid, dotenv (backend); React 18, Vite, TypeScript, TailwindCSS, react-router-dom (frontend); OpenRouter API with `openai/gpt-4o-mini`.

**Note on testing:** Per the approved design doc (`DOCs/superpowers/specs/2026-07-05-profenglish-mvp-demo-design.md`), automated test suites are explicitly out of scope due to the 1-day timeline. Each task below is verified manually (curl commands / browser checks) instead of with unit tests. Task 19 is a full golden-path manual smoke test before the real demo.

---

## POST-MVP ENHANCEMENTS LOG (read this first if resuming a fresh session)

All 19 tasks above are complete, reviewed, and deployed-ready (see `DOCs/deploy/smoke-test-checklist.md` for the executed golden-path verification). After the original MVP was done, the founder reviewed it hands-on and requested further polish. This log tracks that follow-up work, updated incrementally (one entry per commit) so a fresh session can resume safely if this one is interrupted (context limit, disconnect, etc.) — **each entry below corresponds to one already-pushed commit on `origin/main`, in order.**

Standing rules for all follow-up work (same as the original 19 tasks): no `Co-Authored-By` trailer in any commit ever; all visible UI text in Uzbek Latin script; no new npm dependencies; TailwindCSS v3 + hand-written inline SVG only, no icon libraries.

### Round 1 — Landing/Login/Register redesign + honesty fixes
- `4ea9581` feat: redesign landing page (hero with coded AI-chat product-preview mockup, features, how-it-works, professions, pricing teaser, footer)
- `ceaa765` fix: translate remaining English pricing copy to Uzbek
- `f4d0860` feat: redesign login/register pages with polished card UI (gradient icon badge, icon-prefixed inputs) — deliberately NOT added: "Continue with Google" (no OAuth backend exists, would be a false promise)

### Round 2 — Onboarding + Dashboard UX overhaul (planned by an Opus sub-agent, see rationale in that plan if still present at `DOCs/superpowers/plans/` scratch location — otherwise this log is the source of truth)
- `b3b4731` feat: redesign dashboard — header with greeting+logout, stat cards (Bugun dars / Jami darslar / O'rtacha ball — **only rendered when real `progress.json` data exists, never fabricated**), lesson hero card (profession badge, duration, level, mission blurb), recent-progress list (score shown as `X/10`, matching `EvaluationResult.overallScore`'s real scale)
- `1d8794a` feat: onboarding UX — (1) explicit "← Bosh sahifa" link on Login/Register, (2) disabled "Ko'p kasb sohalari — tez kunda" 3rd card in profession step (signals roadmap without fabricating unbuilt professions), (3) self-assessment pre-test step (`preTestPhase: 'ask'|'confirm'|'test'` — purely a UX priming step, the 10-question test remains the sole source of truth for the persisted `level`, zero backend risk), (4) `targetLevel` (a1-c2) question added to the goal step, persisted via a new whitelisted backend field (`backend/routes/onboardingRoutes.js` `VALID_TARGET_LEVELS`, `frontend/src/types/index.ts` `User.targetLevel`) — additive only, not yet read by lesson generation
- `4980465` fix: Dashboard's date used `toLocaleDateString('uz-Latn-UZ', ...)` which the browser's ICU data doesn't fully support (rendered broken tokens like "M07 5, Sun") — replaced with a manual `UZ_WEEKDAYS`/`UZ_MONTHS` lookup + `formatUzDate()` helper for guaranteed-correct output regardless of browser locale support

### Round 3 — Professionalism polish
- `eb9fb1a` fix: replaced all colorful emoji icons (💻💼👋⏱➕🎉) with hand-drawn inline SVG icons across Dashboard/Onboarding/Result pages — founder's explicit feedback: emoji-as-icons read as unpolished/AI-generated to investors and partners. Kept plain typographic symbols (✓, ▸) on the landing page as-is since those don't carry the same "unprofessional" signal.
- `7fd2c4f` feat: optional profile fields (`firstName`/`lastName`/`gender`/`birthDate`, all nullable, NOT required at registration) + new `PATCH /api/auth/profile` endpoint (whitelisted validation: gender enum, birthDate age 10-100) + new `frontend/src/pages/ProfilePage.tsx` (`/profile` route, linked from Dashboard header via a "Profil" button next to "Chiqish") showing read-only account info (email/profession/level/goal/targetLevel) plus an editable form for the four new optional fields. Live-verified end-to-end (real browser, real save, real page-reload showing persisted values, all 4 fields confirmed in `backend/data/users.json`).
- `80fdd6e` feat: AI lesson plan visibility — Dashboard's lesson hero card now shows a real-data badge row (`lesson.vocabulary.length` so'z, `lesson.phrases.length` ibora, `lesson.exercises.length` mashq, roleplay + writing-eval labels) right under the mission blurb; `LessonPage.tsx`'s `info` block now shows a "Bu darsda nima bo'ladi" 4-item checklist (vocab/phrase counts, exercise count, `lesson.roleplayCharacter` by name, writing-eval mention) before the "Davom etish" button — all numbers pulled from the real generated `Lesson` object, nothing fabricated. Founder's rationale: makes visible that the AI is generating a genuine full personalized curriculum, not just a single generic screen. Live-verified in browser (Dashboard badges + Lesson info screen both checked against a real generated IT lesson, vocab block confirmed still renders correctly afterward — no regression).

### Round 3 status: all founder-requested items from this round are done.

### Round 4 — auth session bug fix
- `574b3ea` fix: **root cause found and fixed** for founder-reported bug "after logging in, going back to the home page and then logging in again is required." JWT/localStorage session itself was never actually lost — `LoginPage.tsx`/`RegisterPage.tsx` simply had no check for an already-authenticated user, so visiting `/login` or `/register` while a valid session existed unconditionally rendered the empty credentials form (looking exactly like a forced re-login). Fixed by adding the same `loading`/`user` guard pattern already used in `App.tsx`'s `PrivateRoute` to the top of both pages: if `loading`, show a loading state; if `user` already set, `<Navigate to="/dashboard" replace />` immediately. Live-verified: logged in → hard-navigated to `/` → clicked "Kirish" → landed directly on `/dashboard` (no form shown); same for `/register`; then cleared `localStorage` to simulate a real logged-out state and confirmed the login form still renders normally in that case (no regression).

### Round 5 — small navigation/copy polish
- `3149a11` fix: corrected wording on the landing page's "Har kuni o'rganing" feature card — "30 minutlik darslar" ("30 minute-ish lessons", awkward calque) → "30 daqiqalik darslar" (correct Uzbek for "30-minute lessons").
- `a7ad47a` feat: founder asked for a way back to the home page from the Dashboard too (Login/Register already had it from Round 4). Added a clickable "ProfEnglish" wordmark (same gradient-text style used on Login/Register) linking to `/`, placed above the "Xush kelibsiz!" greeting in the Dashboard header. Live-verified in browser (screenshot confirms placement/rendering) plus `tsc --noEmit` (0 errors) and `npm run build` (succeeded).

### Round 6 — real production deploy + user data cleanup
- Cleaned `backend/data/users.json` and `progress.json` (gitignored, not committed, so no commit SHA for this step): removed 15 leftover test/smoke-test accounts (`smoketest1@example.com`, `prodtest1@example.com`, `visualcheck@example.com`, `flowcheck1@example.com`, and various `test_*@example.com`), keeping only the founder's real account (`oybek@gmail.com`) and the two pre-built demo accounts (`demo.it@profenglish.uz`, `demo.biznes@profenglish.uz`) per founder's explicit instruction. `lessons-cache.json` left untouched (keyed by `profession_level_goal`, not user-specific).
- `<uncommitted>` docs: updated `DOCs/deploy/deploy-steps.md` with the real production state (VPS `109.199.108.248`, domain `profenglish.ibos.uz`, path `/var/www/profenglish`, PM2 + certbot details, SSH deploy-key note) and `DOCs/deploy/nginx-profenglish.conf` with the real domain filled in (was previously a `SIZNING-DOMENINGIZ.uz` placeholder template).
- **Deployed live** at `https://profenglish.ibos.uz` on the shared Contabo VPS (same host as other client projects like `ibos_crm`, `SmartCrm`). Bootstrapped a dedicated SSH deploy key (`profenglish_deploy_ed25519`) using the founder-supplied one-time root password (used exactly once to install the key, never stored or reused). Cloned repo, installed backend deps, built frontend, installed PM2 globally, started via existing `ecosystem.config.js`, `pm2 save` + `pm2 startup` for reboot persistence, added Nginx reverse-proxy config for the real domain, obtained Let's Encrypt SSL via `certbot --nginx` (expires 2026-10-03, auto-renews). Live-verified: `https://profenglish.ibos.uz` returns 200, `/api/health` returns `{"status":"ok"}`, and a real login against `demo.it@profenglish.uz` returns a valid JWT.
- `e8a9ef5` docs: added `DOCs/qollanma/ProfEnglish_Qollanma.pdf` — a short, non-technical (no code/API jargon) step-by-step usage guide in Uzbek for the founder to hand to the idea owner/partner, generated via reportlab and visually verified by rendering to PNG before sending. Deliberately excludes the live URL and demo account credentials (founder sends those separately) so the PDF itself carries no secrets if forwarded.

### Round 7 — domain migration: profenglish.ibos.uz → profenglish.uz
- Founder bought a standalone `.uz` domain (`profenglish.uz`, via ahost) to replace the temporary `profenglish.ibos.uz` subdomain used in Round 6, and asked for a full migration before the old subdomain spread further — no redirect kept, old subdomain fully retired.
- **DNS troubleshooting:** initial nameserver delegation at the `.uz` registry pointed to the wrong ahost nameservers (`dns1/dns2.ahost.uz`, `ns1/ns2.ahost.cloud` — servers that returned REFUSED for the zone), while the actual DNS records were configured on `rdns1/rdns2.ahost.uz` (confirmed working when queried directly, and matching what the already-working `ibos.uz` domain uses). Diagnosed via direct `dig` queries against the `.uz` TLD servers (`ns1.uz`–`ns8.uz`) from the VPS, comparing against a known-good domain on the same registrar. Founder corrected the nameservers in the ahost panel to `rdns1/rdns2/rdns3.ahost.uz`; registry confirmed the change via an official ccTLD.UZ email. Registry propagation to all 8 public `.uz` TLD servers took roughly 1.5 hours.
- **Deployed:** new Nginx server block for `profenglish.uz` + `www.profenglish.uz` (same backend, `localhost:5001`, no code changes), new Let's Encrypt SSL cert via `certbot --nginx -d profenglish.uz -d www.profenglish.uz` (expires 2026-10-11, auto-renews). Old `profenglish.ibos.uz` Nginx config and its now-unused Let's Encrypt cert were both fully removed (`certbot delete --cert-name profenglish.ibos.uz`) — no redirect kept, per founder's explicit instruction.
- Live-verified: `https://profenglish.uz` and `https://www.profenglish.uz` both return 200, `/api/health` returns `{"status":"ok"}`, and a real login against `demo.it@profenglish.uz` returns a valid JWT.
- Updated `DOCs/deploy/deploy-steps.md` ("Real production holati" section) and `DOCs/deploy/nginx-profenglish.conf` (`server_name`) to reflect `profenglish.uz` as the canonical domain.

---

## Task 1: Backend skeleton

**Files:**
- Create: `backend/package.json`
- Create: `backend/config.js`
- Create: `backend/server.js`

- [ ] **Step 1: Check Node version**

Run: `node -v`
Expected: `v18.x.x` or higher. If lower, stop and report — fetch() and other features require Node 18+.

- [ ] **Step 2: Create backend folder and package.json**

```bash
mkdir -p "backend"
cd backend
npm init -y
npm install express bcryptjs jsonwebtoken dotenv uuid
```

Then replace the generated `backend/package.json` `scripts` section with:

```json
"scripts": {
  "start": "node server.js",
  "dev": "node server.js"
}
```

Add at the top level of `package.json`: `"engines": { "node": ">=18" }`.

- [ ] **Step 3: Create `backend/config.js`**

```js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5001,
  openRouterApiKey: process.env.OPENROUTER_API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  openRouterModel: 'openai/gpt-4o-mini',
};
```

- [ ] **Step 4: Create minimal `backend/server.js`**

```js
const express = require('express');
const config = require('./config');

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(config.port, () => {
  console.log(`ProfEnglish backend ${config.port}-portda ishga tushdi`);
});
```

- [ ] **Step 5: Verify**

Run: `cd backend && node server.js` (server should print the startup message and stay running)
In another terminal: `curl http://localhost:5001/api/health`
Expected: `{"status":"ok"}`
Stop the server (Ctrl+C) before continuing.

- [ ] **Step 6: Commit**

```bash
git add backend/package.json backend/package-lock.json backend/config.js backend/server.js
git commit -m "feat: backend skeleton with health check"
```

---

## Task 2: Frontend skeleton

**Files:**
- Create: `frontend/` (via Vite scaffold)
- Modify: `frontend/vite.config.ts`
- Modify: `frontend/tailwind.config.js`
- Modify: `frontend/src/index.css`
- Create: `frontend/postcss.config.js` (via tailwind init)

- [ ] **Step 1: Scaffold Vite React+TS project**

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- [ ] **Step 2: Configure Tailwind — replace `frontend/tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
};
```

- [ ] **Step 3: Replace `frontend/src/index.css` contents entirely**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 4: Configure dev proxy — replace `frontend/vite.config.ts`**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5001',
    },
  },
});
```

- [ ] **Step 5: Verify dev server starts**

Run: `cd frontend && npm run dev`
Expected: Vite prints a local URL (e.g. `http://localhost:5173`). Open it in a browser — default Vite+React starter page should render with no console errors.
Stop the server (Ctrl+C) before continuing.

- [ ] **Step 6: Commit**

```bash
git add frontend/
git commit -m "feat: frontend skeleton (Vite+React+TS+Tailwind)"
```

---

## Task 3: Backend JSON data store

**Files:**
- Create: `backend/data/store.js`

- [ ] **Step 1: Create `backend/data/store.js`**

```js
const fs = require('fs');
const path = require('path');

const DATA_DIR = __dirname;

function ensureFile(filename, defaultValue) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
  }
  return filePath;
}

function readJson(filename, defaultValue) {
  const filePath = ensureFile(filename, defaultValue);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function writeJson(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = { readJson, writeJson };
```

- [ ] **Step 2: Verify with a quick node check**

Run:
```bash
cd backend
node -e "const s = require('./data/store'); s.writeJson('test.json', {hello: 'world'}); console.log(s.readJson('test.json', {}));"
```
Expected: `{ hello: 'world' }` printed, and `backend/data/test.json` created.

Then delete the test file: `rm backend/data/test.json`

- [ ] **Step 3: Commit**

```bash
git add backend/data/store.js
git commit -m "feat: JSON file data store helper"
```

---

## Task 4: Auth (register/login/JWT)

**Files:**
- Create: `backend/auth/auth.js`
- Create: `backend/routes/authRoutes.js`
- Modify: `backend/server.js`

- [ ] **Step 1: Create `backend/auth/auth.js`**

```js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { readJson, writeJson } = require('../data/store');
const config = require('../config');

const USERS_FILE = 'users.json';

function getUsers() {
  return readJson(USERS_FILE, []);
}

function saveUsers(users) {
  writeJson(USERS_FILE, users);
}

async function registerUser(email, password) {
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    throw new Error('EMAIL_TAKEN');
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: uuidv4(),
    email,
    passwordHash,
    profession: null,
    level: null,
    goal: null,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  return user;
}

async function loginUser(email, password) {
  const users = getUsers();
  const user = users.find((u) => u.email === email);
  if (!user) throw new Error('INVALID_CREDENTIALS');
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error('INVALID_CREDENTIALS');
  return user;
}

function updateUser(userId, updates) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) throw new Error('USER_NOT_FOUND');
  users[idx] = { ...users[idx], ...updates };
  saveUsers(users);
  return users[idx];
}

function getUserById(userId) {
  const users = getUsers();
  return users.find((u) => u.id === userId);
}

function signToken(user) {
  return jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '7d' });
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'NO_TOKEN' });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const user = getUserById(payload.userId);
    if (!user) return res.status(401).json({ error: 'USER_NOT_FOUND' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'INVALID_TOKEN' });
  }
}

function publicUser(user) {
  const { passwordHash, ...rest } = user;
  return rest;
}

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  getUserById,
  signToken,
  requireAuth,
  publicUser,
};
```

- [ ] **Step 2: Create `backend/routes/authRoutes.js`**

```js
const express = require('express');
const { registerUser, loginUser, signToken, publicUser } = require('../auth/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || password.length < 6) {
    return res.status(400).json({ error: 'INVALID_INPUT' });
  }
  try {
    const user = await registerUser(email, password);
    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    if (err.message === 'EMAIL_TAKEN') {
      return res.status(409).json({ error: 'EMAIL_TAKEN' });
    }
    res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await loginUser(email, password);
    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    res.status(401).json({ error: 'INVALID_CREDENTIALS' });
  }
});

module.exports = router;
```

- [ ] **Step 3: Mount routes in `backend/server.js`** — add near the top (after `app.use(express.json())`) and before the health route:

```js
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
```

- [ ] **Step 4: Ensure `.env` has a JWT secret**

Confirm `backend/.env` (or project-root `.env`, per your setup) contains `JWT_SECRET=<random-value>`. This was already generated during the brainstorming phase — verify it's non-empty:

Run: `grep JWT_SECRET .env` (from project root)
Expected: a long hex string after `=`.

If `backend/.env` doesn't exist separately, symlink is unnecessary — just make sure `dotenv` in `config.js` loads from the project root `.env` (default `dotenv` behavior loads `.env` from the current working directory, so always run the backend from `backend/` with a `.env` file present there, or copy the root `.env` into `backend/.env`). Copy it now:

```bash
cp .env backend/.env
```

- [ ] **Step 5: Verify**

```bash
cd backend && node server.js
```
In another terminal:
```bash
curl -X POST http://localhost:5001/api/auth/register -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}'
```
Expected: JSON with `token` and `user` (no `passwordHash` field).

```bash
curl -X POST http://localhost:5001/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}'
```
Expected: JSON with `token` and `user`.

Delete `backend/data/users.json` afterward to reset test data: `rm backend/data/users.json`
Stop the server.

- [ ] **Step 6: Commit**

```bash
git add backend/auth/auth.js backend/routes/authRoutes.js backend/server.js
git commit -m "feat: email+password auth with JWT"
```

---

## Task 5: Level test content + onboarding routes

**Files:**
- Create: `backend/content/levelTestQuestions.js`
- Create: `backend/routes/onboardingRoutes.js`
- Modify: `backend/server.js`

- [ ] **Step 1: Create `backend/content/levelTestQuestions.js`**

```js
const LEVEL_TEST_QUESTIONS = [
  { id: 1, question: 'She ___ to school every day.', options: ['go', 'goes', 'going', 'gone'], correctIndex: 1 },
  { id: 2, question: 'I have lived here ___ 2015.', options: ['since', 'for', 'from', 'at'], correctIndex: 0 },
  { id: 3, question: 'If I ___ more time, I would learn French.', options: ['have', 'had', 'has', 'will have'], correctIndex: 1 },
  { id: 4, question: 'By next year, she ___ her degree.', options: ['will complete', 'will have completed', 'completes', 'completed'], correctIndex: 1 },
  { id: 5, question: 'Choose the closest synonym for "significant":', options: ['small', 'important', 'quick', 'rare'], correctIndex: 1 },
  { id: 6, question: 'He is the man ___ car was stolen.', options: ['who', 'which', 'whose', 'whom'], correctIndex: 2 },
  { id: 7, question: 'Neither the manager nor the employees ___ aware of the change.', options: ['was', 'were', 'is', 'has'], correctIndex: 1 },
  { id: 8, question: 'Choose the word closest in meaning to "meticulous":', options: ['careless', 'careful', 'fast', 'lazy'], correctIndex: 1 },
  { id: 9, question: 'Had I known about the meeting, I ___ attended.', options: ['would', 'will', 'would have', 'had'], correctIndex: 2 },
  { id: 10, question: 'Choose the correct passive form of "They are building a new office.":', options: ['A new office is built by them', 'A new office is being built by them', 'A new office was being built', 'A new office has built'], correctIndex: 1 },
];

function scoreToLevel(score) {
  if (score <= 2) return 'A1';
  if (score <= 4) return 'A2';
  if (score <= 6) return 'B1';
  if (score <= 8) return 'B2';
  return 'C1';
}

function calculateLevel(answerIndexes) {
  let score = 0;
  LEVEL_TEST_QUESTIONS.forEach((q, i) => {
    if (answerIndexes[i] === q.correctIndex) score += 1;
  });
  return { score, level: scoreToLevel(score) };
}

function publicQuestions() {
  return LEVEL_TEST_QUESTIONS.map(({ id, question, options }) => ({ id, question, options }));
}

module.exports = { LEVEL_TEST_QUESTIONS, calculateLevel, publicQuestions };
```

- [ ] **Step 2: Create `backend/routes/onboardingRoutes.js`**

```js
const express = require('express');
const { requireAuth, updateUser, publicUser } = require('../auth/auth');
const { publicQuestions, calculateLevel } = require('../content/levelTestQuestions');

const router = express.Router();

router.get('/level-test', (req, res) => {
  res.json({ questions: publicQuestions() });
});

router.post('/complete', requireAuth, (req, res) => {
  const { profession, answerIndexes, goal } = req.body;
  if (!['it', 'business'].includes(profession)) {
    return res.status(400).json({ error: 'INVALID_PROFESSION' });
  }
  if (!Array.isArray(answerIndexes) || answerIndexes.length !== 10) {
    return res.status(400).json({ error: 'INVALID_ANSWERS' });
  }
  if (!goal) {
    return res.status(400).json({ error: 'INVALID_GOAL' });
  }
  const { level, score } = calculateLevel(answerIndexes);
  const user = updateUser(req.user.id, { profession, level, goal });
  res.json({ user: publicUser(user), levelTestScore: score });
});

module.exports = router;
```

- [ ] **Step 3: Mount in `backend/server.js`**

```js
const onboardingRoutes = require('./routes/onboardingRoutes');
app.use('/api/onboarding', onboardingRoutes);
```

- [ ] **Step 4: Verify**

```bash
cd backend && node server.js
```
```bash
curl http://localhost:5001/api/onboarding/level-test
```
Expected: JSON with 10 `questions`, each with `id`, `question`, `options` (no `correctIndex` leaked).

Register a user, grab the `token`, then:
```bash
curl -X POST http://localhost:5001/api/onboarding/complete \
  -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" \
  -d '{"profession":"it","answerIndexes":[1,0,1,1,1,2,1,1,2,1],"goal":"job"}'
```
Expected: `{"user":{...,"profession":"it","level":"C1",...},"levelTestScore":10}`

Reset test data: `rm backend/data/users.json`. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add backend/content/levelTestQuestions.js backend/routes/onboardingRoutes.js backend/server.js
git commit -m "feat: level test content and onboarding completion endpoint"
```

---

## Task 6: OpenRouter client wrapper

**Files:**
- Create: `backend/ai/openrouter.js`

- [ ] **Step 1: Create `backend/ai/openrouter.js`**

```js
const config = require('../config');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function callOpenRouter({ messages, jsonMode = false, maxTokens = 2000, temperature = 0.7 }) {
  const body = {
    model: config.openRouterModel,
    messages,
    max_tokens: maxTokens,
    temperature,
  };
  if (jsonMode) {
    body.response_format = { type: 'json_object' };
  }

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.openRouterApiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OPENROUTER_ERROR_${response.status}: ${text}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

module.exports = { callOpenRouter };
```

- [ ] **Step 2: Verify with a real API call**

```bash
cd backend
node -e "
require('./config');
const { callOpenRouter } = require('./ai/openrouter');
callOpenRouter({ messages: [{ role: 'user', content: 'Say OK in one word.' }], maxTokens: 10 })
  .then(r => console.log('RESPONSE:', r))
  .catch(e => console.error('ERROR:', e.message));
"
```
Expected: `RESPONSE: OK` (or similar single-word reply) — confirms the OpenRouter API key and model work end-to-end.

- [ ] **Step 3: Commit**

```bash
git add backend/ai/openrouter.js
git commit -m "feat: OpenRouter API client wrapper"
```

---

## Task 7: Lesson prompt builder + generation service + routes

**Files:**
- Create: `backend/ai/lessonPrompt.js`
- Create: `backend/ai/lessonService.js`
- Create: `backend/routes/lessonRoutes.js`
- Modify: `backend/server.js`

- [ ] **Step 1: Create `backend/ai/lessonPrompt.js`**

```js
const PROFESSION_LABELS = {
  it: 'IT / Dasturlash',
  business: 'Business',
};

const GOAL_LABELS = {
  job: 'ishga kirish',
  clients: 'xalqaro mijozlar bilan ishlash',
  ielts: 'IELTS/imtihon',
  career: "karyera o'sishi",
};

function buildLessonMessages(profession, level, goal) {
  const professionLabel = PROFESSION_LABELS[profession] || profession;
  const goalLabel = GOAL_LABELS[goal] || goal;

  const systemPrompt = `Sen ProfEnglish platformasi uchun ishlaydigan professional ingliz tili metodisti va Instructional Designersan.
Sening vazifang — foydalanuvchining kasbiy faoliyatida ingliz tilidan foydalanish ko'nikmasini rivojlantiradigan interaktiv, vazifaga asoslangan (task-based) dars yaratish.
Asosiy tamoyil: dars yakunida foydalanuvchi bitta aniq kasbiy vazifani ingliz tilida mustaqil bajara olishi kerak. Dars grammatikaga emas, real ish jarayoni va amaliy muloqotga asoslanadi.
Til darajasi (${level}) butun dars davomida izchil saqlanishi kerak.
Har bir dars real ish hayotidagi vaziyatga asoslangan bo'lishi shart — mavhum yoki umumiy mavzular berilmasin.

Javobni FAQAT quyidagi JSON strukturasida qaytar, boshqa hech qanday matn qo'shma:
{
  "title": "string",
  "durationMinutes": number,
  "goalSentence": "string (1 jumla, darsning maqsadi)",
  "skill": "string (rivojlantiriladigan aniq kasbiy ko'nikma)",
  "mission": "string (foydalanuvchiga beriladigan real vazifa, 1-2 jumla)",
  "scenario": "string (ish muhiti tasviri, 3-5 jumla)",
  "vocabulary": [ { "word": "string", "meaningUz": "string", "transcription": "string", "example": "string" } ],
  "phrases": [ { "phrase": "string", "usage": "string" } ],
  "conversationSequence": ["string"],
  "exercises": [ { "type": "multiple_choice", "question": "string", "options": ["string"], "correctAnswer": "string" } ],
  "roleplayCharacter": "string",
  "roleplayOpeningLine": "string",
  "finalTaskPrompt": "string",
  "reviewWords": ["string"],
  "reviewPhrases": ["string"]
}

Talablar: "vocabulary" massivida 10-15 element, "phrases" massivida 8-10 element, "exercises" massivida aynan 5 element (barchasi "type": "multiple_choice", har birida aynan 4 ta "options" va "correctAnswer" "options" ichidagi biriga so'zma-so'z mos kelishi shart), "reviewWords" 5-8 element, "reviewPhrases" 3-5 element.`;

  const userPrompt = `Kasb: ${professionLabel}
Til darajasi: ${level}
Foydalanuvchi maqsadi: ${goalLabel}
Shu parametrlar asosida bitta to'liq dars generatsiya qil.`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];
}

module.exports = { buildLessonMessages, PROFESSION_LABELS, GOAL_LABELS };
```

- [ ] **Step 2: Create `backend/ai/lessonService.js`**

```js
const { readJson, writeJson } = require('../data/store');
const { callOpenRouter } = require('./openrouter');
const { buildLessonMessages } = require('./lessonPrompt');

const CACHE_FILE = 'lessons-cache.json';

function cacheKey(profession, level, goal) {
  return `${profession}_${level}_${goal}`;
}

async function getOrGenerateLesson(profession, level, goal) {
  const key = cacheKey(profession, level, goal);
  const cache = readJson(CACHE_FILE, {});

  if (cache[key]) {
    return { ...cache[key].lesson, cacheKey: key };
  }

  const messages = buildLessonMessages(profession, level, goal);
  const raw = await callOpenRouter({ messages, jsonMode: true, maxTokens: 3000, temperature: 0.6 });

  let lesson;
  try {
    lesson = JSON.parse(raw);
  } catch (err) {
    throw new Error('AI_INVALID_JSON');
  }

  cache[key] = { generatedAt: new Date().toISOString(), lesson };
  writeJson(CACHE_FILE, cache);

  return { ...lesson, cacheKey: key };
}

module.exports = { getOrGenerateLesson, cacheKey };
```

- [ ] **Step 3: Create `backend/routes/lessonRoutes.js`**

```js
const express = require('express');
const { requireAuth } = require('../auth/auth');
const { getOrGenerateLesson } = require('../ai/lessonService');

const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {
  const { profession, level, goal } = req.user;
  if (!profession || !level || !goal) {
    return res.status(400).json({ error: 'ONBOARDING_INCOMPLETE' });
  }
  try {
    const lesson = await getOrGenerateLesson(profession, level, goal);
    res.json({ lesson });
  } catch (err) {
    res.status(502).json({ error: 'LESSON_GENERATION_FAILED', detail: err.message });
  }
});

module.exports = router;
```

- [ ] **Step 4: Mount in `backend/server.js`**

```js
const lessonRoutes = require('./routes/lessonRoutes');
app.use('/api/lesson', lessonRoutes);
```

- [ ] **Step 5: Verify (this makes a real, billed AI call)**

```bash
cd backend && node server.js
```
Register+login a user, complete onboarding (as in Task 5's verify step) with `profession: "it"`, then:
```bash
curl http://localhost:5001/api/lesson/current -H "Authorization: Bearer <TOKEN>"
```
Expected: JSON `{"lesson": {"title": ..., "vocabulary": [...15 items...], "exercises": [...5 items...], ...}}`. Call it a second time — response should return instantly (from `backend/data/lessons-cache.json`, no new AI call).

Reset test data: `rm backend/data/users.json backend/data/lessons-cache.json`. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add backend/ai/lessonPrompt.js backend/ai/lessonService.js backend/routes/lessonRoutes.js backend/server.js
git commit -m "feat: AI lesson generation with caching"
```

---

## Task 8: Role-play chat service + routes

**Files:**
- Create: `backend/ai/chatService.js`
- Create: `backend/routes/chatRoutes.js`
- Modify: `backend/server.js`

- [ ] **Step 1: Create `backend/ai/chatService.js`**

```js
const { callOpenRouter } = require('./openrouter');

async function getRoleplayReply(lesson, level, history, userMessage) {
  const systemPrompt = `Sen ${level} darajadagi ingliz tili o'quvchisi bilan rol-o'yin (role-play) suhbat qurayotgan "${lesson.roleplayCharacter}" xarakteridasan.
Vaziyat: ${lesson.scenario}
Faqat inglizcha javob ber, ${level} darajasiga mos oddiy va tushunarli so'zlar ishlat.
Suhbatni tabiiy davom ettir, foydalanuvchi xato qilsa muloyimlik bilan tushuntir, lekin xarakteringdan chiqma.
Javobing 1-3 jumladan oshmasin.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map((h) => ({ role: h.role, content: h.content })),
    { role: 'user', content: userMessage },
  ];

  const reply = await callOpenRouter({ messages, jsonMode: false, maxTokens: 300, temperature: 0.8 });
  return reply;
}

module.exports = { getRoleplayReply };
```

- [ ] **Step 2: Create `backend/routes/chatRoutes.js`**

```js
const express = require('express');
const { requireAuth } = require('../auth/auth');
const { readJson } = require('../data/store');
const { getRoleplayReply } = require('../ai/chatService');

const router = express.Router();

router.post('/message', requireAuth, async (req, res) => {
  const { cacheKey, history, message } = req.body;
  if (!cacheKey || !message) {
    return res.status(400).json({ error: 'INVALID_INPUT' });
  }
  const cache = readJson('lessons-cache.json', {});
  const entry = cache[cacheKey];
  if (!entry) return res.status(404).json({ error: 'LESSON_NOT_FOUND' });

  try {
    const reply = await getRoleplayReply(entry.lesson, req.user.level, history || [], message);
    res.json({ reply });
  } catch (err) {
    res.status(502).json({ error: 'CHAT_FAILED', detail: err.message });
  }
});

module.exports = router;
```

- [ ] **Step 3: Mount in `backend/server.js`**

```js
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);
```

- [ ] **Step 4: Verify**

Using a `cacheKey` from Task 7's verify step (e.g. `it_C1_job`) and a valid token:
```bash
curl -X POST http://localhost:5001/api/chat/message \
  -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" \
  -d '{"cacheKey":"it_C1_job","history":[],"message":"Hello, nice to meet you."}'
```
Expected: `{"reply": "<in-character English reply>"}`

- [ ] **Step 5: Commit**

```bash
git add backend/ai/chatService.js backend/routes/chatRoutes.js backend/server.js
git commit -m "feat: AI role-play chat endpoint"
```

---

## Task 9: Evaluation service + routes + progress

**Files:**
- Create: `backend/ai/evaluationService.js`
- Create: `backend/routes/evaluationRoutes.js`
- Modify: `backend/server.js`

- [ ] **Step 1: Create `backend/ai/evaluationService.js`**

```js
const { callOpenRouter } = require('./openrouter');

async function evaluateFinalAnswer(lesson, level, finalAnswer) {
  const systemPrompt = `Sen tajribali ingliz tili baholovchisisan. Foydalanuvchining quyidagi yakuniy yozma javobini baho.
Vaziyat: ${lesson.finalTaskPrompt}
Til darajasi: ${level}

Javobni FAQAT quyidagi JSON formatda qaytar:
{
  "scores": {
    "vocabulary": number,
    "grammar": number,
    "fluency": number,
    "professionalPhrases": number,
    "communicationQuality": number,
    "confidence": number
  },
  "overallScore": number,
  "feedbackUz": "string"
}
Har bir ball 1 dan 10 gacha butun son bo'lsin. "feedbackUz" o'zbek tilida, 2-4 jumlali qisqa va aniq tavsiya bo'lsin.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: finalAnswer },
  ];

  const raw = await callOpenRouter({ messages, jsonMode: true, maxTokens: 500, temperature: 0.4 });
  return JSON.parse(raw);
}

module.exports = { evaluateFinalAnswer };
```

- [ ] **Step 2: Create `backend/routes/evaluationRoutes.js`**

```js
const express = require('express');
const { requireAuth } = require('../auth/auth');
const { readJson, writeJson } = require('../data/store');
const { evaluateFinalAnswer } = require('../ai/evaluationService');

const router = express.Router();

router.post('/submit', requireAuth, async (req, res) => {
  const { cacheKey, finalAnswer } = req.body;
  if (!cacheKey || !finalAnswer) {
    return res.status(400).json({ error: 'INVALID_INPUT' });
  }
  const lessonCache = readJson('lessons-cache.json', {});
  const entry = lessonCache[cacheKey];
  if (!entry) return res.status(404).json({ error: 'LESSON_NOT_FOUND' });

  try {
    const evaluation = await evaluateFinalAnswer(entry.lesson, req.user.level, finalAnswer);

    const progress = readJson('progress.json', []);
    progress.push({
      userId: req.user.id,
      lessonKey: cacheKey,
      finalAnswer,
      evaluation,
      completedAt: new Date().toISOString(),
    });
    writeJson('progress.json', progress);

    res.json({ evaluation });
  } catch (err) {
    res.status(502).json({ error: 'EVALUATION_FAILED', detail: err.message });
  }
});

router.get('/my-progress', requireAuth, (req, res) => {
  const progress = readJson('progress.json', []);
  const mine = progress.filter((p) => p.userId === req.user.id);
  res.json({ progress: mine });
});

module.exports = router;
```

- [ ] **Step 3: Mount in `backend/server.js`**

```js
const evaluationRoutes = require('./routes/evaluationRoutes');
app.use('/api/evaluation', evaluationRoutes);
```

- [ ] **Step 4: Verify**

```bash
curl -X POST http://localhost:5001/api/evaluation/submit \
  -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" \
  -d '{"cacheKey":"it_C1_job","finalAnswer":"I would like to schedule a meeting to discuss the project requirements with the client next week."}'
```
Expected: `{"evaluation": {"scores": {...6 numeric fields...}, "overallScore": <number>, "feedbackUz": "<Uzbek text>"}}`

```bash
curl http://localhost:5001/api/evaluation/my-progress -H "Authorization: Bearer <TOKEN>"
```
Expected: array with the one progress entry just submitted.

- [ ] **Step 5: Commit**

```bash
git add backend/ai/evaluationService.js backend/routes/evaluationRoutes.js backend/server.js
git commit -m "feat: AI writing evaluation + progress tracking"
```

---

## Task 10: Final backend wiring + static serving

**Files:**
- Modify: `backend/server.js`

- [ ] **Step 1: Rewrite `backend/server.js` to its final form**

```js
const express = require('express');
const path = require('path');
const config = require('./config');
const authRoutes = require('./routes/authRoutes');
const onboardingRoutes = require('./routes/onboardingRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const chatRoutes = require('./routes/chatRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/lesson', lessonRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/evaluation', evaluationRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

app.listen(config.port, () => {
  console.log(`ProfEnglish backend ${config.port}-portda ishga tushdi`);
});
```

- [ ] **Step 2: Verify it still boots (frontend/dist won't exist yet, that's expected until Task 17)**

```bash
cd backend && node server.js
curl http://localhost:5001/api/health
```
Expected: `{"status":"ok"}`. Stop the server.

- [ ] **Step 3: Commit**

```bash
git add backend/server.js
git commit -m "feat: wire all backend routes + serve frontend build"
```

---

## Task 11: Frontend types + API client + AuthContext

**Files:**
- Create: `frontend/src/types/index.ts`
- Create: `frontend/src/api/client.ts`
- Create: `frontend/src/context/AuthContext.tsx`

- [ ] **Step 1: Create `frontend/src/types/index.ts`**

```ts
export interface User {
  id: string;
  email: string;
  profession: 'it' | 'business' | null;
  level: string | null;
  goal: string | null;
  createdAt: string;
}

export interface VocabularyItem {
  word: string;
  meaningUz: string;
  transcription: string;
  example: string;
}

export interface PhraseItem {
  phrase: string;
  usage: string;
}

export interface Exercise {
  type: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Lesson {
  cacheKey: string;
  title: string;
  durationMinutes: number;
  goalSentence: string;
  skill: string;
  mission: string;
  scenario: string;
  vocabulary: VocabularyItem[];
  phrases: PhraseItem[];
  conversationSequence: string[];
  exercises: Exercise[];
  roleplayCharacter: string;
  roleplayOpeningLine: string;
  finalTaskPrompt: string;
  reviewWords: string[];
  reviewPhrases: string[];
}

export interface EvaluationResult {
  scores: {
    vocabulary: number;
    grammar: number;
    fluency: number;
    professionalPhrases: number;
    communicationQuality: number;
    confidence: number;
  };
  overallScore: number;
  feedbackUz: string;
}

export interface LevelTestQuestion {
  id: number;
  question: string;
  options: string[];
}
```

- [ ] **Step 2: Create `frontend/src/api/client.ts`**

```ts
const TOKEN_KEY = 'profenglish_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'REQUEST_FAILED');
  }
  return data as T;
}

export const api = {
  register: (email: string, password: string) =>
    request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  login: (email: string, password: string) =>
    request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  getLevelTest: () => request<{ questions: any[] }>('/onboarding/level-test'),
  completeOnboarding: (profession: string, answerIndexes: number[], goal: string) =>
    request<{ user: any; levelTestScore: number }>('/onboarding/complete', {
      method: 'POST',
      body: JSON.stringify({ profession, answerIndexes, goal }),
    }),
  getCurrentLesson: () => request<{ lesson: any }>('/lesson/current'),
  sendChatMessage: (cacheKey: string, history: any[], message: string) =>
    request<{ reply: string }>('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ cacheKey, history, message }),
    }),
  submitEvaluation: (cacheKey: string, finalAnswer: string) =>
    request<{ evaluation: any }>('/evaluation/submit', {
      method: 'POST',
      body: JSON.stringify({ cacheKey, finalAnswer }),
    }),
};
```

- [ ] **Step 3: Create `frontend/src/context/AuthContext.tsx`**

```tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, getToken, setToken, clearToken } from '../api/client';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('profenglish_user');
    if (getToken() && stored) {
      setUserState(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  function persistUser(u: User) {
    setUserState(u);
    localStorage.setItem('profenglish_user', JSON.stringify(u));
  }

  async function login(email: string, password: string) {
    const { token, user: u } = await api.login(email, password);
    setToken(token);
    persistUser(u);
  }

  async function register(email: string, password: string) {
    const { token, user: u } = await api.register(email, password);
    setToken(token);
    persistUser(u);
  }

  function logout() {
    clearToken();
    localStorage.removeItem('profenglish_user');
    setUserState(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser: persistUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `cd frontend && npx tsc --noEmit`
Expected: no errors related to the new files (pre-existing Vite template errors, if any, are unrelated — but there should be none).

- [ ] **Step 5: Commit**

```bash
git add frontend/src/types/index.ts frontend/src/api/client.ts frontend/src/context/AuthContext.tsx
git commit -m "feat: frontend types, API client, auth context"
```

---

## Task 12: Router + Landing/Login/Register pages

**Files:**
- Modify: `frontend/src/main.tsx`
- Modify: `frontend/src/App.tsx`
- Create: `frontend/src/pages/LandingPage.tsx`
- Create: `frontend/src/pages/LoginPage.tsx`
- Create: `frontend/src/pages/RegisterPage.tsx`

- [ ] **Step 1: Replace `frontend/src/main.tsx` entirely**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

- [ ] **Step 2: Create `frontend/src/pages/LandingPage.tsx`**

```tsx
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold text-indigo-700 mb-4">ProfEnglish</h1>
      <p className="text-lg text-gray-600 max-w-xl mb-8">
        Kasbingizga mos ingliz tilini sun'iy intellekt yordamida shaxsiylashtirilgan tarzda o'rganing.
      </p>
      <Link
        to="/register"
        className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
      >
        Bepul boshlash
      </Link>
    </div>
  );
}
```

- [ ] **Step 3: Create `frontend/src/pages/LoginPage.tsx`**

```tsx
import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError("Email yoki parol noto'g'ri");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Kirish</h2>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-4"
          required
        />
        <input
          type="password"
          placeholder="Parol"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-6"
          required
        />
        <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700">
          Kirish
        </button>
        <p className="text-sm text-center mt-4">
          Akkount yo'qmi? <Link to="/register" className="text-indigo-600">Ro'yxatdan o'tish</Link>
        </p>
      </form>
    </div>
  );
}
```

- [ ] **Step 4: Create `frontend/src/pages/RegisterPage.tsx`**

```tsx
import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await register(email, password);
      navigate('/onboarding');
    } catch (err) {
      setError("Ro'yxatdan o'tishda xatolik (email band bo'lishi mumkin)");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Ro'yxatdan o'tish</h2>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-4"
          required
        />
        <input
          type="password"
          placeholder="Parol (kamida 6 belgi)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-6"
          minLength={6}
          required
        />
        <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700">
          Ro'yxatdan o'tish
        </button>
        <p className="text-sm text-center mt-4">
          Akkountingiz bormi? <Link to="/login" className="text-indigo-600">Kirish</Link>
        </p>
      </form>
    </div>
  );
}
```

- [ ] **Step 5: Replace `frontend/src/App.tsx` entirely (placeholder routes for pages not yet built are added in later tasks — for now, stub them minimally so the app compiles)**

```tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center">Yuklanmoqda...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <div className="p-8">Dashboard tez orada</div>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
```

- [ ] **Step 6: Verify in browser**

```bash
cd backend && node server.js &
cd frontend && npm run dev
```
Open the Vite URL. Click "Bepul boshlash" → register form appears → register with a test email → should redirect toward dashboard stub (or `/onboarding` route, which 404s until Task 13 — that's expected for now). Confirm no console errors other than the missing `/onboarding` route.

Stop both servers. Reset test data: `rm backend/data/users.json`.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/main.tsx frontend/src/App.tsx frontend/src/pages/LandingPage.tsx frontend/src/pages/LoginPage.tsx frontend/src/pages/RegisterPage.tsx
git commit -m "feat: routing + landing/login/register pages"
```

---

## Task 13: Onboarding wizard page

**Files:**
- Create: `frontend/src/pages/OnboardingPage.tsx`
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: Create `frontend/src/pages/OnboardingPage.tsx`**

```tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { LevelTestQuestion } from '../types';

const PROFESSIONS = [
  { id: 'it', label: 'IT / Dasturlash', icon: '💻' },
  { id: 'business', label: 'Business', icon: '💼' },
];

const GOALS = [
  { id: 'job', label: 'Ishga kirish' },
  { id: 'clients', label: 'Xalqaro mijozlar bilan ishlash' },
  { id: 'ielts', label: 'IELTS / imtihon' },
  { id: 'career', label: "Karyera o'sishi" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [profession, setProfession] = useState('');
  const [questions, setQuestions] = useState<LevelTestQuestion[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [goal, setGoal] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.getLevelTest().then((res) => {
      setQuestions(res.questions);
      setAnswers(new Array(res.questions.length).fill(-1));
    });
  }, []);

  function selectAnswer(qIndex: number, optionIndex: number) {
    const next = [...answers];
    next[qIndex] = optionIndex;
    setAnswers(next);
  }

  async function finishOnboarding() {
    setError('');
    if (answers.some((a) => a === -1)) {
      setError('Barcha savollarga javob bering');
      return;
    }
    try {
      const res = await api.completeOnboarding(profession, answers, goal);
      setUser(res.user);
      navigate('/dashboard');
    } catch (err) {
      setError("Xatolik yuz berdi, qayta urinib ko'ring");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-2 flex-1 mx-1 rounded ${s <= step ? 'bg-indigo-600' : 'bg-gray-200'}`} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Kasbingizni tanlang</h2>
            <div className="grid grid-cols-2 gap-4">
              {PROFESSIONS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProfession(p.id)}
                  className={`p-6 rounded-xl border-2 text-center ${
                    profession === p.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                  }`}
                >
                  <div className="text-4xl mb-2">{p.icon}</div>
                  <div className="font-semibold">{p.label}</div>
                </button>
              ))}
            </div>
            <button
              disabled={!profession}
              onClick={() => setStep(2)}
              className="mt-8 w-full bg-indigo-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold"
            >
              Keyingisi
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Daraja aniqlovchi test</h2>
            <div className="space-y-6">
              {questions.map((q, qIndex) => (
                <div key={q.id} className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-medium mb-3">{qIndex + 1}. {q.question}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt, optIndex) => (
                      <button
                        key={optIndex}
                        onClick={() => selectAnswer(qIndex, optIndex)}
                        className={`px-3 py-2 rounded border text-sm text-left ${
                          answers[qIndex] === optIndex ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
            <button
              onClick={() => setStep(3)}
              className="mt-8 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold"
            >
              Keyingisi
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Maqsadingiz nima?</h2>
            <div className="space-y-3">
              {GOALS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 ${
                    goal === g.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
            {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
            <button
              disabled={!goal}
              onClick={finishOnboarding}
              className="mt-8 w-full bg-indigo-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold"
            >
              Yakunlash
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add the route in `frontend/src/App.tsx`** — add the import and a new `<Route>` inside `<Routes>`, right after the `/register` route:

```tsx
import OnboardingPage from './pages/OnboardingPage';
```

```tsx
<Route
  path="/onboarding"
  element={
    <PrivateRoute>
      <OnboardingPage />
    </PrivateRoute>
  }
/>
```

- [ ] **Step 3: Verify in browser**

Start both servers as in Task 12. Register a new user → should land on `/onboarding` → select a profession → answer all 10 level-test questions → select a goal → click "Yakunlash" → should navigate to `/dashboard` (stub page) with no console errors.

Stop servers. Reset test data.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/OnboardingPage.tsx frontend/src/App.tsx
git commit -m "feat: onboarding wizard (profession, level test, goal)"
```

---

## Task 14: Dashboard page

**Files:**
- Create: `frontend/src/pages/DashboardPage.tsx`
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: Create `frontend/src/pages/DashboardPage.tsx`**

```tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { Lesson } from '../types';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.profession) {
      navigate('/onboarding');
      return;
    }
    api
      .getCurrentLesson()
      .then((res) => setLesson(res.lesson))
      .catch(() => setError('Dars generatsiyasida xatolik yuz berdi'))
      .finally(() => setLoading(false));
  }, [user]);

  function goToLesson() {
    if (lesson) {
      sessionStorage.setItem('current_lesson', JSON.stringify(lesson));
      navigate('/lesson');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
        {loading && (
          <>
            <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">AI shaxsiy darsingizni tayyorlamoqda...</p>
          </>
        )}
        {!loading && error && <p className="text-red-600">{error}</p>}
        {!loading && lesson && (
          <>
            <h2 className="text-xl font-bold mb-2">{lesson.title}</h2>
            <p className="text-gray-600 mb-6">{lesson.goalSentence}</p>
            <button onClick={goToLesson} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold">
              Darsni boshlash
            </button>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update the `/dashboard` route in `frontend/src/App.tsx`** — replace the stub `<div>Dashboard tez orada</div>` with `<DashboardPage />`, and import it:

```tsx
import DashboardPage from './pages/DashboardPage';
```

```tsx
<Route
  path="/dashboard"
  element={
    <PrivateRoute>
      <DashboardPage />
    </PrivateRoute>
  }
/>
```

- [ ] **Step 3: Verify in browser**

Complete onboarding again (or reuse a user that already has profession/level/goal set) → dashboard should show the loading spinner, then the lesson title once the AI call (or cache) resolves, with a "Darsni boshlash" button.

Stop servers. Reset test data.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/DashboardPage.tsx frontend/src/App.tsx
git commit -m "feat: dashboard page with AI lesson generation trigger"
```

---

## Task 15: Lesson page — info/vocab/exercises blocks

**Files:**
- Create: `frontend/src/pages/LessonPage.tsx`
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: Create `frontend/src/pages/LessonPage.tsx`** with the first three blocks (info, vocab, exercises) plus scaffolding for the remaining blocks (chat/final/review are added in Task 16):

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import type { Lesson, EvaluationResult } from '../types';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

const BLOCKS = ['info', 'vocab', 'exercises', 'chat', 'final', 'review'];

export default function LessonPage() {
  const navigate = useNavigate();
  const stored = sessionStorage.getItem('current_lesson');
  const lesson: Lesson | null = stored ? JSON.parse(stored) : null;

  const [block, setBlock] = useState(0);
  const [exerciseAnswers, setExerciseAnswers] = useState<string[]>(
    lesson ? new Array(lesson.exercises.length).fill('') : []
  );
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [evalLoading, setEvalLoading] = useState(false);

  if (!lesson) {
    return (
      <div className="p-8 text-center">
        <p>Dars topilmadi.</p>
        <button onClick={() => navigate('/dashboard')} className="text-indigo-600 mt-4">
          Dashboard'ga qaytish
        </button>
      </div>
    );
  }

  async function sendChatMessage() {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { role: 'user', content: chatInput };
    const nextHistory = [...chatHistory, userMsg];
    setChatHistory(nextHistory);
    setChatInput('');
    setChatLoading(true);
    try {
      const res = await api.sendChatMessage(lesson.cacheKey, chatHistory, chatInput);
      setChatHistory([...nextHistory, { role: 'assistant', content: res.reply }]);
    } catch (err) {
      setChatHistory([...nextHistory, { role: 'assistant', content: "(Xatolik yuz berdi, qayta urinib ko'ring)" }]);
    } finally {
      setChatLoading(false);
    }
  }

  async function submitFinalAnswer() {
    if (!finalAnswer.trim()) return;
    setEvalLoading(true);
    try {
      const res = await api.submitEvaluation(lesson.cacheKey, finalAnswer);
      setEvaluation(res.evaluation);
    } catch (err) {
      setEvaluation(null);
    } finally {
      setEvalLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between mb-6">
          {BLOCKS.map((b, i) => (
            <div key={b} className={`h-1.5 flex-1 mx-0.5 rounded ${i <= block ? 'bg-indigo-600' : 'bg-gray-200'}`} />
          ))}
        </div>

        {BLOCKS[block] === 'info' && (
          <div>
            <h2 className="text-2xl font-bold mb-2">{lesson.title}</h2>
            <p className="text-sm text-gray-500 mb-4">{lesson.durationMinutes} daqiqa · Ko'nikma: {lesson.skill}</p>
            <div className="bg-indigo-50 p-4 rounded-lg mb-4">
              <p className="font-semibold mb-1">Missiya:</p>
              <p>{lesson.mission}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold mb-1">Vaziyat:</p>
              <p>{lesson.scenario}</p>
            </div>
            <button onClick={() => setBlock(1)} className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold">
              Davom etish
            </button>
          </div>
        )}

        {BLOCKS[block] === 'vocab' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Yangi so'z va iboralar</h3>
            <div className="grid gap-3 mb-6">
              {lesson.vocabulary.map((v, i) => (
                <div key={i} className="border rounded-lg p-3">
                  <p className="font-semibold">{v.word} <span className="text-gray-400 font-normal">{v.transcription}</span></p>
                  <p className="text-sm text-gray-600">{v.meaningUz}</p>
                  <p className="text-sm italic text-gray-500">"{v.example}"</p>
                </div>
              ))}
            </div>
            <h3 className="text-xl font-bold mb-4">Tayyor iboralar</h3>
            <div className="grid gap-3">
              {lesson.phrases.map((p, i) => (
                <div key={i} className="border rounded-lg p-3">
                  <p className="font-semibold">{p.phrase}</p>
                  <p className="text-sm text-gray-600">{p.usage}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setBlock(2)} className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold">
              Mashqlarga o'tish
            </button>
          </div>
        )}

        {BLOCKS[block] === 'exercises' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Interaktiv mashqlar</h3>
            <div className="space-y-6">
              {lesson.exercises.map((ex, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <p className="font-medium mb-3">{i + 1}. {ex.question}</p>
                  <div className="grid gap-2">
                    {ex.options.map((opt, oi) => (
                      <button
                        key={oi}
                        onClick={() => {
                          const next = [...exerciseAnswers];
                          next[i] = opt;
                          setExerciseAnswers(next);
                        }}
                        className={`text-left px-3 py-2 rounded border ${
                          exerciseAnswers[i] === opt
                            ? opt === ex.correctAnswer
                              ? 'border-green-600 bg-green-50'
                              : 'border-red-500 bg-red-50'
                            : 'border-gray-200'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setBlock(3)} className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold">
              AI suhbatga o'tish
            </button>
          </div>
        )}

        {BLOCKS[block] === 'chat' && <div className="p-4 text-center text-gray-400">Chat blok — Task 16 da qo'shiladi</div>}
        {BLOCKS[block] === 'final' && <div className="p-4 text-center text-gray-400">Yakuniy sinov blok — Task 16 da qo'shiladi</div>}
        {BLOCKS[block] === 'review' && <div className="p-4 text-center text-gray-400">Review blok — Task 16 da qo'shiladi</div>}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add the route in `frontend/src/App.tsx`**

```tsx
import LessonPage from './pages/LessonPage';
```

```tsx
<Route
  path="/lesson"
  element={
    <PrivateRoute>
      <LessonPage />
    </PrivateRoute>
  }
/>
```

- [ ] **Step 3: Verify in browser**

From the dashboard, click "Darsni boshlash" → info block renders with title/mission/scenario → "Davom etish" → vocab/phrases render → "Mashqlarga o'tish" → exercises render and clicking an option highlights green/red correctly → clicking "AI suhbatga o'tish" shows the chat placeholder.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/LessonPage.tsx frontend/src/App.tsx
git commit -m "feat: lesson page - info, vocabulary, exercises blocks"
```

---

## Task 16: Lesson page — chat/final/review blocks

**Files:**
- Modify: `frontend/src/pages/LessonPage.tsx`

- [ ] **Step 1: Replace the three placeholder blocks at the bottom of `frontend/src/pages/LessonPage.tsx`** (the `{BLOCKS[block] === 'chat' && ...}` etc. lines added in Task 15) with the full implementation:

```tsx
{BLOCKS[block] === 'chat' && (
  <div>
    <h3 className="text-xl font-bold mb-2">AI bilan rol-o'yin suhbat</h3>
    <p className="text-sm text-gray-500 mb-4">Rol: {lesson.roleplayCharacter}</p>
    <div className="border rounded-lg p-4 h-72 overflow-y-auto mb-4 bg-gray-50 space-y-3">
      <div className="text-left">
        <span className="inline-block bg-indigo-100 px-3 py-2 rounded-lg">{lesson.roleplayOpeningLine}</span>
      </div>
      {chatHistory.map((m, i) => (
        <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
          <span className={`inline-block px-3 py-2 rounded-lg ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-indigo-100'}`}>
            {m.content}
          </span>
        </div>
      ))}
      {chatLoading && <p className="text-sm text-gray-400">Yozmoqda...</p>}
    </div>
    <div className="flex gap-2">
      <input
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
        placeholder="Inglizcha yozing..."
        className="flex-1 border rounded-lg px-4 py-2"
      />
      <button onClick={sendChatMessage} className="bg-indigo-600 text-white px-4 rounded-lg">
        Yuborish
      </button>
    </div>
    <button onClick={() => setBlock(4)} className="mt-6 w-full bg-gray-200 py-3 rounded-lg font-semibold">
      Yakuniy sinovga o'tish
    </button>
  </div>
)}

{BLOCKS[block] === 'final' && (
  <div>
    <h3 className="text-xl font-bold mb-2">Yakuniy sinov</h3>
    <p className="text-sm text-gray-600 mb-4">{lesson.finalTaskPrompt}</p>
    <textarea
      value={finalAnswer}
      onChange={(e) => setFinalAnswer(e.target.value)}
      rows={6}
      placeholder="Javobingizni inglizcha yozing..."
      className="w-full border rounded-lg px-4 py-3 mb-4"
    />
    {!evaluation && (
      <button
        onClick={submitFinalAnswer}
        disabled={evalLoading}
        className="w-full bg-indigo-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold"
      >
        {evalLoading ? 'Baholanmoqda...' : 'Yuborish va baho olish'}
      </button>
    )}
    {evaluation && (
      <div className="mt-4 space-y-2">
        <p className="font-bold text-lg">Umumiy ball: {evaluation.overallScore}/10</p>
        {Object.entries(evaluation.scores).map(([key, val]) => (
          <div key={key} className="flex justify-between text-sm border-b py-1">
            <span>{key}</span>
            <span className="font-semibold">{val}/10</span>
          </div>
        ))}
        <p className="bg-indigo-50 p-3 rounded-lg mt-3">{evaluation.feedbackUz}</p>
        <button onClick={() => setBlock(5)} className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold">
          Yakunlash
        </button>
      </div>
    )}
  </div>
)}

{BLOCKS[block] === 'review' && (
  <div>
    <h3 className="text-xl font-bold mb-4">Takrorlash uchun</h3>
    <p className="font-semibold mb-2">So'zlar:</p>
    <p className="text-gray-600 mb-4">{lesson.reviewWords.join(', ')}</p>
    <p className="font-semibold mb-2">Iboralar:</p>
    <p className="text-gray-600 mb-6">{lesson.reviewPhrases.join(', ')}</p>
    <button onClick={() => navigate('/result')} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold">
      Natijani ko'rish
    </button>
  </div>
)}
```

- [ ] **Step 2: Verify in browser (full lesson flow, real AI calls)**

Continue from where Task 15 left off: type a message in the chat box → press Enter or click "Yuborish" → AI reply appears in-character within a few seconds. Click "Yakuniy sinovga o'tish" → write a short English answer → "Yuborish va baho olish" → scores + Uzbek feedback render. Click "Yakunlash" → review block shows words/phrases → "Natijani ko'rish" navigates to `/result` (404 until Task 17 — expected).

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/LessonPage.tsx
git commit -m "feat: lesson page - AI chat, final evaluation, review blocks"
```

---

## Task 17: Result page + production build check

**Files:**
- Create: `frontend/src/pages/ResultPage.tsx`
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: Create `frontend/src/pages/ResultPage.tsx`**

```tsx
import { Link } from 'react-router-dom';

export default function ResultPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">Tabriklaymiz!</h2>
        <p className="text-gray-600 mb-6">Siz birinchi darsingizni muvaffaqiyatli yakunladingiz.</p>
        <Link to="/dashboard" className="w-full inline-block bg-indigo-600 text-white py-3 rounded-lg font-semibold">
          Dashboard'ga qaytish
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add the route in `frontend/src/App.tsx`**

```tsx
import ResultPage from './pages/ResultPage';
```

```tsx
<Route
  path="/result"
  element={
    <PrivateRoute>
      <ResultPage />
    </PrivateRoute>
  }
/>
```

- [ ] **Step 3: Verify production build works end-to-end through the backend**

```bash
cd frontend && npm run build
```
Expected: `frontend/dist/` created with no build errors.

```bash
cd ../backend && node server.js
```
Open `http://localhost:5001` directly (not the Vite dev port) — the built React app should load and the full flow (register → onboarding → dashboard → lesson → result) should work identically, served entirely by Express.

Stop the server. Reset test data.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/ResultPage.tsx frontend/src/App.tsx
git commit -m "feat: result page + verified production build"
```

---

## Task 18: Deployment configuration (PM2 + Nginx, no Docker)

**Files:**
- Create: `backend/ecosystem.config.js`
- Create: `DOCs/deploy/nginx-profenglish.conf`
- Create: `DOCs/deploy/deploy-steps.md`

- [ ] **Step 1: Create `backend/ecosystem.config.js`**

```js
module.exports = {
  apps: [
    {
      name: 'profenglish',
      script: 'server.js',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
```

- [ ] **Step 2: Create `DOCs/deploy/nginx-profenglish.conf`** (a template — the real subdomain name must be filled in by the user before use on the VPS):

```
server {
    listen 80;
    server_name profenglish.SIZNING-DOMENINGIZ.uz;

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

- [ ] **Step 3: Create `DOCs/deploy/deploy-steps.md`**

```markdown
# ProfEnglish VPS Deploy (Docker'siz)

1. Kodni VPS'ga yuklash (masalan `/var/www/profenglish`):
   `git clone <repo-url> /var/www/profenglish`

2. Backend paketlarni o'rnatish:
   `cd /var/www/profenglish/backend && npm install --production`

3. `.env` faylni VPS'da yaratish (git'ga kirmagan, qo'lda ko'chiriladi):
   `OPENROUTER_API_KEY=...`, `JWT_SECRET=...`, `PORT=5001`

4. Frontend'ni build qilish:
   `cd /var/www/profenglish/frontend && npm install && npm run build`

5. PM2 o'rnatish (agar yo'q bo'lsa) va ishga tushirish:
   `npm install -g pm2`
   `cd /var/www/profenglish/backend && pm2 start ecosystem.config.js`
   `pm2 save`

6. Nginx: `DOCs/deploy/nginx-profenglish.conf` shablonidagi `SIZNING-DOMENINGIZ.uz` qismini haqiqiy domenga almashtirib, `/etc/nginx/sites-available/profenglish` ga joylash, so'ng:
   `ln -s /etc/nginx/sites-available/profenglish /etc/nginx/sites-enabled/`
   `nginx -t && systemctl reload nginx`

7. SSL: `certbot --nginx -d profenglish.SIZNING-DOMENINGIZ.uz`

8. Keyingi deploylar uchun: `git pull`, backend/frontend paketlarini qayta o'rnatish (agar package.json o'zgargan bo'lsa), `npm run build` (frontend), `pm2 restart profenglish`.
```

- [ ] **Step 4: Verify PM2 config locally (optional, if PM2 is installed on the dev machine)**

```bash
npm install -g pm2
cd backend && pm2 start ecosystem.config.js
pm2 logs profenglish --lines 20
```
Expected: log shows the startup message. Then `pm2 delete profenglish` to clean up the local test.

If PM2 isn't installed locally, skip this verification and rely on the VPS deploy itself — the config syntax has already been validated by Node requiring it without error (`node -e "require('./backend/ecosystem.config.js')"`).

- [ ] **Step 5: Commit**

```bash
git add backend/ecosystem.config.js DOCs/deploy/nginx-profenglish.conf DOCs/deploy/deploy-steps.md
git commit -m "docs: PM2 + Nginx deploy configuration (no Docker)"
```

---

## Task 19: Golden-path manual smoke test (pre-demo checklist)

**Files:**
- Create: `DOCs/deploy/smoke-test-checklist.md`

- [ ] **Step 1: Create `DOCs/deploy/smoke-test-checklist.md`**

```markdown
# Demo Day oldidan qo'lda tekshirish ro'yxati

Ikkalasi ham ishga tushirilgan holda (`cd backend && node server.js`, frontend production build orqali xizmat qiladi — Task 17dagidek):

- [ ] Landing page ochiladi, "Bepul boshlash" tugmasi ishlaydi
- [ ] Ro'yxatdan o'tish: yangi email+parol bilan muvaffaqiyatli ro'yxatdan o'tadi
- [ ] Onboarding — IT stsenariysi: IT tanlanadi → 10 ta savolga javob beriladi → maqsad tanlanadi → Dashboard'ga o'tadi
- [ ] Dashboard: "AI dars tayyorlamoqda..." ko'rinadi, so'ng dars nomi bilan tugma chiqadi (bu — birinchi marta AI'ni "isitib qo'yish", keshlanadi)
- [ ] Dars sahifasi: info/missiya/stsenariy to'g'ri ko'rinadi
- [ ] Lug'at va iboralar bloki to'liq render bo'ladi (bo'sh joy yo'q)
- [ ] Mashqlar: variant bosilganda to'g'ri/xato rangda belgilanadi
- [ ] AI chat: xabar yuborilganda, xarakterga mos, inglizcha javob keladi (real vaqt, kechikish qabul qilinadi)
- [ ] Yakuniy sinov: matn kiritilib yuborilganda, ballar va o'zbekcha fikr-mulohaza chiqadi
- [ ] Review blok: so'zlar/iboralar ro'yxati ko'rinadi, "Natijani ko'rish" natija sahifasiga o'tadi
- [ ] Xuddi shu oqim **Business** kasbi bilan ham takrorlanadi (alohida foydalanuvchi bilan)
- [ ] Chiqish (logout) va qayta kirish ishlaydi
- [ ] Mobil o'lchamda (brauzer devtools responsive rejimi) asosiy sahifalar buzilmaydi

**Muhim:** Bu tekshiruvni demo kunidan oldin, kamida bir marta IT va bir marta Business kombinatsiyasi bilan to'liq bajaring — bu ikkala dars ham `backend/data/lessons-cache.json` ichida keshlanib qoladi, shuning uchun haqiqiy demo paytida sahnada birinchi AI generatsiya kutish vaqti bo'lmaydi.
```

- [ ] **Step 2: Actually execute the checklist** — go through every item above against the running app (dev or production build), for both IT and Business professions, and confirm each box can be checked. Fix any issue found before proceeding to deploy.

- [ ] **Step 3: Commit**

```bash
git add DOCs/deploy/smoke-test-checklist.md
git commit -m "docs: golden-path smoke test checklist for Demo Day"
```
