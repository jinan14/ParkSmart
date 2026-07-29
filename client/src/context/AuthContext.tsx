import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as authApi from "../api/auth";
import type { LoginInput, RegisterInput, User } from "../types/user";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "parksmart_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi
      .me(token)
      .then(({ user }) => setUser(user))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  function applyAuth(newToken: string, newUser: User) {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(newUser);
  }

  async function login(input: LoginInput) {
    const { token, user } = await authApi.login(input);
    applyAuth(token, user);
  }

  async function register(input: RegisterInput) {
    const { token, user } = await authApi.register(input);
    applyAuth(token, user);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
