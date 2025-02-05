import { useQuery } from "@apollo/client";
import queriesSelectsField from "../../queries/getSelectOptions";
import { FieldComponentProps } from "../SponsoredBrandsForm/commonInterfaces";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";

const ProductManagerField = ({ field }: FieldComponentProps) => {
  const isBrowser = typeof window !== "undefined";

  const queryParams = isBrowser
    ? new URLSearchParams(window.location.search)
    : undefined;
  const email = queryParams?.get("email");

  const entitykey = field?.entity ?? "";

  const { data } = useQuery(queriesSelectsField[entitykey]);

  const findEmail = data?.[entitykey]?.list?.find(
    (item: any) => item.email === email
  );

  if (findEmail)
    return (
      <FormControl>
        <FormLabel htmlFor={`${field?.id}`} {...field.labelProps}>
          Product Manager
        </FormLabel>
        <Input
          id={`${field?.formName}`}
          {...field.register(`${field?.formName}` as const)}
          {...field.inputProps}
          defaultValue={findEmail.name}
          readOnly
        />
      </FormControl>
    );

  const fieldOptions = data?.[entitykey]?.list?.map((item: any) => (
    <option
      key={item[field?.valueAttribute ?? ""]}
      value={item[field?.valueAttribute ?? ""]}
    >
      {item[field?.labelAttribute ?? ""]}
    </option>
  )) ?? (
    <option key={"exmple"} value={"exmple"}>
      {"example 1"}
    </option>
  );

  return (
    <FormControl
      isInvalid={Boolean(field.error?.message)}
      sx={field.sx}
      alignItems="flex-start"
    >
      <FormLabel htmlFor={field.id} {...field.labelProps}>
        {field.label}
      </FormLabel>
      <Select
        id={field.id}
        {...field.register(field.id)}
        placeholder={field.placeholder}
        {...field.inputProps}
      >
        {fieldOptions}
      </Select>
      {field.error && (
        <FormErrorMessage>{field.error.message}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default ProductManagerField;
