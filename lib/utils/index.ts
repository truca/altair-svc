import { makeExecutableSchema } from "@graphql-tools/schema";
import { ModelDirective } from "../ModelDirective";
import { StaticModelDirective } from "../StaticModelDirective";
import { createStore, DbTypes } from "../stores/utils";
import { CookieStore, FormsHash, Profile } from "../types";
import { v4 as uuidv4 } from 'uuid';
import { GraphQLID } from "graphql";
import _ from "lodash";
import * as jwt from "jsonwebtoken";
import * as fs from "fs";
import * as path from "path";
import { Store } from "../stores/types";

// Add these imports for schema introspection and directive parsing
import { 
  GraphQLObjectType, 
  GraphQLType, 
  isObjectType, 
  isScalarType, 
  isListType, 
  isNonNullType,
  GraphQLSchema,
  DirectiveNode,
  FieldDefinitionNode
} from "graphql";

// Interface for the function result
export interface VerifyTokenResult {
  decoded?: object | string;
  error?: string;
}
// Secure token verification method
export function verifyToken(token: string, secret: string): VerifyTokenResult {
  if (!token) {
    return { error: "MissingTokenError" };
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, secret);

    // Return the decoded payload if verification is successful
    return { decoded };
  } catch (error: any) {
    // Handle specific token-related errors
    if (error.name === "TokenExpiredError") {
      return { error: "TokenExpiredError" }; // Handle token expiration
    } else if (error.name === "JsonWebTokenError") {
      return { error: "InvalidTokenError" }; // Handle other token-related errors
    } else {
      return { error: "UnknownError" }; // Catch-all for other unknown errors
    }
  }
}

export function generateTokens(profile: Profile) {
  const secretKey = process.env.JWT_SECRET;
  const accessTokenExpiresIn = parseInt(
    process.env.ACCESS_TOKEN_DURATION_SECONDS as string,
    10
  );
  const accessToken = jwt.sign(
    profile,
    secretKey as string,
    { expiresIn: accessTokenExpiresIn } // Token expires in 1 hour
  );

  const refreshTokenExpiresIn = parseInt(
    process.env.REFRESH_TOKEN_DURATION_SECONDS as string,
    10
  );
  const refreshToken = jwt.sign(
    { email: profile.email },
    secretKey as string,
    { expiresIn: refreshTokenExpiresIn } // Token expires in 7 days
  );
  return { accessToken, refreshToken };
}

export function setTokensAsCookies(
  cookieStore: CookieStore,
  tokens: { accessToken: string; refreshToken: string },
  setRefreshToken = true
) {
  if (setRefreshToken) {
    const refreshMaxAge = parseInt(
      process.env.REFRESH_TOKEN_DURATION_SECONDS as string,
      10
    );
    cookieStore.set("refreshToken", tokens.refreshToken, {
      maxAge: refreshMaxAge,
    });
  }

  const maxAge = parseInt(
    process.env.ACCESS_TOKEN_DURATION_SECONDS as string,
    10
  );
  cookieStore.set("accessToken", tokens.accessToken, {
    maxAge,
  });
}

function connectDatabases(schema?: any) {
  // const dbCountEnv = process.env.DB_COUNT || "1";
  // if (!dbCountEnv) throw new Error("DB_COUNT environment variable not set");
  // const dbCount = parseInt(dbCountEnv, 10) || 2; // Default to 2 if not specified

  const dbs: { [key: string]: Store } = {};
  // for (let i = 1; i <= dbCount; i++) {

  const dbType: DbTypes = process.env.DB_ENGINE as DbTypes;
  const dbName: string = process.env.DB_INTERNAL_NAME as string;
  const dbOptions = {
    name: process.env.FIRESTORE_DB_NAME,
  };

  if (!dbType || !dbName) {
    throw new Error("DB_TYPE and DB_NAME environment variables are required");
  }

  dbs[dbName] = createStore(dbType, dbOptions, schema);
  // }

  console.log({ dbs });
  return dbs;
}

export function makeContext({
  context: contextArg,
  schema,
}: {
  context: any;
  schema?: any;
}) {
  const databases = connectDatabases(schema);

  const context = {
    ...contextArg,
    directives: {
      model: { ...databases },
      file: {
        maxSize: 1000000,
        types: ["image/jpeg", "image/png"],
      },
      ...contextArg.directives,
    },
  };

  return context;
}

