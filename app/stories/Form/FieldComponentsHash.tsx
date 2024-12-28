import {
  VStack,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Checkbox,
  Select,
  FormLabel,
  FormErrorMessage,
  FormControl,
} from "@chakra-ui/react";
import { FieldType, InternalField } from "./types";
import GuildUpgradesSelect from "../GuildUpgradesSelect";
import { GUs } from "../GuildUpgradesSelect/GuildUpgradesSelect.stories";
import { Control, Controller, UseFormGetValues } from "react-hook-form";
import UnitSelect from "../UnitSelect";

export const createSyntheticEvent = <T extends Element, E extends Event>(
  event: E
): React.SyntheticEvent<T, E> => {
  let isDefaultPrevented = false;
  let isPropagationStopped = false;
  const preventDefault = () => {
    isDefaultPrevented = true;
    event.preventDefault();
  };
  const stopPropagation = () => {
    isPropagationStopped = true;
    event.stopPropagation();
  };
  return {
    nativeEvent: event,
    currentTarget: event.currentTarget as EventTarget & T,
    target: event.target as EventTarget & T,
    bubbles: event.bubbles,
    cancelable: event.cancelable,
    defaultPrevented: event.defaultPrevented,
    eventPhase: event.eventPhase,
    isTrusted: event.isTrusted,
    preventDefault,
    isDefaultPrevented: () => isDefaultPrevented,
    stopPropagation,
    isPropagationStopped: () => isPropagationStopped,
    persist: () => {},
    timeStamp: event.timeStamp,
    type: event.type,
  };
};

