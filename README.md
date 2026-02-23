# CPC Monitor

Nen tang web xem anime/doc comic theo mo hinh plugin, toi uu chi phi (uu tien Cloudflare free-tier), khong dung Docker cho production.

## Muc tieu
- Giao dien responsive cho mobile va desktop.
- Ho tro nguon du lieu theo plugin (manifest + parser rules), khong eval JS tuy y tren server.
- Trien khai Cloudflare Pages + Workers + D1 (+ R2 neu can).
- Van hanh on dinh, khong sleep, local setup gon nhe.

## Lo trinh tu con so 0
1. Chuan hoa repo nen tang (tai lieu, quy uoc, ke hoach).
2. Khoi tao monorepo (web + worker) va script local toi thieu.
3. Dung frontend khung responsive.
4. Dung Worker API khung.
5. Dinh nghia plugin manifest/rules + validator.
6. Xay parser engine cho list/search/detail/watch-read.
7. Tich hop D1 + migration ban dau.
8. Noi frontend voi API end-to-end.
9. Them cache/rate-limit/hardening.
10. Cau hinh deploy Cloudflare va checklist van hanh.
11. Test, sua loi, nghiem thu.

## Nguyen tac trien khai
- Moi buoc deu: lam -> test/check -> sua loi -> bao cao.
- Chi push git khi co yeu cau tu ban.
- Uu tien giai phap it phu thuoc local (npx/pnpm dlx, khong global install linh tinh).

## Van hanh remote de may local sach
- Cau hinh Codespaces da co san trong `.devcontainer/devcontainer.json`.
- Huong dan chi tiet: `docs/CODESPACES.md`.

## Deploy Cloudflare
- Huong dan deploy + checklist van hanh: `docs/DEPLOY_CLOUDFLARE.md`.

## Yeu cau toi thieu de tiep tuc
- Xac nhan stack: Next.js (frontend) + Hono Worker (API) + D1.
- Xac nhan quan diem plugin: cho phep scraper rule-based (khong plugin JS remote tu do).
- Neu dong y, tiep tuc Bước 1 ngay.
