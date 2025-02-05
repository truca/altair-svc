import { useState } from "react";
import { FieldComponentProps } from "../SponsoredBrandsForm/commonInterfaces";
import { useFieldArray } from "react-hook-form";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

const CRMForm = ({
  field: fieldData,
  control,
  getValues,
  watch,
}: FieldComponentProps) => {
  const [formType, setFormType] = useState<string>("");

  // useEffect(() => {
  //     console.log("Current values:", watchAll);
  //   }, [watchAll]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: `${fieldData?.formName}.subProducts`,
  });

  const addForm = () => {
    console.log("entree!!!");
    const commonFields = {
      budget: 0,
      base: 0,
      internalCampaignName: "",
      comments: "",
    };

    let newForm: any = {};

    switch (formType) {
      case "email":
        newForm = { ...commonFields, type: "email", shippingDate: "" };
        break;
      case "trigger":
        newForm = {
          ...commonFields,
          type: "trigger",
          quantityMonths: 0,
          triggerTypeId: "",
        };
        break;
      case "banner":
        newForm = {
          ...commonFields,
          type: "banner",
          startDate: "",
          endDate: "",
          sku: "",
          callToAction: "",
          url: "",
        };
        break;
      case "sms":
        newForm = { ...commonFields, type: "sms", smsText: "", url: "" };
        break;
      case "whatsapp":
        newForm = { ...commonFields, type: "whatsapp", smsText: "", url: "" };
        break;
      case "push":
        newForm = {
          ...commonFields,
          type: "push",
          link: "",
          title: "",
          callToAction: "",
          url: "",
        };
        break;
      case "pushSmsNrt":
        newForm = {
          ...commonFields,
          type: "pushSmsNrt",
          startDate: "",
          endDate: "",
          text: "",
          storeId: "",
        };
        break;
      case "preheader":
        newForm = {
          ...commonFields,
          type: "preheader",
          startDate: "",
          endDate: "",
          sku: "",
          callToAction: "",
          url: "",
        };
        break;
      case "cupon":
        newForm = {
          ...commonFields,
          type: "cupon",
          cuponTypeId: "",
          benefit: "",
          benefitAmount: 0,
          trigger: "",
          message: "",
          storeId: "",
        };
        break;
      case "sampling":
        newForm = {
          ...commonFields,
          type: "sampling",
          typeId: "",
          units: 0,
          storeId: "",
          segmentation: "",
        };
        break;
      case "whatsappCarrousel":
        newForm = {
          ...commonFields,
          type: "whatsappCarrousel",
          skus: [],
          text: "",
          url: "",
        };
        break;
      default:
        console.error("Unknown form type:", formType);
        break;
    }

    append(newForm);
  };

  // const submitHandler = (e: any) => {
  //   e.preventDefault();
  //   // handleSubmit((data: any) => {
  //   //   onSubmit({ CRM: data });
  //   //   if (debug) alert(JSON.stringify(data.strategies, null, 2));
  //   // })();
  // };

  return (
    <>
      <FormControl marginTop="40px">
        <FormLabel htmlFor="formType" {...fieldData.labelProps}>
          Selecciona formulario
        </FormLabel>
        <Select
          id="formType"
          value={formType}
          onChange={(e) => setFormType(e.target.value)}
          {...fieldData.inputProps}
        >
          <option value="" disabled>
            Selecciona una opción
          </option>
          <option value="email">Email</option>
          <option value="trigger">Trigger</option>
          <option value="banner">Banner</option>
          <option value="sms">SMS</option>
          <option value="whatsapp">Whatsapp</option>
          <option value="push">Push</option>
          <option value="pushSmsNrt">Push SMS NRT</option>
          <option value="preheader">Preheader</option>
          <option value="cupon">Cupon</option>
          <option value="sampling">Sampling</option>
          <option value="whatsappCarrousel">Whatsapp Carrousel</option>
        </Select>
      </FormControl>
      <Button mt={4} colorScheme="blue" marginBottom="20px" onClick={addForm}>
        Agregar Formulario
      </Button>
      {!!fields?.length && (
        <Box
          //   as="form"
          p={8}
          borderWidth="1px"
          borderRadius="md"
          boxShadow="md"
          bg="white"
          width="100%"
          // onSubmit={submitHandler}
          //   {...extraProps}
        >
          {fields.map((field: any, index) => {
            console.log("fieldAny: ", field);
            return (
              <div
                key={field.id}
                style={{
                  border: "1px solid #ccc",
                  padding: 16,
                  display: "flex",
                  flexDirection: "row",
                  gap: 16,
                  marginTop: 10,
                }}
              >
                <VStack align="stretch" spacing={2}>
                  <FormLabel htmlFor="services" {...fieldData.labelProps}>
                    {field.type}
                  </FormLabel>
                  <HStack>
                    <FormControl>
                      <FormLabel
                        htmlFor={`${fieldData?.formName}.subProducts.${index}.budget`}
                        type="number"
                        {...fieldData.labelProps}
                      >
                        Presupuesto
                      </FormLabel>
                      <Input
                        id={`${fieldData?.formName}.subProducts.${index}.budget`}
                        type="number"
                        {...fieldData.register(
                          `${fieldData?.formName}.subProducts.${index}.budget` as const,
                          { valueAsNumber: true }
                        )}
                        {...fieldData.inputProps}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel
                        htmlFor={`${fieldData?.formName}.subProducts.${index}.base`}
                        {...fieldData.labelProps}
                      >
                        Base
                      </FormLabel>
                      <Input
                        id={`${fieldData?.formName}.subProducts.${index}.base`}
                        type="number"
                        {...fieldData.register(
                          `${fieldData?.formName}.subProducts.${index}.base` as const,
                          { valueAsNumber: true }
                        )}
                        {...fieldData.inputProps}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel
                        htmlFor={`${fieldData?.formName}.subProducts.${index}.internalCampaignName`}
                        {...fieldData.labelProps}
                      >
                        Cadena
                      </FormLabel>
                      <Input
                        id={`${fieldData?.formName}.subProducts.${index}.internalCampaignName`}
                        {...fieldData.register(
                          `${fieldData?.formName}.subProducts.${index}.internalCampaignName` as const
                        )}
                        {...fieldData.inputProps}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel
                        htmlFor={`${fieldData?.formName}.subProducts.${index}.comments`}
                        {...fieldData.labelProps}
                      >
                        Comentarios
                      </FormLabel>
                      <Textarea
                        id={`${fieldData?.formName}.subProducts.${index}.comments`}
                        {...fieldData.register(
                          `${fieldData?.formName}.subProducts.${index}.comments` as const
                        )}
                        {...fieldData.inputProps}
                      />
                    </FormControl>

                    {/* Render additional fields based on form type */}
                    {field.type === "email" && (
                      <FormControl>
                        <FormLabel
                          htmlFor={`${fieldData?.formName}.subProducts.${index}.shippingDate`}
                        >
                          Shipping Date
                        </FormLabel>
                        <Input
                          id={`${fieldData?.formName}.subProducts.${index}.shippingDate`}
                          type="date"
                          {...fieldData.register(
                            `${fieldData?.formName}.subProducts.${index}.shippingDate` as const
                          )}
                        />
                      </FormControl>
                    )}

                    {field.type === "trigger" && (
                      <>
                        <FormControl>
                          <FormLabel
                            htmlFor={`${fieldData?.formName}.subProducts.${index}.quantityMonths`}
                          >
                            Quantity Months
                          </FormLabel>
                          <Input
                            id={`${fieldData?.formName}.subProducts.${index}.quantityMonths`}
                            type="number"
                            {...fieldData.register(
                              `${fieldData?.formName}.subProducts.${index}.quantityMonths` as const,
                              { valueAsNumber: true }
                            )}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel
                            htmlFor={`${fieldData?.formName}.subProducts.${index}.triggerTypeId`}
                          >
                            Trigger Type ID
                          </FormLabel>
                          <Input
                            id={`${fieldData?.formName}.subProducts.${index}.triggerTypeId`}
                            {...fieldData.register(
                              `${fieldData?.formName}.subProducts.${index}.triggerTypeId` as const
                            )}
                          />
                        </FormControl>
                      </>
                    )}

                    {field.type === "banner" && (
                      <>
                        <FormControl>
                          <FormLabel
                            htmlFor={`${fieldData?.formName}.subProducts.${index}.startDate`}
                          >
                            Start Date
                          </FormLabel>
                          <Input
                            id={`${fieldData?.formName}.subProducts.${index}.startDate`}
                            type="date"
                            {...fieldData.register(
                              `${fieldData?.formName}.subProducts.${index}.startDate` as const
                            )}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel
                            htmlFor={`${fieldData?.formName}.subProducts.${index}.endDate`}
                          >
                            End Date
                          </FormLabel>
                          <Input
                            id={`${fieldData?.formName}.subProducts.${index}.endDate`}
                            type="date"
                            {...fieldData.register(
                              `${fieldData?.formName}.subProducts.${index}.endDate` as const
                            )}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel
                            htmlFor={`${fieldData?.formName}.subProducts.${index}.sku`}
                          >
                            SKU
                          </FormLabel>
                          <Input
                            id={`${fieldData?.formName}.subProducts.${index}.sku`}
                            {...fieldData.register(
                              `${fieldData?.formName}.subProducts.${index}.sku` as const
                            )}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel
                            htmlFor={`${fieldData?.formName}.subProducts.${index}.callToAction`}
                          >
                            Call to Action
                          </FormLabel>
                          <Input
                            id={`${fieldData?.formName}.subProducts.${index}.callToAction`}
                            {...fieldData.register(
                              `${fieldData?.formName}.subProducts.${index}.callToAction` as const
                            )}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel
                            htmlFor={`${fieldData?.formName}.subProducts.${index}.url`}
                          >
                            URL
                          </FormLabel>
                          <Input
                            id={`${fieldData?.formName}.subProducts.${index}.url`}
                            {...fieldData.register(
                              `${fieldData?.formName}.subProducts.${index}.url` as const
                            )}
                          />
                        </FormControl>
                      </>
                    )}
                  </HStack>
                </VStack>

                {/* Repeat similar blocks for other form types, e.g., sms, whatsapp, push, etc. */}

                <Button mt={2} colorScheme="red" onClick={() => remove(index)}>
                  <DeleteIcon />
                </Button>
              </div>
            );
          })}

          {/* <HStack spacing={4} mt={4}>
        <Button colorScheme="blue" onClick={addForm}>
          Agregar Formulario
        </Button>
        {onCancel && (
          <Button colorScheme="gray" onClick={onCancel}>
            {cancelText ?? "Cancel"}
          </Button>
        )}
        <Button type="submit" colorScheme="green">
          {submitText ?? "Submit"}
        </Button>
      </HStack> */}
        </Box>
      )}
    </>
  );
};

export default CRMForm;
