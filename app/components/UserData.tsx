"use client";

import { HStack } from "@chakra-ui/react";
import LoginForm from "../components/LoginForm";
import Profile from "../components/Profile";
import { useAuth } from "../contexts/AuthProvider";

export default function UserData() {
  const { user } = useAuth();

  return (
    <HStack spacing={8}>
      {user ? <Profile user={user} /> : <LoginForm />}
    </HStack>
  );
}
