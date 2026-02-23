# Bien Ban Hoan Thanh Buoc 5

Ngay cap nhat: 2026-02-23

## Pham vi
- Buoc 5: Dinh nghia plugin manifest/rules + validator.

## Hang muc da hoan thanh
- Tao shared package cho schema:
  - `packages/shared/package.json`
  - `packages/shared/src/plugin.ts`
  - `packages/shared/src/index.ts`
- Dinh nghia schema voi Zod:
  - Plugin manifest schema
  - Parser rules schema (list/detail/search)
  - Rate limit schema
- Them helper validator:
  - `validatePluginManifest(input)`
- Tich hop vao API Worker:
  - `GET /api/v1/plugins` (mock plugin manifests)
  - `POST /api/v1/plugins/validate` (validate manifest)
- Cap nhat tai lieu:
  - `packages/shared/README.md`
  - `apps/api/README.md`
  - `WORKFLOW.md`

## Kiem tra da thuc hien
- `pnpm install`: Dat.
- `pnpm --filter @cpc/api build`: Dat.
- `pnpm --filter @cpc/api check`: Dat.
- Smoke test local:
  - `GET /api/v1/plugins`: Dat.
  - `POST /api/v1/plugins/validate` voi payload hop le: Dat.
  - `POST /api/v1/plugins/validate` voi payload khong hop le: Dat (400).

## Ket qua
- Da co bo schema/validator plugin de lam nen tang cho parser engine o Buoc 6.