// Field types mapping
enum FieldType {
  TEXT = "TEXT",
  TEXTAREA = "TEXTAREA", 
  NUMBER = "NUMBER",
  EMAIL = "EMAIL",
  PASSWORD = "PASSWORD",
  CHECKBOX = "CHECKBOX",
  RADIO = "RADIO",
  SELECT = "SELECT",
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
  BUTTON = "BUTTON"
}

enum ValueType {
  STRING = "STRING",
  BOOLEAN = "BOOLEAN", 
  NUMBER = "NUMBER",
  FILE = "FILE",
  MIXED = "MIXED"
}

interface FieldOption {
  label: string;
  value: string;
}

interface FieldValidation {
  label: string;
  value: string;
  valueType: ValueType;
  errorMessage: string;
}

interface Field {
  label: string;
  field?: string;
  type: FieldType;
  defaultValue?: string | number | boolean | string[] | number[];
  options?: FieldOption[];
  validation?: FieldValidation[];
  // Position properties for multistep forms
  step?: number;
  row?: number | null; // null for unpositioned fields, gets assigned during processing
}

interface FormStep {
  stepNumber: number;
  gridTemplateAreas: string;
  gridTemplateColumns: string;
}

// Function to extract directive arguments
function getDirectiveArgument(directives: readonly DirectiveNode[], directiveName: string, argName: string): any {
  const directive = directives.find(d => d.name.value === directiveName);
  if (!directive) return null;
  
  const arg = directive.arguments?.find(a => a.name.value === argName);
  if (!arg) return null;
  
  // Helper function to parse any value type
  function parseValue(value: any): any {
    switch (value.kind) {
      case 'StringValue':
        return value.value;
      case 'BooleanValue':
        return value.value;
      case 'IntValue':
        return parseInt(value.value);
      case 'FloatValue':
        return parseFloat(value.value);
      case 'ListValue':
        return value.values.map((v: any) => parseValue(v));
      case 'ObjectValue':
        const obj: any = {};
        value.fields.forEach((field: any) => {
          obj[field.name.value] = parseValue(field.value);
        });
        return obj;
      case 'NullValue':
        return null;
      default:
        console.warn(`Unhandled directive argument type: ${value.kind}`);
        return null;
    }
  }
  
  return parseValue(arg.value);
}

// Function to derive field type from GraphQL type and directives
function deriveFieldType(field: any, directives: readonly DirectiveNode[]): FieldType {
  // Check for directive-specific types first
  if (getDirectiveArgument(directives, 'selectFrom', 'values') || 
      getDirectiveArgument(directives, 'selectFrom', 'optionValues') ||
      getDirectiveArgument(directives, 'selectFrom', 'table')) {
    return FieldType.SELECT;
  }
  
  if (getDirectiveArgument(directives, 'selectManyFrom', 'values') ||
      getDirectiveArgument(directives, 'selectManyFrom', 'optionValues')) {
    return FieldType.SELECT; // Will be handled as multi-select in options
  }
  
  if (getDirectiveArgument(directives, 'hidden', 'value') === true ||
      getDirectiveArgument(directives, 'hidden', 'cond')) {
    return FieldType.HIDDEN;
  }
  
  // Derive from GraphQL type
  let baseType = field.type;
  while (isNonNullType(baseType) || isListType(baseType)) {
    baseType = baseType.ofType;
  }
  
  if (baseType.name === 'Boolean') return FieldType.CHECKBOX;
  if (baseType.name === 'DateTime') return FieldType.DATETIME;
  if (baseType.name === 'Int' || baseType.name === 'Float') return FieldType.NUMBER;
  if (baseType.name === 'File') return FieldType.FILE;
  
  return FieldType.TEXT;
}

// Function to generate field options from directives
function generateFieldOptions(directives: readonly DirectiveNode[]): FieldOption[] | undefined {
  // Check @selectFrom directive
  const stringValues = getDirectiveArgument(directives, 'selectFrom', 'values');
  const optionValues = getDirectiveArgument(directives, 'selectFrom', 'optionValues'); 
  const table = getDirectiveArgument(directives, 'selectFrom', 'table');
  
  // Check @selectManyFrom directive
  const manyStringValues = getDirectiveArgument(directives, 'selectManyFrom', 'values');
  const manyOptionValues = getDirectiveArgument(directives, 'selectManyFrom', 'optionValues');
  
  const values = stringValues || manyStringValues;
  const options = optionValues || manyOptionValues;
  
  console.log('generateFieldOptions debug:', {
    stringValues,
    optionValues,
    table,
    manyStringValues,
    manyOptionValues,
    values,
    options
  });
  
  if (options && Array.isArray(options)) {
    const mappedOptions = options.map(opt => ({
      label: opt.label || opt.value,
      value: opt.value
    }));
    console.log('Generated options from optionValues:', mappedOptions);
    return mappedOptions;
  }
  
  if (values && Array.isArray(values)) {
    const mappedValues = values.map(val => ({
      label: val,
      value: val
    }));
    console.log('Generated options from values:', mappedValues);
    return mappedValues;
  }
  
  // For table-based options, we'll return empty array and let the frontend handle it
  if (table) {
    console.log('Table-based options detected:', table);
    return [];
  }
  
  return undefined;
}

