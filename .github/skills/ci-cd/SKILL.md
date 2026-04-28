---
name: ci-cd
user-invocable: true
description: "**WORKFLOW SKILL** — Hướng dẫn cấu hình CI/CD: lint, test, build, deploy. Use when: cấu hình pipeline GitHub Actions / Jenkins / Vercel. Keywords: CI, CD, build, test, npm run build, vercel, docker-compose"
---

# Mục tiêu
Thiết lập pipeline đảm bảo mã nguồn được kiểm tra, build và deploy tự động khi đạt chuẩn.

# Khi dùng
- Thiết lập CI để chạy lint/test/build cho mỗi PR.
- Tạo pipeline deploy (staging/production).

# Các bước chính
1. Tạo GitHub Action (hoặc pipeline tương đương) với các bước:
   - Checkout
   - Setup Node.js
   - Install dependencies
   - Run tests (`npm test`)
   - Build (`npm run build`, `npm run build --prefix client`)
   - (Optional) Publish Docker image or deploy to Vercel
2. Với Docker: sử dụng `docker-compose.yml` và `Dockerfile` trong `agent-runner` nếu cần.
3. Thiết lập secrets repo (e.g., `PROD_DB_URL`, `JWT_SECRET`, `VERCEL_TOKEN`).
4. Thêm protected branch rules: bắt buộc status checks.

# Checklist
- [ ] Tests chạy trong CI
- [ ] Build thành công
- [ ] Secrets an toàn (GitHub Secrets)
- [ ] Deploy chỉ khi PR đã review và merge

# Ví dụ commands (local)
```bash
# client build
npm run build --prefix client
# server build
npm run build
```

---
