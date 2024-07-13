"use client";

import { DocumentNode } from "@apollo/client";
import { Form, FormProps } from "../Form";
import { getFormFieldsFromFormQueryResults } from "./helpers";
import { useSmartFormFields, useSmartFormQueries } from "./hooks";
import { Direction } from "../Form/types";

interface SmartFormProps
  extends Omit<FormProps, "fields" | "onSubmit" | "direction"> {
  // if id is passed, it'll update, otherwise it'll create
  id?: string;
  entityType: string;
  formQuery: DocumentNode;
  formMutation: DocumentNode;
  direction?: Direction;
  onSubmit?: (data: any) => void;
}

function SmartForm({
  id,
  entityType,
  formQuery,
  formMutation,
  direction = Direction.COLUMN,
  onSubmit = () => {},
  ...formProps
}: SmartFormProps) {
  const { mutate, loading, error, data } = useSmartFormFields({
    id,
    entityType,
    formQuery,
    formMutation,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {JSON.stringify(error)}</p>;

  const fields = getFormFieldsFromFormQueryResults(data, entityType);

  return (
    <Form
      {...formProps}
      direction={direction}
      fields={fields}
      onSubmit={async (data) => {
        await mutate({ variables: { id, ...data } });
        onSubmit(data);
      }}
    />
  );
}

export type SmartFormWrapperProps = Omit<
  SmartFormProps,
  "formQuery" | "formMutation"
>;

function SmartFormWrapper(props: SmartFormWrapperProps) {
  const { id, entityType } = props;
  const { formQuery, formMutation } = useSmartFormQueries(entityType, id);

  if (!formQuery || !formMutation) return <p>Query Loading...</p>;

  return (
    <SmartForm {...props} formQuery={formQuery} formMutation={formMutation} />
  );
}

export { SmartFormWrapper };
export default SmartFormWrapper;