// Function to generate default value from directives
function generateDefaultValue(directives: readonly DirectiveNode[]): any {
  const defaultValue = getDirectiveArgument(directives, 'default', 'value');
  if (defaultValue !== null) return defaultValue;
  
  const parentAttribute = getDirectiveArgument(directives, 'defaultFrom', 'parentAttribute');
  if (parentAttribute) {
    // This would be resolved at runtime with parent context
    return undefined;
  }
  
  return undefined;
}

// Function to generate validation rules
function generateValidation(field: any, directives: readonly DirectiveNode[]): FieldValidation[] {
  const validations: FieldValidation[] = [];
  
  // Add required validation for NonNull types
  let baseType = field.type;
  let isRequired = false;
  if (isNonNullType(baseType)) {
    isRequired = true;
    baseType = baseType.ofType;
  }
  
  if (isRequired) {
    validations.push({
      label: "required",
      value: "true", 
      valueType: ValueType.BOOLEAN,
      errorMessage: "This field is required"
    });
  }
  
  // Add type validation
  let valueType = ValueType.STRING;
  if (baseType.name === 'Boolean') valueType = ValueType.BOOLEAN;
  if (baseType.name === 'Int' || baseType.name === 'Float') valueType = ValueType.NUMBER;
  
  validations.push({
    label: "type",
    value: valueType.toLowerCase(),
    valueType: ValueType.STRING,
    errorMessage: `${field.name} should be a ${valueType.toLowerCase()}`
  });
  
  return validations;
}

// Main function to generate fields from GraphQL type
function generateFieldsFromType(schema: GraphQLSchema, typeName: string): Field[] {
  const type = schema.getType(typeName) as GraphQLObjectType;
  if (!type || !isObjectType(type)) {
    return [];
  }
  
  const fields = type.getFields();
  const generatedFields: Field[] = [];
  
  Object.values(fields).forEach(field => {
    const directives = field.astNode?.directives || [];
    
    // Skip if field has @hidden directive with value: true
    const hiddenValue = getDirectiveArgument(directives, 'hidden', 'value');
    if (hiddenValue === true) return;
    
    // Skip system fields
    if (['createdAt', 'updatedAt', 'id'].includes(field.name)) return;
    
    const fieldType = deriveFieldType(field, directives);
    const options = generateFieldOptions(directives);
    const defaultValue = generateDefaultValue(directives);
    const validation = generateValidation(field, directives);
    
    // Get field name override from @from directive
    const fromParent = getDirectiveArgument(directives, 'from', 'parentAttribute');
    const actualFieldName = fromParent || field.name;
    
         // Extract position properties from @position directive
     const hasPositionDirective = directives.some(d => d.name.value === 'position');
     const positionStep = getDirectiveArgument(directives, 'position', 'step');
     const positionRow = getDirectiveArgument(directives, 'position', 'row');
     
     // For fields with position directive, use specified values
     // For fields without position directive, assign to step 0 with row TBD (will be calculated later)
     const fieldStep = hasPositionDirective ? (positionStep ?? 1) - 1 : 0;
     const fieldRow = hasPositionDirective ? (positionRow ?? 1) : null; // null indicates it needs to be calculated
     
     const generatedField = {
       label: field.name,
       field: actualFieldName !== field.name ? actualFieldName : undefined,
       type: fieldType,
       defaultValue,
       options,
       validation,
       step: fieldStep,
       row: fieldRow
     };
    
    console.log(`Generated field for ${field.name}:`, generatedField);
    generatedFields.push(generatedField);
  });
  
  return generatedFields;
}

