"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { useHandleAuthStateChange } from "../components/LoginForm";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { gql, useMutation } from "@apollo/client";
import { useCookies } from "../hooks/useCookies";

const authenticationMutation = gql`
  mutation Authenticate(
    $uid: String
    $displayName: String
    $email: String
    $photoURL: String
    $phoneNumber: String
    $emailVerified: Boolean
    $isAnonymous: Boolean
  ) {
    authenticate(
      uid: $uid
      displayName: $displayName
      email: $email
      photoURL: $photoURL
      phoneNumber: $phoneNumber
      emailVerified: $emailVerified
      isAnonymous: $isAnonymous
    )
  }
`;

interface AuthContextProps {
  user: any | null; // You can define a better User type
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { cookies, setCookie } = useCookies();
  const [user, setUser] = useState(null);
  const [mutate] = useMutation(authenticationMutation);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useHandleAuthStateChange({
    onLogin: async (user) => {
      if (cookies?.token) return;
      setUser(user);
      const result = await mutate({ variables: { ...user } });
      setCookie("token", result.data.authenticate, 1);

      if (pathname === "/login") {
        const redirect = searchParams.get("redirect");
        router.push(redirect || "/");
      }
    },
    onLogout: () => {
      setUser(null);
      router.push(
        pathname !== "/login" ? `/login?redirect=${pathname}` : "/login"
      );
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
