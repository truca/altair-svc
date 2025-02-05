import { StackProps, Button, ButtonProps, HStack } from "@chakra-ui/react";
import { Direction, Field } from "./types";
import { FieldComponentsHash } from "./FieldComponentsHash";
import { FieldValues, useForm } from "react-hook-form";
import { buildYup } from "schema-to-yup";
import { useCallback, useEffect } from "react";
import * as yup from "yup";

export interface FormProps {
  debug?: boolean;
  direction: Direction;
  sx?: StackProps;
  fields: Field[];
  initialValues?: { [key: string]: any };
  commonFieldProps?: Partial<Field>;
  onSubmit: (data: FieldValues) => void;
  submitText?: string;
  submitProps?: Omit<ButtonProps, "onClick">;

  containerSx?: React.CSSProperties;
  // setCurrentValueForm?: any;
  setFieldsForm?: any;
  cancelText?: string;
  onCancel?: () => void;
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
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (errors: any) {
        console.log({ errors });
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

export function BasicForm({
  fields,
  onSubmit,
  direction,
  commonFieldProps,
  debug,
  submitProps,
  submitText,
  initialValues,

  onCancel,
  cancelText,
  containerSx,
  // setCurrentValueForm,
  setFieldsForm,
  ...extraProps
}: FormProps) {
  console.log("extraProps: ", extraProps);
  console.log({ fields });
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
  const defaultValues = {
    ...(getFieldsDefaultValues(fields) || {}),
    ...(initialValues || {}),
  };
  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { errors, touchedFields },
    watch,
    setValue,
  } = useForm({
    defaultValues,
    mode: "onSubmit",
    // resolver
  });

  const allValues = watch();

  useEffect(() => {
    console.log("allValues: ", allValues);
  }, [allValues]);

  return (
    <form
      style={{
        width: "100%",
        display: "flex",
        flexDirection: direction,
        gap: 16,
        alignItems: "flex-start",
        ...containerSx,
      }}
      onSubmit={(e) => {
        e.stopPropagation();
        e.preventDefault();
        handleSubmit((data) => {
          onSubmit(data);
          if (debug) alert(JSON.stringify(data));
        })();
      }}
      {...extraProps}
    >
      {fields.map((field: Field) => {
        const FieldComponentOverwrite =
          field.component && typeof field.component === "string"
            ? FieldComponentsHash[field.component]
            : field.component;
        const FieldComponent = field.component
          ? FieldComponentOverwrite
          : FieldComponentsHash[field.type];
        // step is a special field that is not passed to the field component
        const { step, ...otherFieldProps } = field;
        if (!FieldComponent) return null;
        return (
          <FieldComponent
            key={field.id}
            control={control}
            getValues={getValues}
            watch={watch}
            setValue={setValue}
            field={{
              register,
              error: (errors as any)[field.id],
              setFieldsForm,
              ...commonFieldProps,
              ...otherFieldProps,
            }}
          />
        );
      })}
      {debug && errors && <p>Errors: {JSON.stringify(errors)}</p>}
      {debug && <p>Values: {JSON.stringify(getValues())}</p>}
      {debug && <p>Touched: {JSON.stringify(touchedFields)}</p>}
      <HStack spacing={4}>
        {onCancel && (
          <Button onClick={onCancel}>{cancelText ?? "Cancel"}</Button>
        )}
        <Button
          type="submit"
          onClick={() => handleSubmit((data) => console.log({ data }))}
          {...submitProps}
        >
          {submitText ?? "Submit"}
        </Button>
      </HStack>
    </form>
  );
}
