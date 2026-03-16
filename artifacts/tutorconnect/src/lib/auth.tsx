import React, { createContext, useContext, useEffect, useState } from "react";
import { useGetMe, UserProfile } from "@workspace/api-client-react";
import { useLocation } from "wouter";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  getAuthHeaders: () => Record<string, string>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("tutorconnect_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("tutorconnect_token"));
  const [, setLocation] = useLocation();

  const { data: user, isLoading, refetch } = useGetMe({
    request: { headers: getAuthHeaders() },
    query: {
      enabled: !!token,
      retry: false,
    },
  });

  const login = (newToken: string) => {
    localStorage.setItem("tutorconnect_token", newToken);
    setToken(newToken);
    refetch();
  };

  const logout = () => {
    localStorage.removeItem("tutorconnect_token");
    setToken(null);
    setLocation("/login");
  };

  return (
    <AuthContext.Provider value={{ user: user || null, isLoading, login, logout, getAuthHeaders }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
