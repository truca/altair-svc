import { VStack } from "@chakra-ui/react";
import LoginForm from "../components/LoginForm";

export default function Login() {
  return (
    <VStack spacing={8}>
      <LoginForm />
    </VStack>
  );
}
