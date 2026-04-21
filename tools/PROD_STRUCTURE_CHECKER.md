# Hướng dẫn tái sử dụng: Production Structure Checker

Mục đích: ghi lại ngắn gọn cách tái sử dụng công cụ `checkProdStructure.js` và workflow CI để kiểm tra cấu trúc phù hợp cho production (Vercel, Vite, static sites, serverless).

## Phù hợp cho repo loại nào
- Vite / static front-end (SPA hoặc MPA): phù hợp nhất.
- Static site (HTML/CSS/JS không dùng build tool): vẫn hữu dụng.
- Monorepo (ví dụ `client/` + `server/`): dùng được nếu đặt tool ở root hoặc chạy trong subfolder.
- Serverless / Vercel function repo: rất phù hợp (kiểm tra `vercel.json` / function pattern).
- Node/Express backend: dùng được, một số cảnh báo (Vite-specific) có thể là false-positive.
- Next.js / framework opinionated: có thể cần tùy chỉnh rules (khuyến nghị tùy biến).

## File chính trong repo hiện tại
- `tools/checkProdStructure.js` — script kiểm tra cấu trúc production.
- `.github/workflows/prod-structure-check.yml` — workflow CI chạy script trên push/PR.
- (tùy chọn) thêm script npm: `npm run check:prod-structure` để chạy local.

## Ba phương án tái sử dụng (tóm tắt)

### A — Copy / Template (nhanh)
- Copy `tools/checkProdStructure.js` và `.github/workflows/prod-structure-check.yml` vào repo mới.
- Thêm script vào `package.json` nếu muốn: `"check:prod-structure": "node tools/checkProdStructure.js"`.
- Dùng khi bạn quản lý vài repo và muốn triển khai nhanh.

Ví dụ lệnh:
```bash
mkdir -p tools .github/workflows
cp /path/to/checkProdStructure.js tools/checkProdStructure.js
cp /path/to/prod-structure-check.yml .github/workflows/prod-structure-check.yml
# (tuỳ chọn) thêm vào package.json
npm run check:prod-structure
```

### B — Đóng gói thành NPM CLI
- Tạo repo/pack nhỏ, thêm `bin` entry trong `package.json` để publish lên npm.
- Người dùng có thể chạy: `npx check-prod-structure` hoặc `npm i -D check-prod-structure`.
- Tốt cho trường hợp bạn muốn dùng cục bộ trên nhiều máy/dev.

Tóm tắt:
```bash
# Tạo package, bin/cli.js gọi tools/checkProdStructure.js
npm publish --access public
# Dùng: npx check-prod-structure
```

### C — Reusable GitHub Workflow (khuyến nghị cho CI lớn)
- Tạo repo public `prod-structure-checker` chứa `tools/checkProdStructure.js` và 1 workflow có `on: workflow_call`.
- Các repo khác gọi workflow đó bằng `uses: org/prod-structure-checker/.github/workflows/check.yml@v1`.
- Ưu: duy trì 1 chỗ, cập nhật dễ, CI thống nhất cho toàn org.

Ví dụ consumer workflow:
```yaml
jobs:
  call-shared:
    uses: your-org/prod-structure-checker/.github/workflows/check.yml@v1
```

## Khi repo có subfolder (ví dụ `client/`)
- Option 1: đặt `tools/checkProdStructure.js` trực tiếp vào `client/` và chạy từ đó.
- Option 2 (khuyên dùng trong workflow): chạy script từ root nhưng với `working-directory` trỏ tới subfolder.

Ví dụ step trong workflow để chạy trong `client/`:
```yaml
- name: Run checker in client
  run: node tools/checkProdStructure.js
  working-directory: client
```

## Cấu hình / tuỳ biến
- Script hiện là các heuristic; có thể thêm file cấu hình (ví dụ `.prod-structure.json`) để bật/tắt rules hoặc thêm patterns được chấp nhận. Tôi có thể thêm tính năng `--apply` để tự động di chuyển HTML static vào `public/` khi rõ ràng.

## Kiểm tra & chạy local
- Chạy local:
```bash
npm run check:prod-structure
# hoặc
node tools/checkProdStructure.js
```
- Trong CI workflow (đã có): `.github/workflows/prod-structure-check.yml` sẽ chạy script trên push/PR.

## Ghi chú vận hành
- Nếu dùng Vercel: đảm bảo `vercel.json` nằm trong project root mà Vercel dùng (hoặc đặt `client/vercel.json` nếu root là `client/`).
- Tránh dùng `path.join(__dirname, '..', ...)` trong serverless function — prefer `process.cwd()` hoặc `includeFiles`.

---
Tôi đã tạo file này trong `tools/PROD_STRUCTURE_CHECKER.md`. Muốn tôi commit + push file này lên repo không? Hoặc cần tôi tạo repo public cho phương án C luôn không?
