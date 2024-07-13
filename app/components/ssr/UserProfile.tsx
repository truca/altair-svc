// here is a server component called UserProfile and here we want to get the user data

import { gql } from "@apollo/client";
import { getClient } from "@/lib/apollo/client";
import { cookies } from "next/headers";

const USER_QUERY = gql`
  query Query {
    user {
      id
      firstName
      email
      phone
    }
  }
`;

const UserProfile = async () => {
  const client = getClient();
  const ourCookies = cookies();

  let cookie = await ourCookies.get("jwtToken");
  if (!cookie) {
    return <h1>Not Authenticated (SSR)</h1>;
  }

  let token = cookie!.value;

  let jwtToken = JSON.parse(token);

  const { data } = await client.query({
    query: USER_QUERY,
    context: {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    },
  });
  console.log("🚀 ~ user ~ data:", data?.user);
  return (
    <>
      <h1>{data?.user?.firstName}</h1>
      <h2>{data?.user?.email}</h2>
    </>
  );
};

export default UserProfile;
