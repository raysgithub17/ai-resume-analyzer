# AI Resume Analyzer

Upload a PDF resume, paste a job description, and get AI-powered ATS feedback — match score, skill gaps, and actionable improvements. Sign in to save reports and revisit past analyses.

**Repository:** [github.com/raysgithub17/ai-resume-analyzer](https://github.com/raysgithub17/ai-resume-analyzer)

## Features

- **ATS-style analysis** — Match score (0–100), summary, matched vs. missing skills, improvements, and suggestions
- **PDF resume upload** — Server-side text extraction via `pdf-parse`
- **AI-powered insights** — [Hugging Face Inference](https://huggingface.co/docs/inference-providers) with Llama 3.1 8B Instruct
- **Google sign-in** — Firebase Authentication
- **Analysis history** — Past reports stored in Firestore (per user, up to 50 entries)
- **Download reports** — Export analysis as a text file
- **Dark mode** — System-aware theme with manual toggle
- **SEO-ready** — Open Graph, sitemap, robots.txt, and web app manifest

## Tech stack

| Layer | Technologies |
|-------|----------------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, Lucide icons |
| AI | `@huggingface/inference` (Llama 3.1 8B) |
| PDF | `pdf-parse` |
| Auth & data | Firebase Auth (Google), Firestore |
| Deploy | Vercel |

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) (or npm/yarn)
- A [Hugging Face](https://huggingface.co/) [access token](https://huggingface.co/settings/tokens)
- A [Firebase](https://console.firebase.google.com/) project with:
  - **Authentication** — Google provider enabled
  - **Firestore** — Database created (start in test mode for development, then add security rules for production)

## Local setup

1. **Clone and install**

```bash
git clone https://github.com/raysgithub17/ai-resume-analyzer.git
cd ai-resume-analyzer
pnpm install
```

2. **Environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values (see [Environment variables](#environment-variables) below).

3. **Run the dev server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Push this repo to GitHub (or connect an existing repo).
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Use default Next.js settings:
   - **Build command:** `pnpm build`
   - **Install command:** `pnpm install`
4. Add all [environment variables](#environment-variables) under **Settings → Environment Variables** for **Production** (and **Preview** if you want preview deployments to work).
5. Set `NEXT_PUBLIC_SITE_URL` to your Vercel URL (e.g. `https://your-app.vercel.app`).
6. Deploy.

After deploy, add your production domain to Firebase **Authentication → Settings → Authorized domains** if you use a custom domain.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `HF_ACCESS_TOKEN` | Yes | Hugging Face API token (server-only) |
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Public site URL for SEO and Open Graph |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Firebase web app config |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes | Firebase app ID |

Copy from **Firebase Console → Project settings → Your apps → Web**.

Never commit `.env.local` or share tokens in issues, screenshots, or social posts.

## Project structure

```
app/
  page.tsx              # Main analyze UI
  history/page.tsx      # Saved analysis history
  login/page.tsx        # Google sign-in
  api/
    analyze/route.js    # PDF upload → extracted text
    ai/route.js         # Resume + job description → ATS JSON
components/
  analysis/             # Score ring, skill tags, results layout
  layout/               # Dashboard shell, sidebar, page header
  AuthProvider.tsx      # Firebase auth context
lib/
  firebase.ts           # Firebase app, auth, Firestore
  history.ts            # CRUD for user analysis history
  types.ts              # AnalysisResult, HistoryEntry
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Run production server locally |
| `pnpm lint` | Run ESLint |

## License

MIT — use freely for learning and portfolio projects.
