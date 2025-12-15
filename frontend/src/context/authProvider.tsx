import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./auth.context";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const login = (t: string) => {
    localStorage.setItem("token", t);
    setToken(t);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAdmin: !!token, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
