# Bien Ban Hoan Thanh Buoc 9

Ngay cap nhat: 2026-02-23

## Pham vi
- Buoc 9: Them cache/rate-limit/hardening cho API.

## Hang muc da hoan thanh
- Request tracing + security headers middleware:
  - `X-Request-Id`
  - `X-Content-Type-Options`
  - `X-Frame-Options`
  - `Referrer-Policy`
- Chuan hoa error envelope voi `code`, `apiVersion`, `requestId`.
- Them input guards:
  - Kiem tra dinh dang `pluginId`/`id`
  - Gioi han do dai query `q`
  - Gioi han do dai URL request
  - Gioi han payload endpoint validate (64KB)
- Them in-memory cache TTL cho cac GET endpoint chinh.
- Them in-memory rate-limit cho parser endpoints theo plugin RPM.
- Cap nhat tai lieu:
  - `apps/api/README.md`
  - `WORKFLOW.md`

## Kiem tra da thuc hien
- `pnpm --filter @cpc/api build`: Dat.
- `pnpm --filter @cpc/api check`: Dat.
- Smoke test:
  - Kiem tra `X-Request-Id`, `X-Cache`.
  - Kiem tra response loi do input invalid.
  - Kiem tra parser endpoint bi limit khi goi vuot nguong.

## Ket qua
- API da co lop hardening co ban de chuan bi cho Buoc 10 deploy checklist.
