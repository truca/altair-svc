"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useHandleAuthStateChange } from "../components/LoginForm";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
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

const meQuery = gql`
  query Me($uid: String) {
    me(uid: $uid) {
      id
      uid
      username
      profilePicture
      lat
      lng
      createdAt
      updatedAt
      favoriteWarbands {
        id
      }
      favoriteCards {
        id
      }
      collection {
        id
      }
      participatedEvents {
        id
      }
      wonMatches {
        id
      }
      wonTournaments {
        id
      }
    }
  }
`;

interface AuthContextProps {
  user: any | null; // You can define a better User type
  profile: any | null;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { cookies, setCookie } = useCookies();
  const [user, setUser] = useState<any | null>(true);
  const [mutate] = useMutation(authenticationMutation);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [getMe, { loading, data, error }] = useLazyQuery(meQuery);

  useEffect(() => {
    console.log("userr", { user });
    if (user) {
      getMe({ variables: { uid: user.uid } });
    }
  }, [user]);

  useHandleAuthStateChange({
    onLogin: async (user) => {
      setUser(user);
      if (cookies?.token) return;
      const result = await mutate({ variables: { ...user } });
      setCookie("token", result.data.authenticate, 1);

      if (pathname === "/login") {
        // const redirect = searchParams.get("redirect");
        // router.push(redirect || "/");
      }
    },
    onLogout: () => {
      setUser(null);
      // router.push(
      //   pathname !== "/login" ? `/login?redirect=${pathname}` : "/login"
      // );
    },
  });

  return (
    <AuthContext.Provider value={{ user, profile: data?.me }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export default AuthProvider;
