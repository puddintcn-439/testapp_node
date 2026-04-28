---
name: api-design
user-invocable: true
description: "**WORKFLOW SKILL** — Hướng dẫn thiết kế và thay đổi API server. Use when: thêm/sửa endpoint, thay đổi schema, tạo contract giữa client/server. Keywords: routes, controllers, services, swagger, src/routes, src/controllers, client/src/api"
---

# Mục tiêu
Đảm bảo thay đổi API có hợp đồng rõ ràng, tương thích client, có tài liệu (Swagger) và có test phù hợp.

# Khi dùng
- Thêm endpoint mới hoặc sửa response/request shape.
- Cần versioning API hoặc thay đổi hợp đồng client-server.

# Các bước chính
1. Xác định contract (request/response), status code và lỗi có thể xảy ra.
2. Cập nhật/vẽ sơ đồ cho Swagger (`src/config/swagger.ts`) nếu có.
3. Thực hiện thay đổi ở `src/routes/*`, `src/controllers/*`, `src/services/*`.
4. Cập nhật model nếu cần (`src/models/*`).
5. Thêm integration test cho endpoint (jest/supertest).
6. Cập nhật client wrappers (`client/src/api/*`) và chạy smoke test client.

# Checklist
- [ ] Contract rõ ràng (fields, types, required/optional)
- [ ] Swagger cập nhật (nếu dùng)
- [ ] Tests cho endpoint đã thêm
- [ ] Client wrapper cập nhật
- [ ] Migrations DB (nếu thay schema) đã chuẩn bị

# Tệp cần kiểm tra
- `src/routes/` (route registration)
- `src/controllers/` (handler logic)
- `src/services/` (business logic)
- `src/models/` (schema)
- `src/config/swagger.ts`
- `client/src/api/*`

# Lưu ý
- Khi thay đổi contract: communicate rõ trong PR và bổ sung backward compatibility nếu cần.

---
