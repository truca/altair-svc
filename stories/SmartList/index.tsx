import React, { useEffect, useState } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  DocumentNode,
  useMutation,
} from "@apollo/client";
import { getQueryForType, getRemoveMutationForType } from "./getQueriesForType";
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
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";
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
  removeMutation: DocumentNode;
  pluralType: string;
  fieldNames: string[];
  controls?: ControlType[];
  initialPage?: number;
  initialPageSize?: number;
}

function DisplayList({
  query,
  removeMutation,
  pluralType,
  fieldNames,
  initialPage = 1,
  initialPageSize = 5,
  controls = [ControlType.Page, ControlType.PageSize],
}: DisplayListProps) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const maxPages = 5;
  const { loading, error, data, refetch } = useQuery<
    any,
    { page: number; pageSize: number }
  >(query, { variables: { page, pageSize } });
  const [removeElement, { data: removeData }] = useMutation(removeMutation); // , { data, loading, error }

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
            {data[pluralType].map((elem: any) => (
              <Tr key={elem.id}>
                {fieldNames.map((fieldName) => (
                  <Td key={fieldName}>{elem[fieldName]}</Td>
                ))}
                <Td>
                  <HStack spacing={4}>
                    <IconButton
                      size="sm"
                      variant="outline"
                      colorScheme="teal"
                      aria-label="Edit"
                      icon={<EditIcon />}
                      onClick={async () => {
                        await removeElement({ variables: { id: elem.id } });
                        refetch();
                      }}
                    />
                    <IconButton
                      size="sm"
                      variant="outline"
                      colorScheme="red"
                      aria-label="Remove"
                      icon={<DeleteIcon />}
                      onClick={async () => {
                        await removeElement({ variables: { id: elem.id } });
                        refetch();
                      }}
                    />
                  </HStack>
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
            <ButtonGroup
              size="sm"
              isAttached
              variant="outline"
              colorScheme="teal"
            >
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
              <ChakraButton colorScheme="teal" variant="solid">
                {page}
              </ChakraButton>
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
  extends Omit<DisplayListProps, "query" | "removeMutation" | "fieldNames"> {
  singularType: string;
}

export function SmartList(props: SmartListProps) {
  const { pluralType, singularType } = props;
  const [query, setQuery] = useState<DocumentNode | null>(null);
  const [removeMutation, setRemoveMutation] = useState<DocumentNode | null>(
    null
  );
  const [fieldNames, setFieldNames] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const { query: tempQuery, fieldNames } =
        await getQueryForType(pluralType);
      setQuery(tempQuery);
      setFieldNames(fieldNames ?? []);
      const { removeMutation: tempRemoveMutation } =
        getRemoveMutationForType(singularType);
      setRemoveMutation(tempRemoveMutation);
    })();
  }, [pluralType, singularType]);

  if (!query || !removeMutation) return <p>Query Loading...</p>;

  return (
    <ApolloProvider client={client}>
      <DisplayList
        query={query}
        removeMutation={removeMutation}
        fieldNames={fieldNames}
        {...props}
      />
    </ApolloProvider>
  );
}
