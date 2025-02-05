import {
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  VStack,
} from "@chakra-ui/react";
import { FieldComponentProps } from "./commonInterfaces";

const CampaignTypes = ({ field, control, getValues }: FieldComponentProps) => {
  return (
    <HStack align="start" spacing={6} width="100%" sx={field.sx}>
      <VStack spacing={3} flex="1" align="stretch">
        <FormControl
          key="campaignName"
          isInvalid={Boolean(field.error?.message)}
          // sx={{ ...commonStyles }}
          alignItems="flex-start"
        >
          <FormLabel htmlFor="campaignName" {...field.labelProps}>
            Nombre de la campaña
          </FormLabel>
          <Input
            id="campaignName"
            type="text"
            placeholder="Ingresa un nombre"
            {...field.register("campaignName", {
              required: true,
            })}
            {...field.inputProps}
          />
          {/* {errors.skus && (
          <FormErrorMessage>{errors.skus.message as string}</FormErrorMessage>
        )} */}
        </FormControl>
      </VStack>
      <VStack spacing={3} flex="1" align="stretch">
        <FormControl
          key="campaignTypeId"
          //   isInvalid={Boolean(errors.campaignTypeId)}
          alignItems="flex-start"
        >
          <FormLabel htmlFor="campaignTypeId" {...field.labelProps}>
            Evento
          </FormLabel>
          <Select
            id="campaignTypeId"
            placeholder="Selecciona una opción"
            {...field.register("campaignTypeId", {
              required: "Este campo es obligatorio",
              validate: (value) => typeof value === "string",
            })}
            {...field.inputProps}
          >
            <option value="1">Adidas</option>
            <option value="2">Nike</option>
          </Select>
          {/* {errors.campaignTypeId && (
            <FormErrorMessage>
              {errors.campaignTypeId.message as string}
            </FormErrorMessage>
          )} */}
        </FormControl>
      </VStack>
    </HStack>
  );
};

export default CampaignTypes;
