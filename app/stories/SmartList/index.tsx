"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery, DocumentNode, useMutation } from "@apollo/client";
import {
  getQueryForType,
  getRemoveMutationForType,
  Where,
} from "./getQueriesForType";
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
  Box,
} from "@chakra-ui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
  EditIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import pluralize from "pluralize";
import SmartSideForm from "../SmartSideForm";
import Sidebar from "../Sidebar";
import SmartItemRenderer from "../SmartItemRenderer";
import ItemRenderer from "../ItemRenderer";
import { SectionsHash } from "@/app/components";

export type ControlType = "page" | "pageSize" | "create";

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

  where?: Where;

  itemProps?: any;
  itemMap?: (elem: any) => any;

  containerSx?: React.CSSProperties | undefined;
  itemComponent?: string;
  listContainerSx?: React.CSSProperties | undefined;
  bottomControlSx?: React.CSSProperties | undefined;
}

function SmartList({
  query,
  removeMutation,
  pluralType,
  fieldNames,
  initialPage = 1,
  initialPageSize = 5,
  controls = ["create", "page", "pageSize"],
  subFormType = SubFormType.Sidebar,

  where = {},

  itemProps,
  itemMap,

  containerSx,
  itemComponent,
  listContainerSx,
  bottomControlSx,
}: SmartListProps) {
  const toast = useToast();
  const [page, setPage] = useState(initialPage);
  const {
    isOpen: isItemFormOpen,
    onOpen: onItemFormOpen,
    onClose: onItemFormClose,
  } = useDisclosure();
  const {
    isOpen: isItemViewOpen,
    onOpen: onItemViewOpen,
    onClose: onItemViewClose,
  } = useDisclosure();
  const [subFormDocumentId, setSubFormDocumentId] = useState<
    string | undefined
  >(undefined);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [maxPages, setMaxPages] = useState(5);
  const [hasSetMaxPages, setHasSetMaxPages] = useState(false);
  const { loading, error, data, refetch } = useQuery<
    any,
    { page: number; pageSize: number; includeMaxPages: boolean; where: Where }
  >(query, {
    variables: { page, pageSize, includeMaxPages: !hasSetMaxPages, where },
  });
  const [removeElement, { data: removeData }] = useMutation(removeMutation); // , { data, loading, error }

  useEffect(() => {
    if (!hasSetMaxPages && data?.[pluralType]) {
      setHasSetMaxPages(true);
      setMaxPages(data?.[pluralType]?.maxPages || 10);
    }
  }, [data, hasSetMaxPages, pluralType]);

  const items = useMemo(() => {
    const itemsWithFilteredFields = data?.[pluralType]?.list?.map(
      (item: Record<string, any>) =>
        fieldNames.reduce((acc, fieldName) => {
          if (typeof item[fieldName] !== "undefined")
            acc[fieldName] = item[fieldName];
          return acc;
        }, {} as Record<string, any>)
    );
    if (itemMap) {
      return itemsWithFilteredFields?.map(itemMap);
    }
    return itemsWithFilteredFields;
  }, [data, itemMap, pluralType, fieldNames]);

  if (loading) return <p>Loading...</p>;
  if (error && !data) return <p>Error : {error.message}</p>;

  const isFirstPage = page === 1;
  const isSecondOrFirstPage = page <= 2;
  const isLastPage = page === maxPages;
  const isSecondLastOrLastPage = page >= maxPages - 1;

  const hasControls = Boolean(controls.length);
  const hasCreateControl = controls.includes("create");
  const hasPageControl = controls.includes("page");
  const hasPageSizeControl = controls.includes("pageSize");

  const ItemComponent = itemComponent ? SectionsHash[itemComponent] : undefined;

  return (
    <VStack style={containerSx}>
      {hasCreateControl && (
        <Button
          alignSelf="flex-end"
          onClick={() => {
            onItemFormOpen();
            setSubFormDocumentId(undefined);
          }}
        >
          Create
        </Button>
      )}
      <SmartSideForm
        entityType={pluralType}
        id={subFormDocumentId}
        isOpen={isItemFormOpen}
        onClose={onItemFormClose}
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
          onItemFormClose();
        }}
      />
      <Sidebar isOpen={isItemViewOpen} onClose={onItemViewClose}>
        <SmartItemRenderer id={subFormDocumentId as any} type={pluralType} />
      </Sidebar>
      {itemComponent && ItemComponent && (
        <Box style={listContainerSx}>
          {items.map((elem: any) => (
            <ItemComponent key={elem.id} {...itemProps} {...elem} />
          ))}
        </Box>
      )}
      {!itemComponent && (
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
              {items.map((elem: any) => (
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
                        aria-label="View"
                        cursor="pointer"
                        icon={<ViewIcon />}
                        onClick={() => {
                          onItemViewOpen();
                          setSubFormDocumentId(elem.id);
                        }}
                      />
                      <IconButton
                        size="sm"
                        variant="outline"
                        colorScheme="teal"
                        aria-label="Edit"
                        cursor="pointer"
                        icon={<EditIcon />}
                        onClick={() => {
                          onItemFormOpen();
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
      )}
      {hasControls && (
        <HStack spacing={4} alignSelf="flex-end" style={bottomControlSx}>
          {hasPageSizeControl && (
            <Select
              size="sm"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number((e.target as HTMLSelectElement).value));
                setPage(1);
                setHasSetMaxPages(false);
              }}
              cursor="pointer"
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
                cursor={isFirstPage ? "not-allowed" : "pointer"}
                colorScheme={isFirstPage ? "gray" : "teal"}
                onClick={isFirstPage ? undefined : () => setPage(page - 1)}
              />
              {!isSecondOrFirstPage && (
                <ChakraButton
                  cursor="pointer"
                  onClick={() => setPage(page - 2)}
                >
                  {page - 2}
                </ChakraButton>
              )}
              {!isFirstPage && (
                <ChakraButton
                  cursor="pointer"
                  onClick={() => setPage(page - 1)}
                >
                  {page - 1}
                </ChakraButton>
              )}
              <ChakraButton
                cursor="pointer"
                colorScheme="teal"
                variant="solid"
                border="none"
              >
                {page}
              </ChakraButton>
              {!isLastPage && (
                <ChakraButton
                  cursor="pointer"
                  onClick={() => setPage(page + 1)}
                >
                  {page + 1}
                </ChakraButton>
              )}
              {!isSecondLastOrLastPage && (
                <ChakraButton
                  cursor="pointer"
                  onClick={() => setPage(page + 2)}
                >
                  {page + 2}
                </ChakraButton>
              )}
              <IconButton
                aria-label="Next page"
                cursor={isLastPage ? "not-allowed" : "pointer"}
                icon={<ChevronRightIcon />}
                disabled={isLastPage}
                colorScheme={isLastPage ? "gray" : "teal"}
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
  fieldNames?: string[];
}

export function SmartListWrapper(props: SmartListWrapperProps) {
  const { entityType: singularType, fieldNames: fieldNamesProp, where } = props;
  const pluralType = pluralize(singularType);
  const [query, setQuery] = useState<DocumentNode | null>(null);
  const [removeMutation, setRemoveMutation] = useState<DocumentNode | null>(
    null
  );
  const [fieldNames, setFieldNames] = useState<string[]>(fieldNamesProp ?? []);

  useEffect(() => {
    (async () => {
      const { query: tempQuery, fieldNames } = await getQueryForType(
        pluralType,
        singularType,
        where,
        fieldNamesProp
      );
      setQuery(tempQuery as any);
      if (!fieldNamesProp) setFieldNames(fieldNames ?? []);
      const { removeMutation: tempRemoveMutation } =
        getRemoveMutationForType(singularType);
      setRemoveMutation(tempRemoveMutation);
    })();
  }, [pluralType, singularType, fieldNamesProp, where]);

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

export default SmartListWrapper;
