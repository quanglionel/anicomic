# Bien Ban Hoan Thanh Buoc 2

Ngay cap nhat: 2026-02-23

## Pham vi
- Buoc 2: Dung frontend khung responsive cho `apps/web` bang Next.js App Router.

## Hang muc da hoan thanh
- Tao bo file app router:
  - `apps/web/app/layout.js`
  - `apps/web/app/page.js`
  - `apps/web/app/globals.css`
- Tao lint config cho Next.js:
  - `apps/web/.eslintrc.json`
- Bo sung devDependencies cho lint:
  - `eslint`
  - `eslint-config-next`
- Cap nhat trang thai quy trinh trong `WORKFLOW.md`.

## Kiem tra da thuc hien
- `pnpm install`: Dat.
- `pnpm --filter @cpc/web check`: Dat.
- `pnpm --filter @cpc/web build`: Dat.

## Ket qua
- Frontend co bo cuc responsive mobile-first va mo rong desktop.
- Co cac khu vuc khung de noi API o buoc tiep theo:
  - Header + navigation
  - Hero/overview
  - Source panel (mock)
  - Update cards (mock)
