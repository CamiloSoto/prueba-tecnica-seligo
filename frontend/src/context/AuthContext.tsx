import { createContext, useReducer, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import { authReducer, initialAuthState } from "./authReducer";
import type { AuthState } from "./authReducer";
import api from "../services/api";

type AuthContextProps = {
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    if (token && email) {
      dispatch({ type: "LOGIN", payload: { user: email } });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { accessToken, refreshToken } = res.data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("email", email);

      dispatch({ type: "LOGIN", payload: { user: email } });
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Login error", err.message);
      }
      return false;
    }
  };

  const logout = () => {
    localStorage.clear();
    dispatch({ type: "LOGOUT" });
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
