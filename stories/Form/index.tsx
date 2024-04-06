import { StackProps, Stack, Button } from "@chakra-ui/react";
import { Direction, Field, FieldWithValidation } from "./types";
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
}

const BASE_SCHEMA = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "http://example.com/person.schema.json",
  title: "Person",
  description: "A person",
  type: "object",
};

function getValidationsFromFields(fields: Field[]) {
  const fieldValidationConfigs = fields
    .filter((f): f is FieldWithValidation => Boolean(f.validation))
    .map((f: FieldWithValidation) => {
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
  ...extraProps
}: FormProps) {
  const { validationValues, validationMessages } =
    getValidationsFromFields(fields);
  const resolver = useYupValidationResolver(
    buildYup(validationValues, { errMessages: validationMessages }) as any
  );
  const defaultValues = getFieldsDefaultValues(fields);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues, mode: "onSubmit", resolver });

  return (
    <Stack
      w="100%"
      direction={direction}
      gap={2}
      alignItems="flex-start"
      {...extraProps}
    >
      <form
        onSubmit={handleSubmit(
          !debug ? onSubmit : (data) => alert(JSON.stringify(data))
        )}
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
        <Button
          type="submit"
          onClick={() => handleSubmit((data) => console.log({ data }))}
        >
          Submit
        </Button>
      </form>
    </Stack>
  );
}
