import { InternalField } from "@/app/stories/Form/types";
import { Control, UseFormGetValues, UseFormWatch } from "react-hook-form";

export interface FieldComponentProps {
  field: InternalField;
  control?: any;
  getValues?: UseFormGetValues<{}>;
  watch: any;
}
