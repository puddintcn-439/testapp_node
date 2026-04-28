---
name: frontend-feature-development
user-invocable: true
description: "**WORKFLOW SKILL** — Hướng dẫn phát triển tính năng UI (React + Vite). Use when: thêm/chỉnh sửa component, form, page hoặc client API. Keywords: LoginForm, RegisterForm, UserForm, UserTable, client/src/components, vite, npm run dev"
---

# Mục tiêu
Hỗ trợ dev thực hiện tính năng UI dựa trên code UI hiện có, đảm bảo chất lượng, test và sẵn sàng đưa lên production.

# Khi dùng
- Thêm hoặc sửa component React trong `client/src/components`.
- Thêm form, validation, hoặc logic client-side.
- Cập nhật các gọi API từ client (`client/src/api`).

# Các bước chính
1. Khảo sát UI hiện có: kiểm tra `client/src/components/*` và `client/src/api/*`.
2. Thiết kế thay đổi: xác định props, state và side-effects (localStorage token, redirect).
3. Thực hiện thay đổi tại component, giữ API wrapper tách rời trong `client/src/api`.
4. Thêm/điền unit tests cho component (nếu có thiết lập), hoặc thêm smoke test.
5. Chạy dev & kiểm thử thủ công:

```bash
cd client
npm install
npm run dev
# backend dev (từ root):
npm run dev
# hoặc toàn bộ:
npm run dev:all
```

6. Chạy build production client:

```bash
cd client
npm run build
```

7. Tạo PR với mô tả, ảnh chụp màn hình, và checklist đã hoàn thành.

# Checklist trước PR
- [ ] Component hoạt động trên kích thước màn hình chính (responsive)
- [ ] Validation client hợp lý
- [ ] Không có console.error không mong muốn
- [ ] Unit / integration tests (nếu cần) đã thêm và chạy
- [ ] Build `npm run build` thành công
- [ ] Mô tả PR + hướng dẫn thử nghiệm

# Tệp cần kiểm tra
- `client/src/components/LoginForm.tsx`
- `client/src/components/RegisterForm.tsx`
- `client/src/components/UserForm.tsx`
- `client/src/components/UserTable.tsx`
- `client/src/api/*` (gọi API)
- `client/package.json`

# Ví dụ ngắn
- Thay đổi API endpoint: cập nhật wrapper trong `client/src/api/authApi.ts` rồi chỉ gọi wrapper từ component.
- Lưu token: hiện code dùng `localStorage.setItem('token', token)` — cân nhắc refresh token nếu cần.

---
