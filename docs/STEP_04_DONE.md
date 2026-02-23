# Bien Ban Hoan Thanh Buoc 4

Ngay cap nhat: 2026-02-23

## Pham vi
- Buoc 4: Dinh nghia API contract mock cho list/detail/search.

## Hang muc da hoan thanh
- Cap nhat `apps/api/src/index.ts` voi contract mock:
  - `GET /api/v1/list`
  - `GET /api/v1/detail/:id`
  - `GET /api/v1/search`
- Them pagination + filter query:
  - `page`, `limit`, `type`
- Them quy uoc loi API mock:
  - `QUERY_REQUIRED` (400 cho search thieu `q`)
  - `ITEM_NOT_FOUND` (404 cho detail khong ton tai)
- Cap nhat `GET /api/v1/status` de mo ta cac endpoint moi.
- Cap nhat tai lieu:
  - `apps/api/README.md`
  - `WORKFLOW.md`

## Kiem tra da thuc hien
- `pnpm --filter @cpc/api build`: Dat.
- `pnpm --filter @cpc/api check`: Dat.
- Smoke test local voi `wrangler dev`:
  - `/api/v1/list`: Dat
  - `/api/v1/detail/:id`: Dat
  - `/api/v1/search?q=...`: Dat
  - `/api/v1/search` (thieu `q`): Dat (400)

## Ket qua
- API mock da san sang de frontend noi end-to-end o Buoc 8.
