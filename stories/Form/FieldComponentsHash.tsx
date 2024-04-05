import {
  VStack,
  Input,
  StackProps,
  Radio,
  RadioGroup,
  Stack,
  Checkbox,
  Select,
  InputProps,
} from "@chakra-ui/react";
import { Direction, FieldType, Field } from "./types";

interface FieldComponentProps {
  field: Field;
}
export const FieldComponentsHash: {
  [key in FieldType]: React.FunctionComponent<FieldComponentProps>;
} = {
  [FieldType.TEXT]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Input
        id={field.id}
        type="text"
        placeholder={field.placeholder}
        {...field.inputProps}
      />
    </VStack>
  ),
  [FieldType.NUMBER]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Input
        id={field.id}
        type="number"
        placeholder={field.placeholder}
        {...field.inputProps}
      />
    </VStack>
  ),
  [FieldType.DATE]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Input
        id={field.id}
        type="date"
        placeholder={field.placeholder}
        {...field.inputProps}
      />
    </VStack>
  ),
  [FieldType.EMAIL]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Input
        id={field.id}
        type="email"
        placeholder={field.placeholder}
        {...field.inputProps}
      />
    </VStack>
  ),
  [FieldType.PASSWORD]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Input
        id={field.id}
        type="password"
        placeholder={field.placeholder}
        {...field.inputProps}
      />
    </VStack>
  ),
  [FieldType.TEXTAREA]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Input
        id={field.id}
        as="textarea"
        placeholder={field.placeholder}
        {...field.inputProps}
      />
    </VStack>
  ),
  [FieldType.SELECT]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Select
        id={field.id}
        placeholder={field.placeholder}
        {...field.inputProps}
      >
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </VStack>
  ),
  [FieldType.CHECKBOX]: ({ field }: FieldComponentProps) => (
    <Checkbox {...field.inputProps}>{field.label}</Checkbox>
  ),
  [FieldType.RADIO]: ({ field }: FieldComponentProps) => (
    <RadioGroup {...field.inputProps}>
      <Stack direction={field.direction}>
        {field.options?.map((option) => (
          <Radio key={option.value} value={option.value}>
            {option.label}
          </Radio>
        ))}
      </Stack>
    </RadioGroup>
  ),
  [FieldType.SUBMIT]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <Input
        id={field.id}
        type="submit"
        value={field.label}
        {...field.inputProps}
      />
    </VStack>
  ),
  [FieldType.FILE]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Input id={field.id} type="file" {...field.inputProps} />
    </VStack>
  ),
  [FieldType.TELEPHONE]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Input id={field.id} type="tel" {...field.inputProps} />
    </VStack>
  ),
  [FieldType.MONTH]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Input id={field.id} type="month" {...field.inputProps} />
    </VStack>
  ),
  [FieldType.WEEK]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Input id={field.id} type="week" {...field.inputProps} />
    </VStack>
  ),
  [FieldType.TIME]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Input id={field.id} type="time" {...field.inputProps} />
    </VStack>
  ),
  [FieldType.URL]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Input id={field.id} type="url" {...field.inputProps} />
    </VStack>
  ),
  [FieldType.COLOR]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Input id={field.id} type="color" {...field.inputProps} />
    </VStack>
  ),
  [FieldType.DATETIME_LOCAL]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Input id={field.id} type="datetime-local" {...field.inputProps} />
    </VStack>
  ),
  [FieldType.SEARCH]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Input id={field.id} type="search" {...field.inputProps} />
    </VStack>
  ),
  [FieldType.HIDDEN]: ({ field }: FieldComponentProps) => (
    <Input id={field.id} type="hidden" {...field.inputProps} />
  ),
  [FieldType.RESET]: ({ field }: FieldComponentProps) => (
    <Input
      id={field.id}
      type="reset"
      value={field.label}
      {...field.inputProps}
    />
  ),
};
