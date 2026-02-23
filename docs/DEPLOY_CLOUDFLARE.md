# Deploy Cloudflare

Ngay cap nhat: 2026-02-23

## 1) Dieu kien
- Da dang nhap Cloudflare:
  - `pnpm dlx wrangler login`
- Da tao project tren Cloudflare Pages:
  - `anicomic-web`
- Da tao D1 database:
  - `anicomic-db`

## 2) Cap nhat cau hinh D1
1. Lay `database_id`:
```bash
pnpm dlx wrangler d1 list
```
2. Cap nhat `apps/api/wrangler.jsonc`:
- truong `d1_databases[0].database_id`

## 3) Deploy API Worker
1. Apply migration len remote D1:
```bash
pnpm --filter @cpc/api db:migrate:remote
```
2. Deploy Worker:
```bash
pnpm deploy:api
```
3. Verify nhanh:
```bash
pnpm dlx wrangler tail anicomic-api
```
- test URL:
  - `/health`
  - `/api/v1/status`
  - `/api/v1/db/health`

## 4) Deploy Web (Cloudflare Pages)
1. Build artifact cho Pages:
```bash
pnpm build:web:pages
```
2. Deploy static output:
```bash
pnpm deploy:web:pages
```

## 5) Bien moi truong khuyen nghi
- Web:
  - `NEXT_PUBLIC_API_BASE_URL` = URL Worker production
- API (neu can secret):
```bash
pnpm dlx wrangler secret put SECRET_NAME
```

## 6) Checklist van hanh
- [ ] `apps/api/wrangler.jsonc` da dung `database_id` that (khong de all-zero).
- [ ] Remote migration da apply.
- [ ] `/api/v1/db/health` tra `pluginsTableExists=true`.
- [ ] `/api/v1/plugins` tra `source: "d1"`.
- [ ] Web goi duoc API production, khong con hardcode localhost.
- [ ] Logs/observability da bat (`wrangler tail` va dashboard metrics).
- [ ] Co rollback plan: giu lai migration SQL va commit deploy truoc do.
