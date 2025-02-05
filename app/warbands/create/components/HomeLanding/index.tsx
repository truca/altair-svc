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

const HomeLandingForm = ({
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
    name: `${fieldData?.formName}.forms`,
  });

  const addForm = () => {
    let newForm = {};
    switch (formType) {
      case "HomeLandingForm":
        newForm = {
          type: formType,
          budget: 0,
          startDate: "",
          endDate: "",
          comment: "",
        };
        break;
      case "HomeLandingShowcase6Form":
      case "HomeLandingTheLastForm":
      case "HomeLandingTapeForm":
      case "HomeOtherBannerForm":
        newForm = {
          type: formType,
          budget: 0,
          startDate: "",
          endDate: "",
          comment: "",
          visualKey: "",
          sku: "",
          url: "",
        };
        break;
      default:
        break;
    }
    append(newForm);
  };

  const submitHandler = (e: any) => {
    e.preventDefault();
    // handleSubmit((data: any) => {
    //   onSubmit({ CRM: data });
    //   if (debug) alert(JSON.stringify(data.strategies, null, 2));
    // })();
  };

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
          <option value="HomeLandingForm">Landing</option>
          <option value="HomeLandingShowcase6Form">Vitrina 6</option>
          <option value="HomeLandingTheLastForm">Lo último</option>
          <option value="HomeLandingTapeForm">Huincha</option>
          <option value="HomeOtherBannerForm">Otros Banners</option>
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
          onSubmit={submitHandler}
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
                        htmlFor={`${fieldData?.formName}.forms.${index}.budget`}
                        type="number"
                        {...fieldData.labelProps}
                      >
                        Presupuesto
                      </FormLabel>
                      <Input
                        id={`${fieldData?.formName}.forms.${index}.budget`}
                        type="number"
                        {...fieldData.register(
                          `${fieldData?.formName}.forms.${index}.budget` as const,
                          { valueAsNumber: true }
                        )}
                        {...fieldData.inputProps}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel
                        htmlFor={`${fieldData?.formName}.forms.${index}.visualKey`}
                        {...fieldData.labelProps}
                      >
                        Llamado
                      </FormLabel>
                      <Input
                        id={`${fieldData?.formName}.forms.${index}.visualKey`}
                        {...fieldData.register(
                          `${fieldData?.formName}.forms.${index}.visualKey` as const
                        )}
                        {...fieldData.inputProps}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel
                        htmlFor={`${fieldData?.formName}.forms.${index}.sku`}
                        {...fieldData.labelProps}
                      >
                        SKU
                      </FormLabel>
                      <Input
                        id={`${fieldData?.formName}.forms.${index}.sku`}
                        {...fieldData.register(
                          `${fieldData?.formName}.forms.${index}.sku` as const
                        )}
                        {...fieldData.inputProps}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel
                        htmlFor={`${fieldData?.formName}.forms.${index}.url`}
                        {...fieldData.labelProps}
                      >
                        Url
                      </FormLabel>
                      <Textarea
                        id={`${fieldData?.formName}.forms.${index}.url`}
                        {...fieldData.register(
                          `${fieldData?.formName}.forms.${index}.url` as const
                        )}
                        {...fieldData.inputProps}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel
                        htmlFor={`${fieldData?.formName}.forms.${index}.comments`}
                        {...fieldData.labelProps}
                      >
                        Comentarios
                      </FormLabel>
                      <Textarea
                        id={`${fieldData?.formName}.forms.${index}.comments`}
                        {...fieldData.register(
                          `${fieldData?.formName}.forms.${index}.comments` as const
                        )}
                        {...fieldData.inputProps}
                      />
                    </FormControl>

                    {/* Render additional fields based on form type */}
                    {field.type === "email" && (
                      <FormControl>
                        <FormLabel htmlFor={`forms.${index}.shippingDate`}>
                          Shipping Date
                        </FormLabel>
                        <Input
                          id={`forms.${index}.shippingDate`}
                          type="date"
                          {...fieldData.register(
                            `forms.${index}.shippingDate` as const
                          )}
                        />
                      </FormControl>
                    )}

                    {field.type === "trigger" && (
                      <>
                        <FormControl>
                          <FormLabel htmlFor={`forms.${index}.quantityMonths`}>
                            Quantity Months
                          </FormLabel>
                          <Input
                            id={`forms.${index}.quantityMonths`}
                            type="number"
                            {...fieldData.register(
                              `forms.${index}.quantityMonths` as const,
                              { valueAsNumber: true }
                            )}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel htmlFor={`forms.${index}.triggerTypeId`}>
                            Trigger Type ID
                          </FormLabel>
                          <Input
                            id={`forms.${index}.triggerTypeId`}
                            {...fieldData.register(
                              `forms.${index}.triggerTypeId` as const
                            )}
                          />
                        </FormControl>
                      </>
                    )}

                    {field.type === "banner" && (
                      <>
                        <FormControl>
                          <FormLabel htmlFor={`forms.${index}.startDate`}>
                            Start Date
                          </FormLabel>
                          <Input
                            id={`forms.${index}.startDate`}
                            type="date"
                            {...fieldData.register(
                              `forms.${index}.startDate` as const
                            )}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel htmlFor={`forms.${index}.endDate`}>
                            End Date
                          </FormLabel>
                          <Input
                            id={`forms.${index}.endDate`}
                            type="date"
                            {...fieldData.register(
                              `forms.${index}.endDate` as const
                            )}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel htmlFor={`forms.${index}.sku`}>
                            SKU
                          </FormLabel>
                          <Input
                            id={`forms.${index}.sku`}
                            {...fieldData.register(
                              `forms.${index}.sku` as const
                            )}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel htmlFor={`forms.${index}.callToAction`}>
                            Call to Action
                          </FormLabel>
                          <Input
                            id={`forms.${index}.callToAction`}
                            {...fieldData.register(
                              `forms.${index}.callToAction` as const
                            )}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel htmlFor={`forms.${index}.url`}>
                            URL
                          </FormLabel>
                          <Input
                            id={`forms.${index}.url`}
                            {...fieldData.register(
                              `forms.${index}.url` as const
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

export default HomeLandingForm;
