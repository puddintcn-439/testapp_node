export type User = {
  id: number;
  name: string;
  email: string;
  // optional fields (may be null or omitted when returned to clients)
  password_hash?: string | null;
  created_at?: string | null;
};
