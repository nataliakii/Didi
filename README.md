# Didi

Asteria Diamond House — a diamond-focused luxury ecommerce site built with Next.js.

## Getting started

```bash
npm install
cp .env.example .env.local   # configure MongoDB and optional demo assets flag
npm run dev
```

Open [http://localhost:3000/en](http://localhost:3000/en).

## Demo images

Place licensed photos under `public/images/demo/` (see `public/images/demo/README.md`). Set `NEXT_PUBLIC_DEMO_ASSETS_READY=true` in `.env.local` once files are on disk.

## Seed data

```bash
npm run seed
```

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run lint` — ESLint
