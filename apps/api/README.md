# API Worker

Cloudflare Worker (Hono) cho plugin registry, parser engine va API du lieu.

## Endpoints khung (Bước 3)
- `GET /`
- `GET /health`
- `GET /api/v1/status`

## Endpoints mock contract (Bước 4)
- `GET /api/v1/list?page=1&limit=12&type=anime|comic`
- `GET /api/v1/detail/:id`
- `GET /api/v1/search?q=keyword&page=1&limit=12&type=anime|comic`

## Endpoints plugin schema/validator (Bước 5)
- `GET /api/v1/plugins`
- `POST /api/v1/plugins/validate`

## Endpoints parser engine (Bước 6)
- `GET /api/v1/parser/list?pluginId=...`
- `GET /api/v1/parser/search?pluginId=...&q=...`
- `GET /api/v1/parser/detail?pluginId=...&id=...`
- `GET /api/v1/parser/watch-read?pluginId=...&id=...`

## D1 integration (Bước 7)
- `GET /api/v1/db/health`
- `GET /api/v1/plugins` (uu tien doc tu D1, fallback mock neu D1 chua san sang)

## Lenh migration
- `pnpm --filter @cpc/api db:migrate:local`
- `pnpm --filter @cpc/api db:migrate:remote`

## Hardening (Bước 9)
- Request id cho moi response: header `X-Request-Id`
- Security headers co ban: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`
- In-memory cache TTL cho cac endpoint GET quan trong (`X-Cache: HIT|MISS`)
- In-memory rate-limit cho parser endpoints theo `plugin.rateLimit.requestsPerMinute`
- Input guards:
  - `pluginId`/`id` theo pattern `[a-z0-9-]+`
  - Gioi han do dai query `q` (toi da 120 ky tu)

## Deploy nhanh
- Deploy Worker: `pnpm deploy:api`
- Chi tiet deploy + checklist: `docs/DEPLOY_CLOUDFLARE.md`
