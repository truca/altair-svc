import { HStack, Button, Text } from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthProvider";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";

interface ProfileProps {
  user: any | undefined;
}

const Profile = ({ user }: ProfileProps) => {
  const { logout } = useFirebaseAuth();

  if (!user) return null;

  return (
    <HStack spacing={4}>
      <Text>Welcome, {user.displayName || user.email}</Text>
      <Button onClick={logout} colorScheme="red">
        Logout
      </Button>
    </HStack>
  );
};

export default Profile;
