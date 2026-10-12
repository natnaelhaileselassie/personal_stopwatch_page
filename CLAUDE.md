# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from `my-app/` (not the repo root):

```bash
npm install      # install dependencies
npm run dev      # Vite dev server with HMR
npm run build    # tsc -b (type-check) then vite build — use this to verify type correctness
npm run lint     # ESLint over the project
npm run preview  # serve the production build locally
```

There is no test suite configured.

## Architecture

Single-page React app living under `my-app/`. The repo root holds only the README, the GitHub Pages deploy workflow, and this file; everything else is nested in `my-app/`.

- `my-app/src/App.tsx` contains the entire application: two independent components, `Stopwatch` and `Pomodoro`, rendered side-by-side by `App`. All timing, formatting helpers, and the pomodoro preset table live in this one file.
- Both timers use `performance.now()` with a `useRef` anchor plus `window.setInterval` purely for the display tick — the timing source is monotonic time deltas, not an interval counter, so dropped ticks don't cause drift. The stopwatch keeps a `baseRef` of accumulated elapsed ms across pause/resume; the pomodoro keeps `endRef`, a target timestamp.
- The stopwatch writes `document.title` on each tick (`HH:MM:SS — Stopwatch`) so elapsed time is visible in the browser tab.
- Styling is plain CSS in `src/App.css` and `src/index.css` — no CSS framework, no preprocessor.

## Deployment

Deployed to GitHub Pages via `.github/workflows/deploy.yml` on every push to `main`. Because the site is served from `https://<user>.github.io/personal_stopwatch_page/`, `vite.config.ts` sets `base: '/personal_stopwatch_page/'`. If the repo is ever renamed or served from a different path, that `base` must change in lockstep or built asset URLs will 404.
