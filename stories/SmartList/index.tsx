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
  ButtonGroup,
  Button as ChakraButton,
  HStack,
  IconButton,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Button } from "../Button";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

export enum ControlType {
  PageSize,
  Page,
}

export interface DisplayListProps {
  query: DocumentNode;
  type: string;
  fieldNames: string[];
  controls?: ControlType[];
}

function DisplayList({
  query,
  type,
  fieldNames,
  controls = [ControlType.Page, ControlType.PageSize],
}: DisplayListProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const maxPages = 5;
  const { loading, error, data } = useQuery<
    any,
    { page: number; pageSize: number }
  >(query, { variables: { page, pageSize } });

  if (loading) return <p>Loading...</p>;
  if (error && !data) return <p>Error : {error.message}</p>;

  const isFirstPage = page === 1;
  const isSecondOrFirstPage = page <= 2;
  const isLastPage = page === maxPages;
  const isSecondLastOrLastPage = page >= maxPages - 1;

  const hasControls = Boolean(controls.length);
  const hasPageControl = controls.includes(ControlType.Page);
  const hasPageSizeControl = controls.includes(ControlType.PageSize);
  return (
    <VStack>
      <TableContainer w="100%">
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
      {hasControls && (
        <HStack spacing={4} alignSelf="flex-end">
          {hasPageSizeControl && (
            <Select
              size="sm"
              value={pageSize}
              onChange={(e) =>
                setPageSize(Number((e.target as HTMLSelectElement).value))
              }
              borderRadius={5}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </Select>
          )}
          {hasPageControl && (
            <ButtonGroup size="sm" isAttached variant="outline">
              <IconButton
                aria-label="Previous page"
                icon={<ChevronLeftIcon />}
                disabled={isFirstPage}
                onClick={() => setPage(page - 1)}
              />
              {!isSecondOrFirstPage && (
                <ChakraButton onClick={() => setPage(page - 2)}>
                  {page - 2}
                </ChakraButton>
              )}
              {!isFirstPage && (
                <ChakraButton onClick={() => setPage(page - 1)}>
                  {page - 1}
                </ChakraButton>
              )}
              <ChakraButton>{page}</ChakraButton>
              {!isLastPage && (
                <ChakraButton onClick={() => setPage(page + 1)}>
                  {page + 1}
                </ChakraButton>
              )}
              {!isSecondLastOrLastPage && (
                <ChakraButton onClick={() => setPage(page + 2)}>
                  {page + 2}
                </ChakraButton>
              )}
              <IconButton
                aria-label="Next page"
                icon={<ChevronRightIcon />}
                disabled={isLastPage}
                onClick={() => setPage(page + 1)}
              />
            </ButtonGroup>
          )}
        </HStack>
      )}
    </VStack>
  );
}

export interface SmartListProps
  extends Omit<DisplayListProps, "query" | "fieldNames"> {
  type: string;
}

export function SmartList(props: SmartListProps) {
  const { type } = props;
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
      <DisplayList query={query} fieldNames={fieldNames} {...props} />
    </ApolloProvider>
  );
}
