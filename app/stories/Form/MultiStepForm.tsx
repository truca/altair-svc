import {
  Button,
  VStack,
  HStack,
  Box,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  useSteps,
  StepSeparator,
  StepTitle,
  StepDescription,
} from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { Text } from "../Text";
import { BasicForm, FormProps } from "./BasicForm";
import { Direction } from "./types";

export function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

interface Step {
  title: string;
  description?: string;
}

export interface MultiStepFormProps extends FormProps {
  steps?: Step[];
  formSx?: React.CSSProperties;
}

export const MultiStepForm: React.FC<MultiStepFormProps> = (
  props: MultiStepFormProps
) => {
  const { fields, initialValues, onSubmit, steps: stepsParam } = props;
  const [values, setValues] = useState(initialValues);

  const totalSteps = stepsParam
    ? stepsParam.length
    : Math.max(...fields.map((field) => field.step as number));

  const steps: Step[] = useMemo(() => {
    if (stepsParam) {
      return stepsParam;
    }
    return Array.from({ length: totalSteps }, (_, i) => ({
      title: `Step ${i + 1}`,
    }));
  }, [stepsParam, totalSteps]);

  const {
    activeStep: currentStep,
    goToNext,
    goToPrevious,
  } = useSteps({
    index: 0,
    count: steps.length + 1,
  });

  const handleSubmit = useCallback(
    (submitValues: any) => {
      if (currentStep === totalSteps - 1) {
        onSubmit(submitValues as any);
      } else {
        goToNext();
      }
    },
    [currentStep, totalSteps, goToNext, onSubmit]
  );

  const stepFields = useMemo(
    () => fields.filter((field) => field.step === currentStep),
    [fields, currentStep]
  );

  return (
    <VStack spacing={4} style={props.containerSx}>
      <Stepper index={currentStep} style={{ width: "100%" }}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <Box flexShrink="0">
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>

      <Box p={4}>
        {stepFields.length ? (
          <BasicForm
            {...props}
            fields={stepFields}
            initialValues={values}
            direction={Direction.COLUMN}
            submitText={currentStep === totalSteps - 1 ? "Submit" : "Next"}
            containerSx={props.formSx}
            onSubmit={(v) => {
              const newValues = { ...values, ...v };
              setValues(newValues);
              handleSubmit(newValues);
            }}
            {...(currentStep > 0
              ? { onCancel: goToPrevious, cancelText: "Back" }
              : {})}
          />
        ) : (
          <>
            <Text>No fields for this step</Text>
            <HStack spacing={4}>
              <Button onClick={goToPrevious}>Back</Button>
              <Button type="submit" onClick={goToNext}>
                Next
              </Button>
            </HStack>
          </>
        )}
      </Box>
    </VStack>
  );
};
