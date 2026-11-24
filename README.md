# The Parlor Dispatch

Disguise any Friday-night action thriller as a sweeping Jane Austen period romance—complete with a secret host studio, an encrypted spoiler-free share link, an interactive Regency mood quiz, an AI-painted period-drama faux poster, a dramatic velvet curtain reveal, and a **Mercy Veto** escape hatch for genuine costume dramas.

---

## How the Four-Act Experience Works

1. **Act I — Secret Setup Studio (`/`)**
   Choose from six ready-to-test classics in the **Starter Action Vault** (including *The Beekeeper*, *John Wick*, *Die Hard*, *Mad Max: Fury Road*, *Taken*, and *Top Gun: Maverick*) or search **any movie in the world** using live Google Search grounding. Select your household streaming services, customize the recipient salutation, and mint an encrypted `/parlor/<token>` link (or click **Preview Quiz** to test the entire flow solo).

2. **Act II — The Parlor Mood Quiz (`/parlor/:token`)**
   Your date opens a calm, standalone Regency salon free of setup controls or spoilers and answers four cozy period-drama questions covering estate scandals, brooding heroes, atmospheric settings, and evening resolutions.

3. **Act III — The Austen Pitch & Bespoke Disguise Poster**
   The server combines verified plot and cast details with her exact quiz answers using **structural trope mapping**—translating every real plot beat into technically true 19th-century Regency equivalents with zero mention of modern weapons, explosions, or action stars—paired with a bespoke `3:4` Regency oil-painting faux poster and *Dramatis Personae*.

4. **Act IV — Velvet Grand Reveal & Mercy Veto**
   Tapping **"Yes, this sounds delightful!"** dissolves the lavender-blush parchment into a deep plum-velvet screening room unveiling the real movie, a side-by-side **Structural Trope Translation** table, verified streaming availability, and the **"Nice try — show me an actual period romance"** Mercy Veto button, which fetches three genuine costume dramas matched to your household streaming services.

---

## Key Features

- **Zero External Movie API Keys**: Uses server-side Gemini with Google Search grounding (`googleSearch`) alongside a built-in curated Starter Vault—no TMDB or Watchmode accounts required.
- **Stateless Encrypted Share Links**: Secret movie payloads are compressed and sealed with server-side **AES-256-GCM** authenticated encryption so movie titles never appear in the URL and no database is needed.
- **Spoiler-Free Server Boundaries**: The real movie title, cast, and plot are withheld from `/api/invitations/:token` and `/api/parlor/pitch` responses until Act IV is explicitly triggered.
- **Live Bespoke Regency Faux Posters**: Built-in starter films include pre-crafted Regency period-drama plates, while custom films (and the **Paint Fresh Portrait** button) generate bespoke `3:4` oil paintings on demand.
- **Mercy Veto Guardrail**: One click recommends three real period romances tailored to her quiz mood and your selected streaming services.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide icons, Vite
- **Backend**: Express (`server.ts`) serving API routes and Vite/static assets on port `3000`
- **AI Models (`@google/genai`)**:
  - `gemini-4-hydrogen` — Google Search-grounded movie lookups, structured Regency trope-mapping pitches, and Mercy Veto period-romance discovery
  - `gemini-3.1-flash-lite-image` — On-demand `3:4` Regency disguise faux posters

---

## Environment Variables

Copy `.env.example` to `.env` (or configure secrets in your hosting environment):

| Variable | Required | Description |
| --- | --- | --- |
| `GEMINI_API_KEY` | Yes | Server-side Gemini API key (a billing-enabled key is required for live `gemini-3.1-flash-lite-image` poster generation). |
| `APP_URL` | Optional | Public URL of the deployed application. |
| `SHARE_TOKEN_SECRET` | Optional | 32+ character secret used to encrypt `/parlor/:token` links across server restarts. If omitted, an ephemeral per-process secret is generated automatically. |

---

## Local Development

```bash
# Install dependencies
npm install

# Start the full-stack Express + Vite dev server on http://localhost:3000
npm run dev
```

### Scripts

- `npm run dev` — Run the Express + Vite development server (`tsx server.ts`)
- `npm run build` — Build the production frontend bundle (`vite build`)
- `npm start` — Run the production server (`node server.ts`)
- `npm run lint` — Type-check the TypeScript codebase (`tsc --noEmit`)

### Unit Tests

Run the pure validation and AES-256-GCM token codec test suites with Node's built-in test runner:

```bash
npx --yes tsx --test src/shared/validation.test.ts src/server/tokenCodec.test.ts
```

---

## Privacy & Attribution Notes

- Movie metadata and streaming availability are grounded via Google Search, with source links displayed alongside dossiers and recommendations.
- Keep custom salutations and inputs lighthearted movie references rather than sensitive personal information.
