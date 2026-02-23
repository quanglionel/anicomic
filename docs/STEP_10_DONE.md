# Bien Ban Hoan Thanh Buoc 10

Ngay cap nhat: 2026-02-23

## Pham vi
- Buoc 10: Cau hinh deploy Cloudflare va checklist van hanh.

## Hang muc da hoan thanh
- Them script deploy o root:
  - `deploy:api`
  - `build:web:pages`
  - `deploy:web:pages`
- Them script deploy o web app:
  - `build:pages` (next-on-pages)
  - `deploy:pages` (wrangler pages deploy)
- Cap nhat tai lieu deploy:
  - `docs/DEPLOY_CLOUDFLARE.md`
- Cap nhat README:
  - `README.md`
  - `apps/api/README.md`
  - `apps/web/README.md`
- Cap nhat trang thai workflow:
  - `WORKFLOW.md`

## Kiem tra da thuc hien
- `pnpm --filter @cpc/api check`: Dat.
- `pnpm --filter @cpc/web check`: Dat.

## Ket qua
- Da co bo lenh deploy va checklist van hanh Cloudflare cho API Worker + Pages web.
