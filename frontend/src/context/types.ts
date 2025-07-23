export type AuthAction =
  | { type: "LOGIN"; payload: { user: string } }
  | { type: "LOGOUT" };
