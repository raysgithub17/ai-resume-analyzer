# AI Resume Analyzer

Upload a PDF resume, paste a job description, and get an ATS-style match score with skills analysis — powered by [Hugging Face Inference](https://huggingface.co/docs/inference-providers) (Llama 3.1 8B).

## Tech stack

- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS 4**
- **pdf-parse** — PDF text extraction
- **@huggingface/inference** — AI analysis

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) (or npm/yarn)
- A [Hugging Face](https://huggingface.co/) account and [access token](https://huggingface.co/settings/tokens)

## Local setup

1. Clone the repo and install dependencies:

```bash
git clone https://github.com/YOUR_USERNAME/ai-resume-analyzer.git
cd ai-resume-analyzer
pnpm install
```

2. Copy the example env file and add your token:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```bash
HF_ACCESS_TOKEN=hf_your_token_here
```

3. Run the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Push this repo to GitHub (see below).
2. Go to [vercel.com/new](https://vercel.com/new) and import your GitHub repository.
3. Vercel auto-detects Next.js. Keep the default build settings:
   - **Build command:** `pnpm build` (or `next build`)
   - **Install command:** `pnpm install`
4. Under **Environment Variables**, add:
   - **Name:** `HF_ACCESS_TOKEN`
   - **Value:** your Hugging Face token
   - **Environments:** Production (and Preview if you want previews to work)
5. Click **Deploy**.

Your live URL will look like `https://ai-resume-analyzer-xxx.vercel.app`.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `HF_ACCESS_TOKEN` | Yes | Hugging Face API token (server-only) |

Never commit `.env.local` or paste your token in GitHub, LinkedIn, or screenshots.

## Project structure

```
app/
  page.tsx          # Main UI
  api/
    analyze/        # PDF upload → text
    ai/             # Resume + JD → ATS analysis
```

## License

MIT — use freely for learning and portfolio projects.
