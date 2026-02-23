# Web App

Next.js frontend cho giao dien anime/comic responsive.

## API config
- Tao file `.env.local` tu `.env.example`.
- Dat `NEXT_PUBLIC_API_BASE_URL` tro den Worker API (vi du: `http://localhost:8788`).

## Deploy Pages
- Build artifact Pages: `pnpm --filter @cpc/web build:pages`
- Deploy Pages: `pnpm --filter @cpc/web deploy:pages`
