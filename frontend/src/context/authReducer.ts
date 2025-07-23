export type AuthState = {
  isAuthenticated: boolean;
  user: string | null;
};

export type AuthAction =
  | { type: "LOGIN"; payload: { user: string } }
  | { type: "LOGOUT" };

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return {
        isAuthenticated: true,
        user: action.payload.user,
      };
    case "LOGOUT":
      return {
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
}
