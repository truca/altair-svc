export enum ValueType {
  STRING = "STRING",
  BOOLEAN = "BOOLEAN",
  NUMBER = "NUMBER",
  FILE = "FILE",
  MIXED = "MIXED",
}

export enum FieldType {
  TEXT = "TEXT",
  TEXT_ARRAY = "TEXT_ARRAY",
  TEXTAREA = "TEXTAREA",
  NUMBER = "NUMBER",
  EMAIL = "EMAIL",
  PASSWORD = "PASSWORD",
  CHECKBOX = "CHECKBOX",
  RADIO = "RADIO",
  SELECT = "SELECT",
  MULTISELECT = "MULTISELECT",
  SMART_SELECT = "SMART_SELECT",
  DATE = "DATE",
  TIME = "TIME",
  DATETIME = "DATETIME",
  FILE = "FILE",
  IMAGE = "IMAGE",
  URL = "URL",
  TEL = "TEL",
  COLOR = "COLOR",
  RANGE = "RANGE",
  SEARCH = "SEARCH",
  HIDDEN = "HIDDEN",
  SUBMIT = "SUBMIT",
  RESET = "RESET",
  BUTTON = "BUTTON",
}

export interface FieldValidation {
  label: string;
  value: string;
  valueType: ValueType;
  errorMessage: string;
}

export interface FieldOption {
  label: string;
  value: string;
}

export interface Field {
  label: string;
  // In case label doesnt match the field name
  field?: string;
  type: FieldType;
  defaultValue?: string | number | boolean | string[] | number[];
  // String is for when the options exist in a model.
  // The model can also have an options attribute for nested options
  options?: FieldOption[] | string;
  // When the options exist in a model, what attribute use as label and value
  optionsMap?: { label: string; value: string } & Record<string, string>;
  validation?: FieldValidation[];
  placeholder?: string; // From @meta directive
  hidden?: string; // Stringified condition object from @hidden(cond: ...)
  // Table-related attributes for SmartForm
  entity?: string; // Table name from @selectFrom/@selectManyFrom
  labelAttribute?: string; // Label attribute from directive
  valueAttribute?: string; // Value attribute from directive  
  dependentField?: string; // Dependent field from directive
  isMulti?: boolean; // For SMART_SELECT with multiple selection
  maxValue?: string;
  valuePerOption?: string;
  component?: string;
}

export interface Profile {
  id: string;
  email: string;
  password: string;
  username?: string;
  profilePicture?: string;
  createdAt?: Date;
  updatedAt?: Date;
  roles?: string[];
}

export type FormTypes = Record<string, string>;
export type Form = Field[];
export type FormsHash = { [key: string]: Form };

export interface CookieStore {
  get: (key: string) => string;
  set: (key: string, value: string, options: any) => void;
  remove: (key: string) => void;
}

export interface Context {
  req: any;
  res: any;
  directives: any;
  session: Profile;
  cookieStore: CookieStore;
}
