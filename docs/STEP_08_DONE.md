# Bien Ban Hoan Thanh Buoc 8

Ngay cap nhat: 2026-02-23

## Pham vi
- Buoc 8: Noi frontend voi API end-to-end.

## Hang muc da hoan thanh
- Them component FE fetch du lieu runtime tu Worker API:
  - `apps/web/app/live-dashboard.js`
- Frontend goi va hien thi du lieu tu API:
  - `/api/v1/status`
  - `/api/v1/plugins`
  - `/api/v1/list`
  - `/api/v1/parser/list`
- Gan trang chu voi dashboard du lieu that:
  - `apps/web/app/page.js`
- Bo sung style cho state online/loading/offline va danh sach du lieu:
  - `apps/web/app/globals.css`
- Them mau env config:
  - `apps/web/.env.example`
  - `apps/web/README.md` (huong dan `NEXT_PUBLIC_API_BASE_URL`)
- Cap nhat `WORKFLOW.md`.

## Kiem tra da thuc hien
- `pnpm --filter @cpc/web check`: Dat.
- `pnpm --filter @cpc/web build`: Dat.
- `pnpm --filter @cpc/api check`: Dat.

## Ket qua
- Frontend da noi duoc API Worker theo runtime config va hien thi du lieu thuc te.
