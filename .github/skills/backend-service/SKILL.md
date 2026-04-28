---
name: backend-service
user-invocable: true
description: "**WORKFLOW SKILL** — Hướng dẫn thêm/sửa service backend, DB và migration. Use when: thêm business logic, migration, kết nối DB. Keywords: db, models, services, src/services, src/models, src/config/db.ts"
---

# Mục tiêu
Hỗ trợ phát triển service backend an toàn, có test, và sẵn sàng triển khai.

# Khi dùng
- Thêm logic nghiệp vụ mới trong `src/services`.
- Thêm hoặc sửa model và schema DB.
- Tạo migration hoặc seed data.

# Các bước chính
1. Xem cấu hình DB: `src/config/db.ts` để biết connection string và driver (mssql/pg).
2. Thêm/điều chỉnh model trong `src/models` (tùy ORM hoặc raw queries).
3. Tạo migration script (nếu bạn có hệ thống migration) hoặc document manual SQL.
4. Viết unit/integration tests cho service.
5. Chạy local DB (Docker/MSSQL) và thực hiện smoke test.
6. Khi ổn, thêm bước deploy và migration vào pipeline CI/CD.

# Checklist
- [ ] Tạo backup hoặc script rollback nếu migration destructive
- [ ] Tests cover business logic
- [ ] Secrets (DB password) dùng env vars, không commit
- [ ] DB connection timeout và retry logic hợp lý

# Tệp cần kiểm tra
- `src/config/db.ts`
- `src/services/*`
- `src/models/*`
- scripts tạo DB: `scripts/create_mssql_db.js`

---