export function makeSchema({
  typeDefs,
  formTypes,
  queries = {},
  mutations = {},
}: {
  typeDefs: string;
  formTypes: Record<string, string>;
  queries?: { [key: string]: () => object };
  mutations?: { [key: string]: () => object };
  subscriptions?: { [key: string]: () => object };
}) {
  const resolvers = {
    ID: GraphQLID,
    Query: {
      form: async (_: any, { type }: { type: string }, context: any) => {
        // Generate fields from schema directives
        try {
          const schema = context.schema;
          console.log({ type, schema });
          if (schema) {
            // Convert form type to GraphQL type name
            const graphqlTypeName = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
            const generatedFields = generateFieldsFromType(schema, graphqlTypeName);
            
                         if (generatedFields.length > 0) {
               // Generate FormStep objects with CSS Grid layout information
               const formSteps = organizeFieldsIntoSteps(generatedFields);
               
               return { 
                 fields: generatedFields,
                 steps: formSteps
               };
             }
          }
        } catch (error) {
          console.error('Error generating fields from schema:', error);
        }
        
                 return {
           fields: [],
           steps: []
         };
      },
      me: async (
        _: any,
        params: { email: string },
        context: any,
        info: any
      ) => {
        const profileType = context?.typeMap?.Profile;
        const args = {
          where: { email: params.email || context?.session?.email },
        };
        return StaticModelDirective.findOneQueryResolver(profileType)(
          _,
          args,
          context,
          info
        );
      },
      getServicesBetweenDates: async (
        _: any,
        params: any,
        context: any,
        info: any
      ) => {
        const profileType = context?.typeMap?.Service;
        const implementationDateValue =
          params.startDate && params.endDate
            ? `>=${params.startDate},<=${params.endDate}`
            : params.startDate
              ? `>=${params.startDate}`
              : params.endDate
                ? `<=${params.endDate}`
                : null;
        const args = {
          ...params,
          pageSize: params.pageSize || 10,
          page: params.page || 1,
          where: {
            ...params.where,
            ...(params.serviceType ? { serviceType: params.serviceType } : {}),
            ...(implementationDateValue ? { implementationDate: implementationDateValue } : {}),
          },
        };
        return StaticModelDirective.findQueryResolver(profileType)(
          _,
          args,
          context,
          info
        );
      },
      ...queries,
    },
    Mutation: {
      readTextFile: async (_: any, { file }: { file: any }) => {
        const textContent = await file.text();
        return textContent;
      },
      saveFile: async (_: any, { file }: { file: any }) => {
        try {
          const fileArrayBuffer = await file.arrayBuffer();
          await fs.promises.writeFile(
            path.join(__dirname, file.name),
            new Uint8Array(fileArrayBuffer)
          );
        } catch (e) {
          console.log({ e });
          return false;
        }
        return true;
      },
      login: async (
        _: any,
        params: { email: string; password: string },
        context: any
      ) => {
        const info = null;

        const profile = await context.directives.model.store.findOne(
          {
            where: { email: params.email },
            type: { name: "Profile" },
          },
          context,
          info,
          true
        );

        if (!profile) {
          throw new Error("Usuario no encontrado");
        }

        if (profile.password !== params.password) {
          throw new Error("Contraseña incorrecta");
        }

        const tokens = generateTokens(profile);
        setTokensAsCookies(context.cookieStore, tokens);

        return { token: tokens.accessToken, country: profile.country };
      },

      register: async (
        _: any,
        params: {
          email: string;
          password: string;
          username?: string;
          profilePicture?: string;
        },
        context: any
      ) => {
        const info = null;

        const existingUser = await context.directives.model.store.findOne(
          {
            where: { email: params.email, deletedAt: null },
            type: { name: "Profile" },
          },
          context,
          info,
          true
        );

        if (existingUser) {
          throw new Error("Ya existe un usuario con este email");
        }

        const profile = await context.directives.model.store.create(
          {
            data: {
              ...params,
              role: "user",
              deletedAt: null,
            },
            type: { name: "Profile" },
          },
          context,
          info
        );

        if (!profile) {
          throw new Error("Error al crear el usuario");
        }

        const tokens = generateTokens(profile);
        setTokensAsCookies(context.cookieStore, tokens);

        if (!tokens.accessToken) {
          throw new Error("Error al generar el token de autenticación");
        }

        return { token: tokens.accessToken, country: profile.country };
      },
      updateMe: async (
        _: any,
        params: { id: string; profile: Profile },
        context: any
      ) => {
        // update the profile of the user
        const info = null;
        const profile = await context.directives.model.store.update(
          {
            where: { _id: params.id, deletedAt: null },
            data: {
              ...params.profile,
            },
            upsert: false,
            type: { name: "Profile" },
          },
          context,
          info,
          true
        );
        return profile;
      },
      ...mutations,
    },
  };

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    schemaDirectives: {
      model: ModelDirective,
    },
  });

  // Ensure schema is available in context for resolvers
  const originalQuery = resolvers.Query;
  resolvers.Query = {
    ...originalQuery,
    form: async (_: any, { type }: { type: string }, context: any) => {
      // Add schema to context
      const contextWithSchema = { ...context, schema };
      return originalQuery.form(_, { type }, contextWithSchema);
    }
  };

  return schema;
}

