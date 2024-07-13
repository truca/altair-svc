import pluralize from "pluralize";
import { FieldValidation } from "../Form/types";

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
  if (!validations) return { type: ["string", "string"] };
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

export function getFormFieldsFromFormQueryResults(
  data: any,
  entityType: string
) {
  const entityName = pluralize.isSingular(entityType.toLowerCase())
    ? entityType.toLowerCase()
    : pluralize.singular(entityType.toLowerCase());
  return data.form.fields.map((field: any) => ({
    ...field,
    id: field.label,
    type: field.type.toLowerCase(),
    defaultValue: data?.[entityName]?.[field.label],
    validation: parseValidation(field.validation),
  }));
}
