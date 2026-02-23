# Bien Ban Hoan Thanh Buoc 0 + 1

Ngay cap nhat: 2026-02-23

## Pham vi
- Buoc 0: Chuan hoa repo nen tang.
- Buoc 1: Khoi tao monorepo web + api va quy trinh setup co ban.

## Hang muc da hoan thanh
- Khoi tao git repository tai thu muc du an.
- Tao root config: `.gitignore`, `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`.
- Tao khung app:
  - `apps/web/package.json`
  - `apps/api/package.json`
  - `packages/shared/README.md`
- Tao tai lieu:
  - `README.md`
  - `WORKFLOW.md`
  - `docs/SETUP.md`
  - `docs/CODESPACES.md`
- Tao cau hinh Codespaces: `.devcontainer/devcontainer.json`.

## Kiem tra da thuc hien
- Kiem tra JSON hop le cho tat ca `package.json`: Dat.
- Kiem tra repo git da khoi tao: Dat.
- Kiem tra cay file buoc 0+1: Dat.

## Chua thuc hien (co chu y)
- Chua chay `pnpm install`, `pnpm dev:web`, `pnpm dev:api` trong moi truong hien tai vi chua co Node runtime local.
- Buoc 2 tro di chua trien khai.

## Dieu kien de bat dau Buoc 2
1. Chay du an trong Codespace hoac moi truong co Node.
2. Xac nhan tiep tuc xay frontend responsive.
