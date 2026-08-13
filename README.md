# Database Detective

A browser-based mystery game where you solve crimes using SQL queries.

## What it is

Each case gives you a fictionalized crime story, a set of database tables full of suspects, timelines, and evidence, and a series of objectives. Your job is to write SQL queries that uncover the truth.

No fill-in-the-blank. No guided tutorials. Just real open-ended SQL against a real in-browser SQLite database.

## Features

- **Evidence Board** — correct queries pin cards to a cork board that fills as you solve
- **Character-voiced partner** — every result and error delivered in-character
- **Result-set validation** — any valid SQL that returns the right answer is accepted
- **Detective rating system** — rated on queries used, hints taken, and time
- **Shareable case cards** — copy your result and post it
- **Hard Mode** — no hints, higher stakes
- **SQL Quick Reference** — built-in cheat sheet for beginners

## Cases

- **Case 001: The Painter and the Dancer** (Rookie) — SELECT, WHERE, ORDER BY, basic JOINs
- **Case 002: Letters from the Crow** (Rookie) — JOINs, NULL checks, GROUP BY logic

## Tech Stack

- React + TypeScript
- sql.js (SQLite via WebAssembly — runs fully in-browser, zero backend)
- CodeMirror 6 (SQL editor with syntax highlighting)
- Zustand (state + progress persistence via localStorage)
- Tailwind CSS
- React Router v6

## Running Locally

```bash
npm install
npm start
```

Then open [http://localhost:3000](http://localhost:3000).

## Building for Production

```bash
npm run build
```

Deploy the `build/` folder to Vercel, Netlify, or any static host.

**Important:** The `sql-wasm.wasm` file in `public/` must be served at the root. It is automatically included in the build output.

## Deploying to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Framework: Create React App (auto-detected)
4. No environment variables needed
5. Deploy

## Adding New Cases

Cases are JSON-like TypeScript files in `src/data/cases/`. Copy `case001.ts` as a template. Then add your case to `src/data/cases/index.ts`.

Each case needs:
- `schema` — table definitions shown in the Schema Browser
- `seedSQL` — raw SQL that creates and populates the tables
- `chapters` — each chapter has a narrative, objective, expected columns/row count, and hints
- `evidenceItems` — cards pinned to the Evidence Board when chapters are completed
- `solution` — the culprit reveal shown on the Solved screen

## License

MIT
