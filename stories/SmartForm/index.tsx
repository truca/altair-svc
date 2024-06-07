import { gql, useQuery } from "@apollo/client";
import { Form, FormProps } from "../Form";
import { FieldValidation } from "../Form/types";

interface SmartFormProps extends FormProps {
  // if id is passed, it'll update, otherwise it'll create
  id?: string;
  entityType: string;
}

const formQuery = gql`
  query Form($id: ID, $type: FormType) {
    form(id: $id, type: $type) {
      fields {
        label
        type
        defaultValue
        validation {
          label
          value
          valueType
          errorMessage
        }
      }
    }
  }
`;

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

function SmartForm({ id, entityType, ...formProps }: SmartFormProps) {
  const { loading, error, data } = useQuery<any, { id?: string; type: string }>(
    formQuery,
    { variables: { id, type: entityType } }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {JSON.stringify(error)}</p>;

  const fields = data.form.fields.map((field: any) => ({
    ...field,
    id: field.label,
    type: field.type.toLowerCase(),
    validation: parseValidation(field.validation),
  }));
  console.log({ data, fields });
  return <Form {...formProps} fields={fields} />;
}

export { SmartForm };
export default SmartForm;
