// this is a client component
// for this you need to install the next-client-cookies package or it won't work
"use client";
import React from "react";
import { useCookies } from "next-client-cookies";
import { gql, useQuery } from "@apollo/client";

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

const Home = () => {
  // getting the cookies
  const cookies = useCookies();

  // extracting our cookie
  const jwtToken: string | undefined = cookies.get("jwtToken");

  const { data, loading } = useQuery(USER_QUERY, {
    context: {
      headers: {
        Authorization: `Bearer ${jwtToken ? JSON.parse(jwtToken!) : ""}`,
      },
    },
  });

  if (loading) {
    return <div>loading.....</div>;
  }

  if (!jwtToken) {
    return <h1>Not Authenticated (Client)</h1>;
  }

  return (
    <>
      <h1>{data?.user?.firstName}</h1>
      <h2>{data?.user?.email}</h2>
    </>
  );
};

export default Home;
