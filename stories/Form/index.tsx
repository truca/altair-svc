import { StackProps, Stack } from "@chakra-ui/react";
import { Direction, Field } from "./types";
import { FieldComponentsHash } from "./FieldComponentsHash";

export interface FormProps {
  direction: Direction;
  sx?: StackProps;
  fields: Field[];
  commonFieldProps?: Partial<Field>;
}

export function Form(props: FormProps) {
  const { direction, fields, commonFieldProps, ...extraProps } = props;

  return (
    <Stack
      w="100%"
      direction={direction}
      gap={2}
      alignItems="flex-start"
      {...extraProps}
    >
      {fields.map((field: Field) => {
        const FieldComponent = FieldComponentsHash[field.type];
        return (
          <FieldComponent
            key={(field as any).id}
            field={{ ...commonFieldProps, ...field }}
          />
        );
      })}
    </Stack>
  );
}
