"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { useHandleAuthStateChange } from "../components/LoginForm";
import { useRouter } from "next/navigation";
import { gql, useMutation } from "@apollo/client";

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
  const [user, setUser] = useState(null);
  const [mutate, mutationResult] = useMutation(authenticationMutation);
  useHandleAuthStateChange({
    onLogin: async (user) => {
      const { displayName, email, photoURL, uid, phoneNumber } = user;
      console.log({ user, displayName, email, photoURL, uid, phoneNumber });
      setUser(user);
      await mutate({ variables: { ...user } });
      console.log({ mutationResult });
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
