import { createContext, useContext } from "react";
import { UserProfile } from "@workspace/api-client-react";

export interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  getAuthHeaders: () => Record<string, string>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
