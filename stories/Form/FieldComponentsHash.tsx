import {
  VStack,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Checkbox,
  Select,
} from "@chakra-ui/react";
import { FieldType, InternalField } from "./types";

interface FieldComponentProps {
  field: InternalField;
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
        {...field.register(field.id)}
        placeholder={field.placeholder}
        {...field.inputProps}
      />
      {field.error && <span>{field.error.message}</span>}
    </VStack>
  ),
  [FieldType.NUMBER]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Input
        id={field.id}
        type="number"
        {...field.register(field.id)}
        placeholder={field.placeholder}
        {...field.inputProps}
      />
      {field.error && <span>{field.error.message}</span>}
    </VStack>
  ),
  [FieldType.DATE]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Input
        id={field.id}
        type="date"
        {...field.register(field.id)}
        placeholder={field.placeholder}
        {...field.inputProps}
      />
      {field.error && <span>{field.error.message}</span>}
    </VStack>
  ),
  [FieldType.EMAIL]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Input
        id={field.id}
        type="email"
        {...field.register(field.id)}
        placeholder={field.placeholder}
        {...field.inputProps}
      />
      {field.error && <span>{field.error.message}</span>}
    </VStack>
  ),
  [FieldType.PASSWORD]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Input
        id={field.id}
        type="password"
        {...field.register(field.id)}
        placeholder={field.placeholder}
        {...field.inputProps}
      />
      {field.error && <span>{field.error.message}</span>}
    </VStack>
  ),
  [FieldType.TEXTAREA]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Input
        id={field.id}
        as="textarea"
        {...field.register(field.id)}
        placeholder={field.placeholder}
        {...field.inputProps}
      />
      {field.error && <span>{field.error.message}</span>}
    </VStack>
  ),
  [FieldType.SELECT]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Select
        id={field.id}
        {...field.register(field.id)}
        placeholder={field.placeholder}
        {...field.inputProps}
      >
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      {field.error && <span>{field.error.message}</span>}
    </VStack>
  ),
  [FieldType.CHECKBOX]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <Checkbox {...field.inputProps} {...field.register(field.id)}>
        {field.label}
      </Checkbox>
      {field.error && <span>{field.error.message}</span>}
    </VStack>
  ),
  [FieldType.RADIO]: ({ field }: FieldComponentProps) => (
    <RadioGroup {...field.inputProps} {...field.register(field.id)}>
      <Stack direction={field.direction}>
        {field.options?.map((option) => (
          <Radio key={option.value} value={option.value}>
            {option.label}
          </Radio>
        ))}
      </Stack>
      {field.error && <span>{field.error.message}</span>}
    </RadioGroup>
  ),
  [FieldType.SUBMIT]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <Input
        id={field.id}
        type="submit"
        {...field.register(field.id)}
        value={field.label}
        {...field.inputProps}
      />
      {field.error && <span>{field.error.message}</span>}
    </VStack>
  ),
  [FieldType.FILE]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Input
        id={field.id}
        type="file"
        {...field.register(field.id)}
        {...field.inputProps}
      />
      {field.error && <span>{field.error.message}</span>}
    </VStack>
  ),
  [FieldType.TELEPHONE]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Input
        id={field.id}
        type="tel"
        {...field.register(field.id)}
        {...field.inputProps}
      />
      {field.error && <span>{field.error.message}</span>}
    </VStack>
  ),
  [FieldType.MONTH]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Input
        id={field.id}
        type="month"
        {...field.register(field.id)}
        {...field.inputProps}
      />
      {field.error && <span>{field.error.message}</span>}
    </VStack>
  ),
  [FieldType.WEEK]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Input
        id={field.id}
        type="week"
        {...field.register(field.id)}
        {...field.inputProps}
      />
      {field.error && <span>{field.error.message}</span>}
    </VStack>
  ),
  [FieldType.TIME]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Input
        id={field.id}
        type="time"
        {...field.register(field.id)}
        {...field.inputProps}
      />
      {field.error && <span>{field.error.message}</span>}
    </VStack>
  ),
  [FieldType.URL]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Input
        id={field.id}
        type="url"
        {...field.register(field.id)}
        {...field.inputProps}
      />
      {field.error && <span>{field.error.message}</span>}
    </VStack>
  ),
  [FieldType.COLOR]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Input
        id={field.id}
        type="color"
        {...field.register(field.id)}
        {...field.inputProps}
      />
      {field.error && <span>{field.error.message}</span>}
    </VStack>
  ),
  [FieldType.DATETIME_LOCAL]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Input
        id={field.id}
        type="datetime-local"
        {...field.register(field.id)}
        {...field.inputProps}
      />
      {field.error && <span>{field.error.message}</span>}
    </VStack>
  ),
  [FieldType.SEARCH]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <label htmlFor={field.id}>{field.label}</label>
      <Input
        id={field.id}
        type="search"
        {...field.register(field.id)}
        {...field.inputProps}
      />
      {field.error && <span>{field.error.message}</span>}
    </VStack>
  ),
  [FieldType.HIDDEN]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <Input
        id={field.id}
        type="hidden"
        {...field.register(field.id)}
        {...field.inputProps}
      />
      {field.error && <span>{field.error.message}</span>}
    </VStack>
  ),
  [FieldType.RESET]: ({ field }: FieldComponentProps) => (
    <VStack sx={field.sx} alignItems="flex-start">
      <Input
        id={field.id}
        type="reset"
        {...field.register(field.id)}
        value={field.label}
        {...field.inputProps}
      />
      {field.error && <span>{field.error.message}</span>}
    </VStack>
  ),
};
