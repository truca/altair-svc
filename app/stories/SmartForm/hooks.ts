import { DocumentNode, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  getFormMutationForType,
  getFormQueryForType,
} from "./getQueriesForType";
import pluralize from "pluralize";

export function useSmartFormFields({
  formQuery,
  id,
  entityType,
  formMutation,
}: {
  formQuery: DocumentNode;
  id?: string;
  entityType: string;
  formMutation: DocumentNode;
}) {
  const formQueryType = pluralize.isSingular(entityType)
    ? entityType
    : pluralize.singular(entityType);
  const { loading, error, data } = useQuery<
    any,
    { id?: string; type: string; include: boolean }
  >(formQuery, {
    variables: { id, type: formQueryType.toUpperCase(), include: Boolean(id) },
  });

  const [mutate, mutationResult] = useMutation(formMutation);

  return { mutate, mutationResult, loading, error, data };
}

export function useSmartFormQueries(entityType: string, id?: string) {
  const [formQuery, setFormQuery] = useState<DocumentNode | null>(null);
  const [formMutation, setFormMutation] = useState<DocumentNode | null>(null);

  useEffect(() => {
    (async () => {
      const lowercaseEntityType = entityType.toLowerCase();
      const singularType = pluralize.isSingular(lowercaseEntityType)
        ? lowercaseEntityType
        : pluralize.singular(lowercaseEntityType);
      const pluralType = pluralize(singularType);
      const [{ query: tempQuery }, tempFormMutation] = await Promise.all([
        getFormQueryForType(singularType),
        getFormMutationForType(pluralType, id),
      ]);
      setFormQuery(tempQuery);
      setFormMutation(tempFormMutation);
    })();
  }, [id, entityType]);

  return { formQuery, formMutation };
}
