import React, { useEffect, useState } from "react";
import { UserProfile } from "@workspace/api-client-react";
import { getAuthHeaders } from "./apiHeaders";
import { AuthContext, useAuth } from "./authContext";

export { useAuth };

function loadPersistedUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem("tutorsphere_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(loadPersistedUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("tutorsphere_token");
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
        localStorage.setItem("tutorsphere_user", JSON.stringify(profile));
      })
      .catch(() => {
        localStorage.removeItem("tutorsphere_token");
        localStorage.removeItem("tutorsphere_user");
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = (token: string, profile: UserProfile) => {
    localStorage.setItem("tutorsphere_token", token);
    localStorage.setItem("tutorsphere_user", JSON.stringify(profile));
    setUser(profile);
  };

  const logout = () => {
    localStorage.removeItem("tutorsphere_token");
    localStorage.removeItem("tutorsphere_user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, getAuthHeaders }}>
      {children}
    </AuthContext.Provider>
  );
}
