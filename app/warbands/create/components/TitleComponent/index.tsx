import { Heading } from "@chakra-ui/react";
import { FieldComponentProps } from "../SponsoredBrandsForm/commonInterfaces";

const TitleComponent = ({ field, control, getValues }: FieldComponentProps) => {
  return (
    <Heading
      // fontFamily="Lato, sans-serif" fontSize="lg" fontWeight="bold"
      {...field.labelProps}
    >
      {field.label}
    </Heading>
  );
};

export default TitleComponent;
