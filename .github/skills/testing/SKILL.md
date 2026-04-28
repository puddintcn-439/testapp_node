---
name: testing
user-invocable: true
description: "**WORKFLOW SKILL** — Hướng dẫn viết và chạy unit/integration/e2e tests. Use when: thêm test cho backend hoặc frontend. Keywords: jest, ts-jest, jest.config.cjs, __tests__, npm test"
---

# Mục tiêu
Thiết lập quy trình test đáng tin cậy để giảm regressions trước khi merge.

# Khi dùng
- Thêm unit tests cho service, controller hoặc helpers.
- Thêm integration tests cho endpoint (supertest) hoặc e2e cơ bản cho UI.

# Các bước chính
1. Chạy test hiện tại:

```bash
npm test
```

2. Viết unit tests trong `src/__tests__` hoặc `client/__tests__`.
3. Với endpoint, viết integration test (jest + supertest) khởi server test instance.
4. Chạy test coverage và đảm bảo các test quan trọng có coverage hợp lý.
5. Thêm test command vào CI (pre-merge check).

# Checklist
- [ ] Tests chạy xanh cục bộ
- [ ] Mức coverage phù hợp cho logic quan trọng
- [ ] Tests ổn định (không flaky)
- [ ] Tests chạy trong CI trong thời gian hợp lý

# Tệp cần kiểm tra
- `jest.config.cjs`
- `src/__tests__`, `client/__tests__`

---
