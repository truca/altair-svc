import React, { useEffect, useState } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  DocumentNode,
} from "@apollo/client";
import { getQueryForType } from "./getQueryForType";
import {
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Button } from "../Button";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

function DisplayList({
  query,
  type,
  fieldNames,
}: {
  query: DocumentNode;
  type: string;
  fieldNames: string[];
}) {
  const { loading, error, data } = useQuery<any>(query);

  if (loading) return <p>Loading...</p>;
  if (error && !data) return <p>Error : {error.message}</p>;

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            {fieldNames.map((fieldName) => (
              <Th key={fieldName}>{fieldName}</Th>
            ))}
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data[type].map((elem: any) => (
            <Tr key={elem.id}>
              {fieldNames.map((fieldName) => (
                <Td key={fieldName}>{elem[fieldName]}</Td>
              ))}
              <Td>
                <Button primary label="Remove" />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

interface ListProps {
  type: string;
}

export function SmartList({ type }: ListProps) {
  const [query, setQuery] = useState<DocumentNode | null>(null);
  const [fieldNames, setFieldNames] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const { query, fieldNames } = await getQueryForType(type);
      setQuery(query);
      setFieldNames(fieldNames ?? []);
    })();
  }, [type]);

  if (!query) return <p>Query Loading...</p>;

  return (
    <ApolloProvider client={client}>
      <DisplayList query={query} type={type} fieldNames={fieldNames} />
    </ApolloProvider>
  );
}
