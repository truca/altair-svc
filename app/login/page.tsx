"use client";

import { VStack } from "@chakra-ui/react";
import LoginForm from "../components/LoginForm";
import { useCookies } from "../hooks/useCookies";
import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function Login() {
  const { cookies } = useCookies();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (cookies?.token) {
      const redirect = searchParams.get("redirect");
      router.push(redirect || "/");
    }
  }, [cookies, router, searchParams]);

  return (
    <VStack spacing={8}>
      <LoginForm />
    </VStack>
  );
}
