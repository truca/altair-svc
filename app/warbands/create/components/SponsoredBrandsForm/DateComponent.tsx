import {
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  Input,
  VStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { FieldComponentProps } from "./commonInterfaces";

const DateComponent = ({ field, control, getValues }: FieldComponentProps) => {
  const fieldRegisterStartDate = field?.startDateFieldName
    ? field?.startDateFieldName
    : "startDate";

  const fieldRegisterEndDate = field?.endDateFieldName
    ? field?.endDateFieldName
    : "endDate";

  return (
    <VStack spacing={8} flex="1" align="stretch" width="100%">
      <SimpleGrid columns={2} spacing={4} width="100%">
        <FormControl
          key="startDate"
          isInvalid={Boolean(field.error?.message)}
          alignItems="flex-start"
        >
          <FormLabel htmlFor="startDate" {...field.labelProps}>
            Fecha de Inicio
          </FormLabel>
          <Input
            id="startDate"
            type="date"
            {...field.register(fieldRegisterStartDate, {
              required: true,
              validate: (value) => typeof value === "string",
            })}
            {...field.inputProps}
          />
        </FormControl>
        <FormControl
          key="endDate"
          isInvalid={Boolean(field.error?.message)}
          alignItems="flex-start"
        >
          <FormLabel htmlFor="endDate" {...field.labelProps}>
            Fecha de Término
          </FormLabel>
          <Input
            id="endDate"
            type="date"
            {...field.register(fieldRegisterEndDate, {
              required: true,
              validate: (value) => typeof value === "string",
            })}
            {...field.inputProps}
          />
        </FormControl>
      </SimpleGrid>
    </VStack>
  );
};

export default DateComponent;
