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

const MediaOnForm = ({
  field: fieldData,
  control,
  getValues,
  watch,
}: FieldComponentProps) => {
  // useEffect(() => {
  //     console.log("Current values:", watchAll);
  //   }, [watchAll]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: `${fieldData?.formName}.strategies`,
  });

  const addForm = () => {
    let newForm = {
      mediumId: "",
      objectiveId: "",
      strategyId: "",
      segmentationId: "",
      purchaseTypeId: "",
      formatsId: "",
      budget: 0,
      commission: 0,
      startDate: "",
      endDate: "",
    };
    append(newForm);
  };

  //   const submitHandler = (e: any) => {
  //     e.preventDefault();
  //     // handleSubmit((data: any) => {
  //     //   onSubmit({ CRM: data });
  //     //   if (debug) alert(JSON.stringify(data.strategies, null, 2));
  //     // })();
  //   };

  return (
    <>
      <Button mt={4} colorScheme="blue" marginBottom="20px" onClick={addForm}>
        Agregar Formulario
      </Button>
      {!!fields?.length && (
        <Box
          p={8}
          borderWidth="1px"
          borderRadius="md"
          boxShadow="md"
          bg="white"
          width="100%"
          //   onSubmit={submitHandler}
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
                        htmlFor={`${fieldData?.formName}.strategies.${index}.mediumId`}
                        type="number"
                        {...fieldData.labelProps}
                      >
                        Medio
                      </FormLabel>
                      <Input
                        id={`${fieldData?.formName}.strategies.${index}.mediumId`}
                        type="number"
                        {...fieldData.register(
                          `${fieldData?.formName}.strategies.${index}.mediumId` as const,
                          { valueAsNumber: true }
                        )}
                        {...fieldData.inputProps}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel
                        htmlFor={`${fieldData?.formName}.strategies.${index}.objectiveId`}
                        {...fieldData.labelProps}
                      >
                        Objetivo
                      </FormLabel>
                      <Input
                        id={`${fieldData?.formName}.strategies.${index}.objectiveId`}
                        {...fieldData.register(
                          `${fieldData?.formName}.strategies.${index}.objectiveId` as const
                        )}
                        {...fieldData.inputProps}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel
                        htmlFor={`${fieldData?.formName}.strategies.${index}.strategyId`}
                        {...fieldData.labelProps}
                      >
                        Estrategia
                      </FormLabel>
                      <Input
                        id={`${fieldData?.formName}.strategies.${index}.strategyId`}
                        {...fieldData.register(
                          `${fieldData?.formName}.strategies.${index}.strategyId` as const
                        )}
                        {...fieldData.inputProps}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel
                        htmlFor={`${fieldData?.formName}.strategies.${index}.segmentationId`}
                        {...fieldData.labelProps}
                      >
                        Segmentacion
                      </FormLabel>
                      <Textarea
                        id={`${fieldData?.formName}.strategies.${index}.segmentationId`}
                        {...fieldData.register(
                          `${fieldData?.formName}.strategies.${index}.segmentationId` as const
                        )}
                        {...fieldData.inputProps}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel
                        htmlFor={`${fieldData?.formName}.strategies.${index}.purchaseTypeId`}
                        {...fieldData.labelProps}
                      >
                        Tipo compra
                      </FormLabel>
                      <Textarea
                        id={`${fieldData?.formName}.strategies.${index}.purchaseTypeId`}
                        {...fieldData.register(
                          `${fieldData?.formName}.strategies.${index}.purchaseTypeId` as const
                        )}
                        {...fieldData.inputProps}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel
                        htmlFor={`${fieldData?.formName}.strategies.${index}.formatId`}
                        {...fieldData.labelProps}
                      >
                        Formato
                      </FormLabel>
                      <Input
                        id={`strategies.${index}.formatId`}
                        {...fieldData.register(
                          `strategies.${index}.formatId` as const
                        )}
                        {...fieldData.inputProps}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel
                        htmlFor={`${fieldData?.formName}.strategies.${index}.budget`}
                        {...fieldData.labelProps}
                      >
                        Presupuesto
                      </FormLabel>
                      <Input
                        id={`strategies.${index}.budget`}
                        {...fieldData.register(
                          `strategies.${index}.budget` as const
                        )}
                        {...fieldData.inputProps}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel
                        htmlFor={`${fieldData?.formName}.strategies.${index}.commission`}
                        {...fieldData.labelProps}
                      >
                        Comisión
                      </FormLabel>
                      <Input
                        id={`strategies.${index}.commission`}
                        {...fieldData.register(
                          `strategies.${index}.commission` as const
                        )}
                        {...fieldData.inputProps}
                      />
                    </FormControl>
                    <FormControl
                      key="startDate"
                      isInvalid={Boolean(field.error?.message)}
                      alignItems="flex-start"
                    >
                      <FormLabel htmlFor="startDate" {...field.labelProps}>
                        Fecha de Inicio
                      </FormLabel>
                      <Input
                        id="startDate"
                        type="date"
                        {...fieldData.register(
                          `${fieldData?.formName}.strategies.${index}.startDate` as const,
                          {
                            required: true,
                          }
                        )}
                        {...field.inputProps}
                      />
                    </FormControl>
                    <FormControl
                      key="endDate"
                      isInvalid={Boolean(field.error?.message)}
                      alignItems="flex-start"
                    >
                      <FormLabel htmlFor="endDate" {...field.labelProps}>
                        Fecha de Término
                      </FormLabel>
                      <Input
                        id="endDate"
                        type="date"
                        {...fieldData.register(
                          `${fieldData?.formName}.strategies.${index}.endDate` as const,
                          {
                            required: true,
                          }
                        )}
                        {...field.inputProps}
                      />
                    </FormControl>
                  </HStack>
                </VStack>

                {/* Repeat similar blocks for other form types, e.g., sms, whatsapp, push, etc. */}

                <Button mt={2} colorScheme="red" onClick={() => remove(index)}>
                  <DeleteIcon />
                </Button>
              </div>
            );
          })}
        </Box>
      )}
    </>
  );
};

export default MediaOnForm;
