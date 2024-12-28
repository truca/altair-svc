import { MultiStepForm, MultiStepFormProps } from "./MultiStepForm";
import { BasicForm, FormProps } from "./BasicForm";

export function Form(props: MultiStepFormProps) {
  const isMultiStep = props.fields.every((field) =>
    field.hasOwnProperty("step")
  );

  if (isMultiStep) {
    return <MultiStepForm {...props} />;
  }

  return <BasicForm {...props} />;
}

export type { FormProps };
export type { MultiStepFormProps };
