import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { User, UserRole } from "./types";
import { MOCK_USERS } from "./data";

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem("sms_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((email: string, password: string): boolean => {
    const found = MOCK_USERS.find((u) => u.email === email && u.password === password && u.active);
    if (found) {
      setUser(found);
      sessionStorage.setItem("sms_user", JSON.stringify(found));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem("sms_user");
  }, []);

  const hasRole = useCallback((...roles: UserRole[]): boolean => {
    return user ? roles.includes(user.type) : false;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useDashboardRoute(): string {
  const { user } = useAuth();
  if (!user) return "/login";
  return `/${user.type}/dashboard`;
}
