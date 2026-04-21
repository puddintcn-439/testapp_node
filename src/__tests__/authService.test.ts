import * as authService from "../services/authService";
import * as userService from "../services/userService";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../services/userService");

describe("authService", () => {
  beforeEach(() => jest.resetAllMocks());

  test("register throws if user exists", async () => {
    (userService.getUserByEmail as unknown as jest.Mock).mockResolvedValue({ id: 1, name: "x", email: "a@b.com" });
    await expect(authService.register("name", "a@b.com", "pass")).rejects.toThrow("User exists");
  });

  test("register creates user and returns token", async () => {
    (userService.getUserByEmail as unknown as jest.Mock).mockResolvedValue(null);
    (userService.createUser as unknown as jest.Mock).mockResolvedValue({ id: 2, name: "n", email: "e" });
    const res = await authService.register("n", "e", "p");
    expect(res.user.id).toBe(2);
    expect(typeof res.token).toBe("string");
    const decoded = jwt.verify(res.token, process.env.JWT_SECRET || "dev-secret") as any;
    expect(decoded.userId).toBe(2);
  });

  test("login returns token when password matches", async () => {
    const hash = await bcrypt.hash("secret", 10);
    (userService.getUserByEmail as unknown as jest.Mock).mockResolvedValue({ id: 3, name: "u", email: "u@u.com", password_hash: hash });
    const res = await authService.login("u@u.com", "secret");
    expect(res.user.id).toBe(3);
    expect(typeof res.token).toBe("string");
  });

  test("login throws on invalid credentials", async () => {
    (userService.getUserByEmail as unknown as jest.Mock).mockResolvedValue(null);
    await expect(authService.login("x", "y")).rejects.toThrow();
  });
});
