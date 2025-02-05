import {
  Checkbox,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  VStack,
} from "@chakra-ui/react";
import { FieldComponentProps } from "./commonInterfaces";

const DailyLimitComponent = ({
  field,
  control,
  getValues,
  watch,
}: FieldComponentProps) => {
  const dailyLimitEnabled = watch(`${field.formName}.dailyLimitEnabled`, false);
  return (
    <VStack align="stretch" spacing={4}>
      <HStack align="stretch">
        <FormControl
          isInvalid={Boolean(field.error?.message)}
          alignItems="flex-start"
          {...field.sx}
        >
          <Checkbox
            id={`${field.formName}.dailyLimitEnabled`}
            {...field.register(`${field.formName}.dailyLimitEnabled`, {
              required: false,
              value: false,
            })}
            {...field.inputProps}
          >
            {field.label}
          </Checkbox>
        </FormControl>
        {dailyLimitEnabled && (
          <FormControl
            isInvalid={Boolean(field.error?.message)}
            alignItems="flex-start"
            // {...field.sx}
          >
            <Input
              id={`${field.formName}.dailyBudgetLimit`}
              type="number"
              {...field.register(`${field.formName}.dailyBudgetLimit`, {
                required: true,
                valueAsNumber: true,
                min: 0,
              })}
              placeholder="0 CLP"
              {...field.inputProps}
            />
            {field.error?.message && (
              <FormErrorMessage>
                {field.error?.message as string}
              </FormErrorMessage>
            )}
          </FormControl>
        )}
      </HStack>
    </VStack>
  );
};

export default DailyLimitComponent;
