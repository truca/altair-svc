import {
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  Radio,
  RadioGroup,
  VStack,
} from "@chakra-ui/react";
import { FieldComponentProps } from "./commonInterfaces";
import { Controller } from "react-hook-form";

const BusinessUnitSelector = ({
  field: currentField,
  control,
  getValues,
}: FieldComponentProps) => {
  return (
    <FormControl
      isInvalid={Boolean(currentField.error?.message)}
      alignItems="flex-start"
      sx={currentField.sx}
    >
      <FormLabel
        // fontWeight="bold"
        // color="gray.700"
        {...currentField.labelProps}
      >
        {currentField.label}
      </FormLabel>
      <Controller
        name={currentField.id}
        control={control}
        rules={{ required: "Este campo es obligatorio" }}
        render={({ field }) => (
          <RadioGroup {...field}>
            <HStack spacing={4}>
              {currentField.options?.map((option) => (
                <Radio
                  key={option.value}
                  value={option.value}
                  {...currentField.inputProps}
                >
                  {option.label}
                </Radio>
              ))}
            </HStack>
          </RadioGroup>
        )}
      />
    </FormControl>
  );
};

export default BusinessUnitSelector;
