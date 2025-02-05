import {
  Box,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FieldComponentProps } from "./commonInterfaces";
import getFieldFieldsForSponsoredForm from "../../helpers/getFieldsForSponsoredForm";
import { useEffect } from "react";

const CheckboxServices = ({
  field,
  control,
  getValues,
  watch,
}: FieldComponentProps) => {
  const graphicsEnabled = watch("graphicsEnabled", false);
  const mediaOffEnabled = watch("mediaOffEnabled", false);
  const storeBudget = watch("storeEnabled", false);

  const formData = watch();
  //   const fieldsForSponsoredForm = getFieldFieldsForSponsoredForm(formData)

  const sponsoredProductEnabled = watch("sponsoredProductEnabled", false);
  const bannersFadsEnabled = watch("bannersFadsEnabled", false);
  const mediaOnEnabled = watch("mediaOnEnabled", false);
  const sponsoredBrandsEnabled = watch("sponsoredBrandsEnabled", false);
  const CRMEnabled = watch("CRMEnabled", false);
  const homeLandingEnabled = watch("homeLandingEnabled", false);
  const ratingsAndReviewsEnabled = watch("ratingsAndReviewsEnabled", false);

  useEffect(() => {
    const fieldsForSponsoredForm = getFieldFieldsForSponsoredForm({
      sponsoredProductEnabled,
      bannersFadsEnabled,
      mediaOnEnabled,
      sponsoredBrandsEnabled,
      CRMEnabled,
      homeLandingEnabled,
      ratingsAndReviewsEnabled,
    });

    console.log("fieldsForSponsoredForm: ", fieldsForSponsoredForm);
    console.log("field: ", field);

    field.setFieldsForm(fieldsForSponsoredForm);
  }, [
    sponsoredProductEnabled,
    bannersFadsEnabled,
    mediaOnEnabled,
    sponsoredBrandsEnabled,
    CRMEnabled,
    homeLandingEnabled,
    ratingsAndReviewsEnabled,
  ]);

  return (
    <>
      <FormLabel htmlFor="services" {...field.labelProps}>
        Servicios a contratar:
      </FormLabel>

      <VStack align="stretch" spacing={2}>
        <FormControl
          isInvalid={Boolean(field.error?.message)}
          alignItems="flex-start"
        >
          <Checkbox
            id="bannersFadsEnabled"
            {...field.register("bannersFadsEnabled", {
              required: false,
              value: false,
            })}
            {...field.inputProps}
          >
            Banners Fads
          </Checkbox>
        </FormControl>
        <FormControl
          isInvalid={Boolean(field.error?.message)}
          alignItems="flex-start"
        >
          <Checkbox
            id="CRMEnabled"
            {...field.register("CRMEnabled", {
              required: false,
              value: false,
            })}
            {...field.inputProps}
          >
            CRM
          </Checkbox>
        </FormControl>
        <FormControl
          isInvalid={Boolean(field.error?.message)}
          alignItems="flex-start"
        >
          <Checkbox
            id="homeLandingEnabled"
            {...field.register("homeLandingEnabled", {
              required: false,
              value: false,
            })}
            {...field.inputProps}
          >
            Home Landing
          </Checkbox>
        </FormControl>
        <FormControl
          isInvalid={Boolean(field.error?.message)}
          alignItems="flex-start"
        >
          <Checkbox
            id="mediaOnEnabled"
            {...field.register("mediaOnEnabled", {
              required: false,
              value: false,
            })}
            {...field.inputProps}
          >
            Media On
          </Checkbox>
        </FormControl>
        <FormControl
          isInvalid={Boolean(field.error?.message)}
          alignItems="flex-start"
        >
          <Checkbox
            id="ratingsAndReviewsEnabled"
            {...field.register("ratingsAndReviewsEnabled", {
              required: false,
              value: false,
            })}
            {...field.inputProps}
          >
            Ratings and Reviews
          </Checkbox>
        </FormControl>
        <FormControl
          isInvalid={Boolean(field.error?.message)}
          alignItems="flex-start"
        >
          <Checkbox
            id="sponsoredBrandsEnabled"
            {...field.register("sponsoredBrandsEnabled", {
              required: false,
              value: false,
            })}
            {...field.inputProps}
          >
            Sponsored Brands
          </Checkbox>
        </FormControl>
        <FormControl
          isInvalid={Boolean(field.error?.message)}
          alignItems="flex-start"
        >
          <Checkbox
            id="sponsoredProductEnabled"
            {...field.register("sponsoredProductEnabled", {
              required: false,
              value: false,
            })}
            {...field.inputProps}
          >
            Sponsored Products
          </Checkbox>
        </FormControl>
      </VStack>

      <FormLabel htmlFor="services" {...field.labelProps}>
        Otros Servicios:
      </FormLabel>

      <VStack align="stretch" spacing={4}>
        <HStack align="stretch">
          <FormControl
            isInvalid={Boolean(field.error?.message)}
            alignItems="flex-start"
          >
            <Checkbox
              id="mediaOffEnabled"
              {...field.register("mediaOffEnabled", {
                required: false,
                value: false,
              })}
              {...field.inputProps}
            >
              Media Off
            </Checkbox>
          </FormControl>
          {mediaOffEnabled && (
            <FormControl
              isInvalid={Boolean(field.error?.message)}
              alignItems="flex-start"
              // {...field.sx}
            >
              <Input
                id="mediaOffBudget"
                type="number"
                {...field.register("mediaOffBudget", {
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
        <HStack align="stretch" {...field.sx}>
          <FormControl
            isInvalid={Boolean(field.error?.message)}
            alignItems="flex-start"
          >
            <Checkbox
              id="storeEnabled"
              {...field.register("storeEnabled", {
                required: false,
                value: false,
              })}
              {...field.inputProps}
            >
              Tienda
            </Checkbox>
          </FormControl>
          {storeBudget && (
            <FormControl
              isInvalid={Boolean(field.error?.message)}
              alignItems="flex-start"
            >
              <Input
                id="storeBudget"
                type="number"
                {...field.register("storeBudget", {
                  required: "El presupuesto de la tienda es obligatorio",
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

        <HStack align="stretch" {...field.sx}>
          <FormControl
            isInvalid={Boolean(field.error?.message)}
            alignItems="flex-start"
          >
            <Checkbox
              id="graphicsEnabled"
              {...field.register("graphicsEnabled", {
                required: false,
                value: false,
              })}
              {...field.inputProps}
            >
              Grafícas
            </Checkbox>
          </FormControl>

          {graphicsEnabled && (
            <FormControl
              isInvalid={Boolean(field.error?.message)}
              alignItems="flex-start"
            >
              <Input
                id="graphicsBudget"
                type="number"
                {...field.register("graphicsBudget", {
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

        <HStack align="stretch" {...field.sx}>
          <FormControl
            isInvalid={Boolean(field.error?.message)}
            alignItems="flex-start"
          >
            <Checkbox
              id="othersEnabled"
              {...field.register("othersEnabled", {
                required: false,
                value: false,
              })}
              {...field.inputProps}
            >
              Otros
            </Checkbox>
          </FormControl>
        </HStack>
      </VStack>
      <HStack spacing={8} flex="1" align="stretch" width="100%">
        <FormControl>
          <Box
            border="2px dashed #A6A6A6"
            borderRadius="8px"
            padding="20px"
            textAlign="center"
            cursor="pointer"
            backgroundColor="white"
            _hover={{ borderColor: "gray.500" }}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            {/* <Icon as={FiUploadCloud} boxSize={10} color="gray.500" /> */}
            <Text fontSize="md">Plan de medios</Text>
            {/* <Text fontSize="sm" color="gray.400">
                o haz clic para seleccionar
              </Text> */}
            <Input
              id="file-upload"
              type="file"
              accept=".xlsx,.csv"
              {...field.register("file")}
              // onChange={handleFileChange}
              hidden
            />
          </Box>
        </FormControl>
      </HStack>
    </>
  );
};

export default CheckboxServices;
