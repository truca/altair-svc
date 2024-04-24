import { StackProps, Button, ButtonProps } from "@chakra-ui/react";
import { Direction, Field } from "./types";
import { FieldComponentsHash } from "./FieldComponentsHash";
import { FieldValues, useForm } from "react-hook-form";
import { buildYup } from "schema-to-yup";
import { useCallback } from "react";
import * as yup from "yup";

export interface FormProps {
  debug?: boolean;
  direction: Direction;
  sx?: StackProps;
  fields: Field[];
  commonFieldProps?: Partial<Field>;
  onSubmit: (data: FieldValues) => void;
  submitText?: string;
  submitProps?: Omit<ButtonProps, "onClick">;
}

const BASE_SCHEMA = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "http://example.com/person.schema.json",
  title: "Person",
  description: "A person",
  type: "object",
  required: ["username"],
};

function getValidationsFromFields(fields: Field[]) {
  const fieldValidationConfigs = fields
    .filter((f): f is Field => Boolean(f.validation))
    .map((f: Field) => {
      const fieldValidations: any = f.validation;
      const validationKeys = Object.keys(fieldValidations);
      const validationValues = validationKeys.reduce(
        (acc, key) => ({ ...acc, [key]: fieldValidations[key][0] }),
        {}
      );
      const validationMessages = validationKeys.reduce(
        (acc, key) => ({ ...acc, [key]: fieldValidations[key][1] }),
        {}
      );

      return { id: f.id, validationValues, validationMessages };
    });

  const validationValues = fieldValidationConfigs.reduce((acc, field) => {
    return { ...acc, [field.id]: field.validationValues };
  }, {});

  const validationMessages = fieldValidationConfigs.reduce((acc, field) => {
    return { ...acc, [field.id]: field.validationMessages };
  }, {});

  return {
    validationValues: { ...BASE_SCHEMA, properties: validationValues },
    validationMessages,
  };
}

const useYupValidationResolver = (
  validationSchema: yup.ObjectSchema<
    {
      firstName: string;
      lastName: string;
    },
    yup.AnyObject,
    {
      firstName: undefined;
      lastName: undefined;
    },
    ""
  >
) => {
  return useCallback(
    async (data: Record<string, string>) => {
      try {
        console.log({ data });
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (errors: any) {
        return {
          values: {},
          errors: errors.inner.reduce(
            (allErrors: any, currentError: any) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? "validation",
                message: currentError.message,
              },
            }),
            {}
          ),
        };
      }
    },
    [validationSchema]
  );
};

const getFieldsDefaultValues = (fields: Field[]) => {
  return fields.reduce((acc, field) => {
    return { ...acc, [field.id]: field.defaultValue };
  }, {});
};

export function Form({
  fields,
  onSubmit,
  direction,
  commonFieldProps,
  debug,
  submitProps,
  submitText,
  ...extraProps
}: FormProps) {
  const { validationValues, validationMessages } =
    getValidationsFromFields(fields);
  const resolver = useYupValidationResolver(
    buildYup(validationValues, {
      errMessages: {
        ...validationMessages,
        startDate: { negative: "Start date should be negative" },
      },
      mode: { notRequired: true },
    }) as any
  );
  const defaultValues = getFieldsDefaultValues(fields);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, touchedFields },
  } = useForm({ defaultValues, mode: "onSubmit", resolver });

  return (
    <form
      style={{
        width: "100%",
        display: "flex",
        flexDirection: direction,
        gap: 16,
        alignItems: "flex-start",
      }}
      onSubmit={handleSubmit(
        !debug ? onSubmit : (data) => alert(JSON.stringify(data))
      )}
      {...extraProps}
    >
      {fields.map((field: Field) => {
        const FieldComponent = FieldComponentsHash[field.type];
        return (
          <FieldComponent
            key={field.id}
            field={{
              register,
              error: (errors as any)[field.id],
              ...commonFieldProps,
              ...field,
            }}
          />
        );
      })}
      {debug && errors && <p>Errors: {JSON.stringify(errors)}</p>}
      {debug && <p>Values: {JSON.stringify(getValues())}</p>}
      {debug && <p>Touched: {JSON.stringify(touchedFields)}</p>}
      <Button
        type="submit"
        onClick={() => handleSubmit((data) => console.log({ data }))}
        {...submitProps}
      >
        {submitText ?? "Submit"}
      </Button>
    </form>
  );
}
