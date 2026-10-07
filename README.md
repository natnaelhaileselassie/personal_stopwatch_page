# personal_stopwatch_page

Personal stopwatch page so I can track hours spent at work. Includes a live stopwatch (with automatic decimal-minute conversion) and an independent pomodoro timer that can run alongside it.

## Features

- Stopwatch with start / pause / resume / reset
- Live conversion of elapsed time to decimal minutes (e.g. `90s` → `1.50`)
- Pomodoro timer with Focus (25m), Short break (5m), and Long break (15m) presets, running concurrently with the stopwatch

## Tech stack

### Languages
- **TypeScript** — all application logic (`src/*.tsx`), typed with strict `tsconfig`
- **HTML** — single entry point in `my-app/index.html`
- **CSS** — plain CSS modules in `src/index.css` and `src/App.css` (no preprocessor)
- **JSON** — package manifests and `tsconfig` files

### Frameworks & libraries
- **React 19** (`react`, `react-dom`) — UI library; the app uses functional components with `useState`, `useEffect`, and `useRef`
- **Vite 8** (`vite`, `@vitejs/plugin-react`) — dev server, HMR, and production bundler

### Tooling
- **TypeScript 6** — type checking (`tsc -b`) as part of the build
- **ESLint 10** with `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh` — linting
- **npm** — package management

### Runtime APIs
- `performance.now()` for high-resolution elapsed-time tracking
- `window.setInterval` for the display tick

## Scripts

Run from `my-app/`:

```bash
npm install      # install dependencies
npm run dev      # start the Vite dev server
npm run build    # type-check and produce a production build
npm run lint     # run ESLint
npm run preview  # preview the production build locally
```
