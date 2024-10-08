"use client";

import { VStack, Button, Input, Heading, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getAuth,
  signInWithPopup,
  FacebookAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";
import { app } from "../firebase";
import { noop } from "../constants";

interface UseHandleAuthStateChangeArgs {
  onLogin?: (user: any | undefined) => void;
  onLogout?: () => void;
}

export const useHandleAuthStateChange = ({
  onLogin,
  onLogout,
}: UseHandleAuthStateChangeArgs) => {
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        onLogin?.(user);
        return;
      }
      onLogout?.();
    });

    return () => unsubscribe();
  }, []);
};

const FacebookLoginButton = ({
  handleOnLogin,
}: {
  handleOnLogin?: (user: any | undefined) => void;
}) => {
  const router = useRouter();
  const auth = getAuth(app);
  const provider = new FacebookAuthProvider();
  const toast = useToast();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      // Redirect is handled in the auth state listener below
    } catch (error) {
      //   console.error("Error during Facebook login:", error);
      toast({
        title: "Login failed",
        description: (error as any).message,
        status: "error",
        position: "top-right",
      });
    }
  };

  const onLogin = handleOnLogin ? handleOnLogin : noop;
  useHandleAuthStateChange({
    onLogin,
  });

  return (
    <Button onClick={handleLogin} colorScheme="facebook">
      Login with Facebook
    </Button>
  );
};

const GoogleLoginButton = ({
  handleOnLogin,
}: {
  handleOnLogin?: (user: any | undefined) => void;
}) => {
  const router = useRouter();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      // Redirect will be handled in the auth state listener below
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  const onLogin = handleOnLogin
    ? handleOnLogin
    : (user: any | undefined) => router.push("/");
  useHandleAuthStateChange({
    onLogin,
  });

  return (
    <Button onClick={handleLogin} colorScheme="blue">
      Login with Google
    </Button>
  );
};

const LoginForm = () => {
  const { loginWithEmail } = useFirebaseAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const router = useRouter();

  const handleEmailLogin = async () => {
    try {
      await loginWithEmail(email, password);
      toast({
        title: "Logged in successfully",
        status: "success",
        position: "top-right",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: (error as any).message,
        status: "error",
        position: "top-right",
      });
    }
  };

  useHandleAuthStateChange({ onLogin: noop });

  return (
    <VStack spacing={4} align="stretch">
      <Heading>Login</Heading>
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleEmailLogin} colorScheme="teal">
        Login with Email
      </Button>
      <GoogleLoginButton handleOnLogin={noop} />
      <FacebookLoginButton handleOnLogin={noop} />
    </VStack>
  );
};

export default LoginForm;