interface FieldComponentProps {
  field: InternalField;
  control?: Control<{}, any>;
  getValues?: UseFormGetValues<{}>;
}
export const FieldComponentsHash: {
  [key in FieldType | string]: React.FunctionComponent<FieldComponentProps>;
} = {
  GuildUpgradesSelect: ({ field, control, getValues }: FieldComponentProps) => {
    return (
      <FormControl
        isInvalid={Boolean(field.error?.message)}
        sx={field.sx}
        alignItems="flex-start"
      >
        <Controller
          name={field.id as never}
          control={control}
          render={({ field: { onChange, value } }) => (
            <GuildUpgradesSelect
              id={field.id}
              getValues={getValues}
              values={{ guild_upgrade_points: 5 }}
              options={GUs.map((gu) => ({
                label: gu.name,
                value: gu.name,
                base: gu,
              }))}
              {...field.register(field.id)}
              {...field.inputProps}
              onChange={onChange}
              value={value}
            />
          )}
        />
      </FormControl>
    );
  },
  UnitSelect: ({ field, control, getValues }: FieldComponentProps) => {
    return (
      <FormControl
        isInvalid={Boolean(field.error?.message)}
        sx={field.sx}
        alignItems="flex-start"
      >
        <Controller
          name={field.id as never}
          control={control}
          render={({ field: { onChange, value } }) => (
            <UnitSelect
              id={field.id}
              getValues={getValues}
              values={{ guild_upgrade_points: 5 }}
              options={GUs.map((gu) => ({
                label: gu.name,
                value: gu.name,
                base: gu,
              }))}
              {...field.register(field.id)}
              {...field.inputProps}
              onChange={onChange}
              value={value}
            />
          )}
        />
      </FormControl>
    );
  },
  [FieldType.TEXT]: ({ field }: FieldComponentProps) => (
    <FormControl
      isInvalid={Boolean(field.error?.message)}
      sx={field.sx}
      alignItems="flex-start"
    >
      <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
      <Input
        id={field.id}
        type="text"
        {...field.register(field.id)}
        placeholder={field.placeholder}
        {...field.inputProps}
      />
      {field.error && (
        <FormErrorMessage>{field.error.message}</FormErrorMessage>
      )}
    </FormControl>
  ),
  [FieldType.NUMBER]: ({ field }: FieldComponentProps) => (
    <FormControl
      isInvalid={Boolean(field.error?.message)}
      sx={field.sx}
      alignItems="flex-start"
    >
      <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
      <Input
        id={field.id}
        type="number"
        {...field.register(field.id)}
        placeholder={field.placeholder}
        step={field.step ?? "any"}
        {...field.inputProps}
      />
      {field.error && (
        <FormErrorMessage>{field.error.message}</FormErrorMessage>
      )}
    </FormControl>
  ),
  [FieldType.DATE]: ({ field }: FieldComponentProps) => (
    <FormControl
      isInvalid={Boolean(field.error?.message)}
      sx={field.sx}
      alignItems="flex-start"
    >
      <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
      <Input
        id={field.id}
        type="date"
        {...field.register(field.id)}
        placeholder={field.placeholder}
        {...field.inputProps}
      />
      {field.error && (
        <FormErrorMessage>{field.error.message}</FormErrorMessage>
      )}
    </FormControl>
  ),
  [FieldType.EMAIL]: ({ field }: FieldComponentProps) => (
    <FormControl
      isInvalid={Boolean(field.error?.message)}
      sx={field.sx}
      alignItems="flex-start"
    >
      <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
      <Input
        id={field.id}
        type="email"
        {...field.register(field.id)}
        placeholder={field.placeholder}
        {...field.inputProps}
      />
      {field.error && (
        <FormErrorMessage>{field.error.message}</FormErrorMessage>
      )}
    </FormControl>
  ),
  [FieldType.PASSWORD]: ({ field }: FieldComponentProps) => (
    <FormControl
      isInvalid={Boolean(field.error?.message)}
      sx={field.sx}
      alignItems="flex-start"
    >
      <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
      <Input
        id={field.id}
        type="password"
        {...field.register(field.id)}
        placeholder={field.placeholder}
        {...field.inputProps}
      />
      {field.error && (
        <FormErrorMessage>{field.error.message}</FormErrorMessage>
      )}
    </FormControl>
  ),
  [FieldType.TEXTAREA]: ({ field }: FieldComponentProps) => (
    <FormControl
      isInvalid={Boolean(field.error?.message)}
      sx={field.sx}
      alignItems="flex-start"
    >
      <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
      <Input
        id={field.id}
        as="textarea"
        {...field.register(field.id)}
        placeholder={field.placeholder}
        {...field.inputProps}
      />
      {field.error && (
        <FormErrorMessage>{field.error.message}</FormErrorMessage>
      )}
    </FormControl>
  ),
  [FieldType.SELECT]: ({ field }: FieldComponentProps) => (
    <FormControl
      isInvalid={Boolean(field.error?.message)}
      sx={field.sx}
      alignItems="flex-start"
    >
      <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
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
      {field.error && (
        <FormErrorMessage>{field.error.message}</FormErrorMessage>
      )}
    </FormControl>
  ),
  [FieldType.CHECKBOX]: ({ field }: FieldComponentProps) => (
    <FormControl
      isInvalid={Boolean(field.error?.message)}
      sx={field.sx}
      alignItems="flex-start"
    >
      <Checkbox {...field.inputProps} {...field.register(field.id)}>
        {field.label}
      </Checkbox>
      {field.error && (
        <FormErrorMessage>{field.error.message}</FormErrorMessage>
      )}
    </FormControl>
  ),
  [FieldType.RADIO]: ({ field }: FieldComponentProps) => {
    const fieldRegister = field.register(field.id);
    return (
      <RadioGroup
        id={field.id}
        {...field.inputProps}
        {...fieldRegister}
        onChange={(value) => {
          const target = document.getElementById(field.id) as HTMLInputElement;
          target.value = value;
          const event = new Event("change", { bubbles: true });
          Object.defineProperty(event, "target", {
            writable: false,
            value: target,
          });
          const syntheticEvent = createSyntheticEvent(
            event
          ) as React.ChangeEvent<typeof target>;
          fieldRegister.onChange(syntheticEvent);
        }}
      >
        {field.hasTitle ? (
          <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
        ) : null}
        <Stack direction={field.direction} spacing={field.spacing}>
          {field.options?.map((option) => (
            <Radio
              key={option.value}
              value={option.value}
              // name={field.id}
              defaultChecked={option.defaultChecked}
            >
              {option.label}
            </Radio>
          ))}
        </Stack>
        {field.error && (
          <FormErrorMessage>{field.error.message}</FormErrorMessage>
        )}
      </RadioGroup>
    );
  },
  [FieldType.SUBMIT]: ({ field }: FieldComponentProps) => (
    <FormControl
      isInvalid={Boolean(field.error?.message)}
      sx={field.sx}
      alignItems="flex-start"
    >
      <Input
        id={field.id}
        type="submit"
        {...field.register(field.id)}
        value={field.label}
        {...field.inputProps}
      />
      {field.error && (
        <FormErrorMessage>{field.error.message}</FormErrorMessage>
      )}
    </FormControl>
  ),
  [FieldType.FILE]: ({ field }: FieldComponentProps) => (
    <FormControl
      isInvalid={Boolean(field.error?.message)}
      sx={field.sx}
      alignItems="flex-start"
    >
      <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
      <Input
        id={field.id}
        type="file"
        {...field.register(field.id)}
        {...field.inputProps}
      />
      {field.error && (
        <FormErrorMessage>{field.error.message}</FormErrorMessage>
      )}
    </FormControl>
  ),
  [FieldType.TELEPHONE]: ({ field }: FieldComponentProps) => (
    <FormControl
      isInvalid={Boolean(field.error?.message)}
      sx={field.sx}
      alignItems="flex-start"
    >
      <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
      <Input
        id={field.id}
        type="tel"
        {...field.register(field.id)}
        {...field.inputProps}
      />
      {field.error && (
        <FormErrorMessage>{field.error.message}</FormErrorMessage>
      )}
    </FormControl>
  ),
  [FieldType.MONTH]: ({ field }: FieldComponentProps) => (
    <FormControl
      isInvalid={Boolean(field.error?.message)}
      sx={field.sx}
      alignItems="flex-start"
    >
      <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
      <Input
        id={field.id}
        type="month"
        {...field.register(field.id)}
        {...field.inputProps}
      />
      {field.error && (
        <FormErrorMessage>{field.error.message}</FormErrorMessage>
      )}
    </FormControl>
  ),
  [FieldType.WEEK]: ({ field }: FieldComponentProps) => (
    <FormControl
      isInvalid={Boolean(field.error?.message)}
      sx={field.sx}
      alignItems="flex-start"
    >
      <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
      <Input
        id={field.id}
        type="week"
        {...field.register(field.id)}
        {...field.inputProps}
      />
      {field.error && (
        <FormErrorMessage>{field.error.message}</FormErrorMessage>
      )}
    </FormControl>
  ),
  [FieldType.TIME]: ({ field }: FieldComponentProps) => (
    <FormControl
      isInvalid={Boolean(field.error?.message)}
      sx={field.sx}
      alignItems="flex-start"
    >
      <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
      <Input
        id={field.id}
        type="time"
        {...field.register(field.id)}
        {...field.inputProps}
      />
      {field.error && (
        <FormErrorMessage>{field.error.message}</FormErrorMessage>
      )}
    </FormControl>
  ),
  [FieldType.URL]: ({ field }: FieldComponentProps) => (
    <FormControl
      isInvalid={Boolean(field.error?.message)}
      sx={field.sx}
      alignItems="flex-start"
    >
      <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
      <Input
        id={field.id}
        type="url"
        {...field.register(field.id)}
        {...field.inputProps}
      />
      {field.error && (
        <FormErrorMessage>{field.error.message}</FormErrorMessage>
      )}
    </FormControl>
  ),
  [FieldType.COLOR]: ({ field }: FieldComponentProps) => (
    <FormControl
      isInvalid={Boolean(field.error?.message)}
      sx={field.sx}
      alignItems="flex-start"
    >
      <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
      <Input
        id={field.id}
        type="color"
        {...field.register(field.id)}
        {...field.inputProps}
      />
      {field.error && (
        <FormErrorMessage>{field.error.message}</FormErrorMessage>
      )}
    </FormControl>
  ),
  [FieldType.DATETIME_LOCAL]: ({ field }: FieldComponentProps) => (
    <FormControl
      isInvalid={Boolean(field.error?.message)}
      sx={field.sx}
      alignItems="flex-start"
    >
      <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
      <Input
        id={field.id}
        type="datetime-local"
        {...field.register(field.id)}
        {...field.inputProps}
      />
      {field.error && (
        <FormErrorMessage>{field.error.message}</FormErrorMessage>
      )}
    </FormControl>
  ),
  [FieldType.SEARCH]: ({ field }: FieldComponentProps) => (
    <FormControl
      isInvalid={Boolean(field.error?.message)}
      sx={field.sx}
      alignItems="flex-start"
    >
      <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
      <Input
        id={field.id}
        type="search"
        {...field.register(field.id)}
        {...field.inputProps}
      />
      {field.error && (
        <FormErrorMessage>{field.error.message}</FormErrorMessage>
      )}
    </FormControl>
  ),
  [FieldType.HIDDEN]: ({ field }: FieldComponentProps) => (
    <FormControl
      isInvalid={Boolean(field.error?.message)}
      sx={field.sx}
      alignItems="flex-start"
    >
      <Input
        id={field.id}
        type="hidden"
        {...field.register(field.id)}
        {...field.inputProps}
      />
      {field.error && (
        <FormErrorMessage>{field.error.message}</FormErrorMessage>
      )}
    </FormControl>
  ),
  [FieldType.RESET]: ({ field }: FieldComponentProps) => (
    <FormControl
      isInvalid={Boolean(field.error?.message)}
      sx={field.sx}
      alignItems="flex-start"
    >
      <Input
        id={field.id}
        type="reset"
        {...field.register(field.id)}
        value={field.label}
        {...field.inputProps}
      />
      {field.error && (
        <FormErrorMessage>{field.error.message}</FormErrorMessage>
      )}
    </FormControl>
  ),
};
