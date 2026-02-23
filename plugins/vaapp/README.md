# VAAPP Plugins

Bo plugin theo format trong `TUTORIAL.md`.

## Files
- `plugins.json`: danh sach plugin cap phat cho app.
- `ophim.js`: plugin OPhim theo Vanilla JS.

## Cach dung
1. Host `plugins.json` o URL public.
2. Dam bao `scriptUrl` trong `plugins.json` tro den file JS public.
3. Khai bao URL `plugins.json` vao VAAPP.

## Demo local
Chay nhanh flow plugin (manifest -> list -> detail -> stream):
```bash
node plugins/vaapp/demo-local.js
```

## Ghi chu
- Plugin nay duoc viet theo model JSON API (uu tien de parse va on dinh hon HTML scraping).
- Neu doi branch/repo, cap nhat lai `scriptUrl` va `iconUrl`.
