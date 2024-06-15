import React, { useEffect, useState } from "react";
import {
  ApolloClient,
  InMemoryCache,
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
  useToast,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";
import SideForm from "../SideForm";
import { Direction } from "../Form/types";
import pluralize from "pluralize";
import SmartSideForm from "../SmartSideForm";

export enum ControlType {
  PageSize,
  Page,
}

export enum SubFormType {
  Sidebar = "sidebar",
  Modal = "modal",
  Page = "page",
}

export interface SmartListProps {
  query: DocumentNode;
  removeMutation: DocumentNode;
  pluralType: string;
  fieldNames: string[];
  controls?: ControlType[];
  initialPage?: number;
  initialPageSize?: number;
  subFormType?: SubFormType;
}

function SmartList({
  query,
  removeMutation,
  pluralType,
  fieldNames,
  initialPage = 1,
  initialPageSize = 5,
  controls = [ControlType.Page, ControlType.PageSize],
  subFormType = SubFormType.Sidebar,
}: SmartListProps) {
  const toast = useToast();
  const [page, setPage] = useState(initialPage);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [subFormDocumentId, setSubFormDocumentId] = useState<
    string | undefined
  >(undefined);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [maxPages, setMaxPages] = useState(5);
  const [hasSetMaxPages, setHasSetMaxPages] = useState(false);
  const { loading, error, data, refetch } = useQuery<
    any,
    { page: number; pageSize: number; includeMaxPages: boolean }
  >(query, { variables: { page, pageSize, includeMaxPages: !hasSetMaxPages } });
  const [removeElement, { data: removeData }] = useMutation(removeMutation); // , { data, loading, error }

  useEffect(() => {
    if (!hasSetMaxPages && data?.[pluralType]) {
      setHasSetMaxPages(true);
      setMaxPages(data?.[pluralType]?.maxPages || 10);
    }
  }, [data, hasSetMaxPages, pluralType]);

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
      <Button
        alignSelf="flex-end"
        onClick={() => {
          onOpen();
          setSubFormDocumentId(undefined);
        }}
      >
        Create
      </Button>
      <SmartSideForm
        entityType={pluralType}
        id={subFormDocumentId}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={() => {
          if (subFormDocumentId) {
            // edit
            toast({
              title: "Element updated.",
              description: "We've updated the element for you.",
              status: "success",
              duration: 4000,
              isClosable: true,
            });
          } else {
            // create
            toast({
              title: "Element created.",
              description: "We've created the element for you.",
              status: "success",
              duration: 4000,
              isClosable: true,
            });
          }
          refetch();
          onClose();
        }}
      />
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
            {data[pluralType].list.map((elem: any) => (
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
                      cursor="pointer"
                      icon={<EditIcon />}
                      onClick={() => {
                        onOpen();
                        setSubFormDocumentId(elem.id);
                      }}
                    />
                    <IconButton
                      size="sm"
                      variant="outline"
                      colorScheme="red"
                      aria-label="Remove"
                      cursor="pointer"
                      icon={<DeleteIcon />}
                      onClick={async () => {
                        const res = await removeElement({
                          variables: { id: elem.id },
                        });
                        if (res.data.removed) {
                          toast({
                            title: "Element deleted.",
                            description: "We've deleted the element for you.",
                            status: "success",
                            duration: 4000,
                            isClosable: true,
                          });
                        } else {
                          toast({
                            title: "Element not deleted.",
                            description:
                              "We couldn't delete the element for you.",
                            status: "error",
                            duration: 4000,
                            isClosable: true,
                          });
                        }
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
              onChange={(e) => {
                setPageSize(Number((e.target as HTMLSelectElement).value));
                setPage(1);
                setHasSetMaxPages(false);
              }}
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
                onClick={isFirstPage ? undefined : () => setPage(page - 1)}
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
                onClick={isLastPage ? undefined : () => setPage(page + 1)}
              />
            </ButtonGroup>
          )}
        </HStack>
      )}
    </VStack>
  );
}

export interface SmartListWrapperProps
  extends Omit<
    SmartListProps,
    "query" | "removeMutation" | "fieldNames" | "pluralType"
  > {
  // singularType: string;
  entityType: string;
}

export function SmartListWrapper(props: SmartListWrapperProps) {
  const { entityType: singularType } = props;
  const pluralType = pluralize(singularType);
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
    <SmartList
      query={query}
      removeMutation={removeMutation}
      fieldNames={fieldNames}
      pluralType={pluralType}
      {...props}
    />
  );
}
