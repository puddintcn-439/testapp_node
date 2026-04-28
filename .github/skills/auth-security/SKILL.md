---
name: auth-security
user-invocable: true
description: "**WORKFLOW SKILL** — Hướng dẫn thêm/kiểm tra chức năng xác thực và hardening bảo mật. Use when: xử lý login/register, token, password, session, secrets. Keywords: auth, jwt, register, login, localStorage, token, src/services, src/controllers"
---

# Mục tiêu
Đảm bảo luồng xác thực an toàn, xử lý token đúng cách, và giảm rủi ro bảo mật khi đưa lên production.

# Khi dùng
- Thêm/điều chỉnh login, register, reset password, refresh token.
- Cần kiểm tra lưu trữ token client-side hoặc policy CORS.

# Các bước chính
1. Xem hiện trạng: `client/src/components/*` (localStorage token), `src/services/authService.ts`, `src/controllers/authController.ts`.
2. Lưu secrets trong env vars (ví dụ `JWT_SECRET`), không commit vào repo.
3. Sử dụng short-lived access token + refresh token nếu cần.
4. Thêm checks: password hashing (`bcryptjs`), rate-limiting (throttling), account lockouts.
5. Kiểm thử: unit tests + integration tests cho luồng auth.
6. Kiểm tra XSS/CSRF: nếu dùng cookies, áp dụng SameSite/HTTPOnly/secure; nếu token trong localStorage, đảm bảo XSS giảm thiểu.

# Checklist
- [ ] Secrets trong env, không commit
- [ ] Password hash & salt
- [ ] HTTPS enforced trên production
- [ ] Token invalidation/revocation có phương án
- [ ] Rate limiting cho endpoint nhạy cảm

# Tệp cần kiểm tra
- `src/controllers/authController.ts`
- `src/services/authService.ts`
- `client/src/api/authApi.ts`
- `client/src/components/LoginForm.tsx`

---
