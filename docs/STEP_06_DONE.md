# Bien Ban Hoan Thanh Buoc 6

Ngay cap nhat: 2026-02-23

## Pham vi
- Buoc 6: Xay parser engine cho list/search/detail/watch-read.

## Hang muc da hoan thanh
- Mo rong plugin schema voi `watchRead` rules:
  - `packages/shared/src/plugin.ts`
- Tao parser engine rule-based trong shared:
  - `packages/shared/src/parser.ts`
  - `packages/shared/src/index.ts`
  - `packages/shared/package.json` (export `./parser`)
- Tich hop parser vao API Worker:
  - `GET /api/v1/parser/list`
  - `GET /api/v1/parser/search`
  - `GET /api/v1/parser/detail`
  - `GET /api/v1/parser/watch-read`
- Tao mock HTML snapshots cho plugin de test parser end-to-end.
- Cap nhat tai lieu:
  - `apps/api/README.md`
  - `packages/shared/README.md`
  - `WORKFLOW.md`

## Kiem tra da thuc hien
- `pnpm --filter @cpc/api build`: Dat.
- `pnpm --filter @cpc/api check`: Dat.
- Smoke test local parser endpoints: Dat.

## Ket qua
- Da co parser engine rule-based khong eval JS, san sang de noi du lieu that o Buoc 7+.
