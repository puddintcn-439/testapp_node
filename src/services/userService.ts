import { dbQuery, DB_TYPE } from "../config/db";
import { User } from "../models/user";

export async function getAllUsers(): Promise<User[]> {
  return dbQuery("SELECT id, name, email FROM users ORDER BY id");
}

export async function getUserById(id: number): Promise<User | null> {
  const rows = await dbQuery(
    "SELECT id, name, email FROM users WHERE id = $1",
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
}

export async function createUser(name: string, email: string): Promise<User> {
  if (DB_TYPE === "mssql") {
    const rows = await dbQuery(
      "INSERT INTO users(name,email) OUTPUT inserted.id, inserted.name, inserted.email VALUES ($1,$2)",
      [name, email]
    );
    return rows[0];
  } else {
    const rows = await dbQuery(
      "INSERT INTO users(name,email) VALUES($1,$2) RETURNING id, name, email",
      [name, email]
    );
    return rows[0];
  }
}

export async function updateUser(
  id: number,
  name?: string,
  email?: string
): Promise<User | null> {
  if (DB_TYPE === "mssql") {
    const rows = await dbQuery(
      "UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email) OUTPUT inserted.id, inserted.name, inserted.email WHERE id = $3",
      [name, email, id]
    );
    return rows.length > 0 ? rows[0] : null;
  } else {
    const rows = await dbQuery(
      "UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email) WHERE id = $3 RETURNING id, name, email",
      [name, email, id]
    );
    return rows.length > 0 ? rows[0] : null;
  }
}

export async function deleteUser(id: number): Promise<User | null> {
  if (DB_TYPE === "mssql") {
    const rows = await dbQuery(
      "DELETE FROM users OUTPUT deleted.id, deleted.name, deleted.email WHERE id = $1",
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  } else {
    const rows = await dbQuery(
      "DELETE FROM users WHERE id = $1 RETURNING id, name, email",
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }
}
