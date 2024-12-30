import { gql, useMutation } from "@apollo/client";
import { useAuth } from "@/app/contexts/AuthProvider";

const addWarbandToFavoritesMutation = gql`
  mutation UpdateMe($id: String!, $favoriteWarbands: [ObjectId]) {
    updateMe(id: $id, profile: { favoriteWarbands: $favoriteWarbands }) {
      id
      favoriteWarbands {
        id
      }
    }
  }
`;

export function useFavoriteWarbands() {
  const { profile } = useAuth();
  const { id: profileId } = profile || {};
  const [addWarbandToFavorites] = useMutation(addWarbandToFavoritesMutation);

  return { addWarbandToFavorites, profileId };
}
