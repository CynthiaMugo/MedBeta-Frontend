# MedBeta — Frontend

## Project overview

MedBeta is a web-based medical administration platform designed to help clinics and hospitals manage patient records, appointments, and everyday operational workflows. The frontend implements role-based portals (superadmin, admin, doctor, patient, pharmacist, lab, hospital) for scheduling, viewing clinical data, managing inventories, and reviewing lab results. This repository contains the user interface only — it communicates with a backend API for authentication and data.

This repository contains the frontend for MedBeta, a healthcare/medical administration web application built with React and Vite.

The frontend provides different portal views (superadmin, admin, doctor, patient, pharmacist, lab, hospital) and common UI components used across the application.

## Quick overview

- Framework: React (v19) with Vite
- Styling: Tailwind CSS
- Routing: react-router-dom
- HTTP: axios
- Charts: recharts
- Icons: react-icons, lucide-react
- Calendar: FullCalendar

This README explains how to set up and run the frontend portion of MedBeta.

## Requirements

- Node.js 18+ (recommended) or compatible
- npm (or use yarn/pnpm if you prefer)

## Install

Clone the repository (if you haven't) and install dependencies:

```bash
npm install
```

## Available scripts

The following npm scripts are defined in `package.json`:

- `npm run dev` — Start the Vite dev server (hot reload)
- `npm run build` — Build the production bundle
- `npm run preview` — Preview the production build locally
- `npm run lint` — Run ESLint across the project

Examples:

```bash
npm run dev
npm run build
npm run preview
```

## Configuration

- The frontend expects an API base URL. See `src/config.js` where `API_URL` is defined.
- For local development the default is `http://localhost:5000`. Adjust `src/config.js` or use your own environment mechanism to point to a real backend.

```js
// src/config.js
export const API_URL = "http://localhost:5000";
```

If you prefer environment variables, you can wire `import.meta.env.VITE_API_URL` into `src/config.js` and set `VITE_API_URL` in a `.env` file.

## Project structure (important files)

- `src/` — application source
	- `main.jsx` — app entry
	- `App.jsx` — top-level routes and providers
	- `index.css` — global styles (Tailwind)
	- `config.js` — base API URL and related constants
	- `components/` — reusable components (Header, Footer, forms, modals, protected route, etc.)
	- `pages/` — different page views (auth pages, dashboards, portal pages)

Plus `public/` for static assets.

## Conventions & notes

- Components are function components using hooks.
- Routes live in `App.jsx` and are guarded using `ProtectedRoute.jsx` for authenticated pages.
- Keep network calls centralized (e.g., a small `api` utility or via `axios` instances) so tokens and error handling are consistent.

## Linting

ESLint is configured; run:

```bash
npm run lint
```

Add or fix rules in `.eslintrc` / `eslint.config.js` as needed.

## Troubleshooting

- If you see CSS/Tailwind issues, ensure `tailwindcss` is installed and configured according to `tailwind.config.js` (project already includes Tailwind deps).
- If API calls fail, confirm `src/config.js` `API_URL` is correct and the backend is running.

## Contributors

- Cynthia Mugo
- Irene Murage
- Ian Mabruk
- Horace Kauna
- Wayne Muongi

If you'd like your GitHub handle added next to your name, open a PR that updates this file.

## Use & license

This project was created for learning purposes under the instruction of Moringa School. It is not published under an open-source license.





