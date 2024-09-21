"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { useHandleAuthStateChange } from "../components/LoginForm";
import { useRouter } from "next/navigation";

interface AuthContextProps {
  user: any | null; // You can define a better User type
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  useHandleAuthStateChange({
    onLogin: (user) => {
      setUser(user);
      router.push("/");
    },
    onLogout: () => {
      setUser(null);
      router.push("/login");
    },
  });

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export default AuthProvider;
