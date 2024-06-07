import { DocumentNode, gql, useQuery } from "@apollo/client";
import { Form, FormProps } from "../Form";
import { FieldValidation } from "../Form/types";
import { useEffect, useState } from "react";
import { getQueryForType } from "./getQueriesForType";

interface SmartFormProps extends FormProps {
  // if id is passed, it'll update, otherwise it'll create
  id?: string;
  entityType: string;
  formQuery: DocumentNode;
}

enum ValueType {
  STRING = "STRING",
  BOOLEAN = "BOOLEAN",
  NUMBER = "NUMBER",
}

interface ServerFieldValidation {
  label: string;
  value: string;
  valueType: ValueType;
  errorMessage: String;
}

function parseValidation(
  validations: ServerFieldValidation[]
): FieldValidation {
  return validations.reduce((acc, validation) => {
    const value = (() => {
      switch (validation.valueType) {
        case ValueType.STRING:
          return validation.value;
        case ValueType.BOOLEAN:
          return validation.value === "true";
        case ValueType.NUMBER:
          return Number(validation.value);
      }
    })();
    return {
      ...acc,
      [validation.label]: [value, validation.errorMessage],
    };
  }, {} as FieldValidation);
}

function SmartForm({
  id,
  entityType,
  formQuery,
  ...formProps
}: SmartFormProps) {
  const { loading, error, data } = useQuery<
    any,
    { id?: string; type: string; include: boolean }
  >(formQuery, { variables: { id, type: entityType, include: Boolean(id) } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {JSON.stringify(error)}</p>;

  const entityName = entityType.toLowerCase();
  const fields = data.form.fields.map((field: any) => ({
    ...field,
    id: field.label,
    type: field.type.toLowerCase(),
    defaultValue: data?.[entityName]?.[field.label],
    validation: parseValidation(field.validation),
  }));
  return <Form {...formProps} fields={fields} />;
}

function SmartFormWrapper({
  entityType,
  ...formProps
}: Omit<SmartFormProps, "formQuery">) {
  const [formQuery, setFormQuery] = useState<DocumentNode | null>(null);

  useEffect(() => {
    (async () => {
      const { query: tempQuery } = await getQueryForType(
        entityType.toLowerCase()
      );
      setFormQuery(tempQuery);
    })();
  }, [entityType]);

  if (!formQuery) return <p>Query Loading...</p>;

  return (
    <SmartForm entityType={entityType} {...formProps} formQuery={formQuery} />
  );
}

export { SmartFormWrapper };
export default SmartFormWrapper;
