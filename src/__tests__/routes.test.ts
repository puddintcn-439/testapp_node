import request from "supertest";
import { app } from "../index";

describe("routes", () => {
  test("GET /api-docs responds 200", async () => {
    const res = await request(app).get("/api-docs");
    expect(res.status).toBe(200);
  });
});
