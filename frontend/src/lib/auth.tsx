import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile } from "@workspace/api-client-react";
import { getAuthHeaders } from "./apiHeaders";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  getAuthHeaders: () => Record<string, string>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function loadPersistedUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem("tutorconnect_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(loadPersistedUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("tutorconnect_token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((profile: UserProfile) => {
        setUser(profile);
        localStorage.setItem("tutorconnect_user", JSON.stringify(profile));
      })
      .catch(() => {
        localStorage.removeItem("tutorconnect_token");
        localStorage.removeItem("tutorconnect_user");
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = (token: string, profile: UserProfile) => {
    localStorage.setItem("tutorconnect_token", token);
    localStorage.setItem("tutorconnect_user", JSON.stringify(profile));
    setUser(profile);
  };

  const logout = () => {
    localStorage.removeItem("tutorconnect_token");
    localStorage.removeItem("tutorconnect_user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, getAuthHeaders }}>
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
