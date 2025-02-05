import {
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { FieldComponentProps } from "./commonInterfaces";

const BudgetType = ({ field, control, getValues }: FieldComponentProps) => {
  return (
    <HStack align="start" spacing={9} width="100%">
      <VStack spacing={3} flex="1" align="stretch">
        <FormControl
          key="budget"
          isInvalid={Boolean(field.error?.message)}
          // sx={{ ...commonStyles }}
          alignItems="flex-start"
        >
          <FormLabel htmlFor="budget">Tipo presupuesto</FormLabel>
        </FormControl>
      </VStack>
      <VStack spacing={3} flex="1" align="stretch">
        <FormControl
          key="totalBudget"
          isInvalid={Boolean(field.error?.message)}
          // sx={{ ...commonStyles }}
          alignItems="flex-start"
        >
          <Checkbox
            id="totalBudget"
            {...field.register("totalBudget", {
              required: false,
              value: false,
            })}
          >
            Total
          </Checkbox>
        </FormControl>
      </VStack>
      <VStack spacing={3} flex="1" align="stretch">
        <FormControl
          key="dailyBudget"
          isInvalid={Boolean(field.error?.message)}
          // sx={{ ...commonStyles }}
          alignItems="flex-start"
        >
          <Checkbox
            id="dailyBudget"
            {...field.register("dailyBudget", {
              required: false,
              value: false,
            })}
          >
            Diario
          </Checkbox>
        </FormControl>
      </VStack>
    </HStack>
  );
};

export default BudgetType;