// Function to group fields by step and row
function groupFieldsByStepAndRow(fields: Field[]): Map<number, Map<number, Field[]>> {
  const stepMap = new Map<number, Map<number, Field[]>>();
  
  // First pass: group positioned fields (those with explicit row numbers)
  const positionedFields = fields.filter(field => field.row !== null);
  const unpositionedFields = fields.filter(field => field.row === null);
  
  // Process positioned fields first
  positionedFields.forEach(field => {
    const step = field.step!;
    const row = field.row!;
    
    if (!stepMap.has(step)) {
      stepMap.set(step, new Map<number, Field[]>());
    }
    
    const rowMap = stepMap.get(step)!;
    if (!rowMap.has(row)) {
      rowMap.set(row, []);
    }
    
    rowMap.get(row)!.push(field);
  });
  
  // Process unpositioned fields - assign rows within their designated steps
  unpositionedFields.forEach((field) => {
    const step = field.step!; // Step is already assigned (0 for unpositioned fields)
    
    // Find the highest row number in this step to stack unpositioned fields at the bottom
    const stepRowMap = stepMap.get(step) || new Map<number, Field[]>();
    const maxRowInStep = stepRowMap.size > 0 ? Math.max(...stepRowMap.keys()) : 0;
    
    // Assign the next available row
    const row = maxRowInStep + 1;
    
    // Update the field object with the calculated row
    field.row = row;
    
    if (!stepMap.has(step)) {
      stepMap.set(step, new Map<number, Field[]>());
    }
    
    const rowMap = stepMap.get(step)!;
    if (!rowMap.has(row)) {
      rowMap.set(row, []);
    }
    
    rowMap.get(row)!.push(field);
  });
  
  return stepMap;
}

// Function to generate grid-template-areas for a step
function generateGridTemplateAreas(stepFields: Map<number, Field[]>): string {
  const sortedRows = Array.from(stepFields.keys()).sort((a, b) => a - b);
  const maxFieldsInAnyRow = Math.max(...Array.from(stepFields.values()).map(fields => fields.length));
  
  const rowStrings = sortedRows.map(rowNumber => {
    const rowFields = stepFields.get(rowNumber)!;
    const fieldNames = rowFields.map(field => field.label.replace(/\s+/g, '_')); // Replace spaces with underscores for CSS grid
    
    // For rows with single fields (typically unpositioned fields at bottom),
    // place them in the first column and fill remaining columns with dots
    if (fieldNames.length === 1 && maxFieldsInAnyRow > 1) {
      const singleField = fieldNames[0];
      const result = [singleField];
      // Fill remaining columns with dots
      while (result.length < maxFieldsInAnyRow) {
        result.push('.');
      }
      return `"${result.join(' ')}"`;
    }
    
    // For rows with multiple fields, pad to match maximum if needed
    while (fieldNames.length < maxFieldsInAnyRow) {
      fieldNames.push('.'); // Use '.' for empty grid cells
    }
    
    return `"${fieldNames.join(' ')}"`;
  });
  
  return rowStrings.join(' ');
}

// Function to generate grid-template-columns for a step
function generateGridTemplateColumns(stepFields: Map<number, Field[]>): string {
  const maxFieldsInAnyRow = Math.max(...Array.from(stepFields.values()).map(fields => fields.length));
  return Array(maxFieldsInAnyRow).fill('1fr').join(' ');
}

// Function to organize fields into FormStep objects (without including fields)
function organizeFieldsIntoSteps(fields: Field[]): FormStep[] {
  const stepMap = groupFieldsByStepAndRow(fields);
  const formSteps: FormStep[] = [];
  
  // Sort steps by step number
  const sortedStepNumbers = Array.from(stepMap.keys()).sort((a, b) => a - b);
  
  sortedStepNumbers.forEach(stepNumber => {
    const stepRowMap = stepMap.get(stepNumber)!;
    
    const formStep: FormStep = {
      stepNumber,
      gridTemplateAreas: generateGridTemplateAreas(stepRowMap),
      gridTemplateColumns: generateGridTemplateColumns(stepRowMap)
    };
    
    formSteps.push(formStep);
  });
  
  return formSteps;
}

export function generateUUID(): string {
  return uuidv4();
} 