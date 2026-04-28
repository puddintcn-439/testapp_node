---
name: monitoring-ops
user-invocable: true
description: "**WORKFLOW SKILL** — Hướng dẫn giám sát, logging và vận hành production. Use when: thêm logging, health checks, error reporting. Keywords: monitoring, logging, health, Sentry, metrics, alerts"
---

# Mục tiêu
Thiết lập observability: logging có cấu trúc, health checks, error reporting và alerting.

# Khi dùng
- Thêm logging/metrics cho endpoint quan trọng.
- Cấu hình error reporting (Sentry) hoặc alerting.

# Các bước chính
1. Thêm health endpoint (`/health` hoặc `/status`) trả trạng thái cơ bản.
2. Thiết lập logging có mức (info/warn/error) và correlation id nếu cần.
3. Cấu hình external error-tracking (Sentry) và secrets tương ứng.
4. Thiết lập metrics (Prometheus/Datadog) hoặc simple uptime checks.
5. Đặt alert cho lỗi 5xx hoặc latency vượt ngưỡng.

# Checklist
- [ ] Health endpoint tồn tại
- [ ] Errors được ghi lại có stack trace
- [ ] Alerts đã cấu hình cho production

---
