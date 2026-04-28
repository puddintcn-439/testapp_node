---
name: release-deploy
user-invocable: true
description: "**WORKFLOW SKILL** — Hướng dẫn phát hành và triển khai lên production. Use when: release, tag, build Docker image, deploy to Vercel/Docker. Keywords: release, deploy, vercel, docker, docker-compose"
---

# Mục tiêu
Chuẩn hóa quy trình phát hành, đảm bảo artifacts build sẵn sàng và có khả năng rollback.

# Khi dùng
- Chuẩn bị release version cho production.
- Triển khai lên Vercel, Docker host hoặc orchestrator.

# Các bước chính
1. Tạo bản build client + server (`npm run build`, `npm run build --prefix client`).
2. Nếu dùng Docker: build image, tag bằng semver, push registry.
3. Triển khai (Vercel: `vercel --prod` hoặc deploy qua UI/CI). Với Docker: `docker-compose up -d` trên host.
4. Thực hiện smoke test sau deploy (health endpoint, login flow, basic flows).
5. Ghi changelog và tag release.

# Checklist
- [ ] Build artifacts đã tạo
- [ ] Migrations đã chạy / migration plan sẵn sàng
- [ ] Health checks pass
- [ ] Rollback plan có sẵn

---
