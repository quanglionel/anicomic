# Huong Dan Su Dung VS Code + Codespaces

## Muc tieu
- Khong cai Node/pnpm tren may local.
- Toan bo build/chay/deploy thuc hien trong moi truong remote.

## Dieu kien can
1. Tai khoan GitHub.
2. Repo da duoc day len GitHub.
3. VS Code da cai extension `GitHub Codespaces`.

## Tao Codespace
1. Mo repo tren GitHub.
2. Bam `Code` -> tab `Codespaces` -> `Create codespace on main`.
3. Doi khoi tao container xong (lan dau co the mat vai phut).

## Mo bang VS Code desktop
1. Nhan `Open in VS Code` tu trang Codespace.
2. VS Code se ket noi remote, khong dung runtime local.

## Lenh can chay trong terminal remote
```bash
pnpm -v
pnpm dev:web
```

Mo terminal thu 2:
```bash
pnpm dev:api
```

## Cac cong mac dinh
- `3000`: Web app.
- `8787`: Cloudflare Worker dev.

## Khi deploy Cloudflare
Chay trong terminal remote:
```bash
npx wrangler login
```

Sau do moi them cac lenh tao D1/R2/KV va deploy.
