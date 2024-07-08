// @ts-nocheck
import {
  getNamedType,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
} from "graphql";
import {
  getInputType,
  isNonNullable,
  isValidInputFieldType,
  toInputObjectTypeName,
} from "./util";
import { omitResolvers } from "./omitResolvers";
import { mapFileFieldsToFileInputType } from "./mapFileFieldsToFileInputType";

export interface AddInputTypesForObjectTypeProps {
  objectType: GraphQLObjectType;
  schema: GraphQLSchema;
  prefix?: string;
  modifyField?: (field: any, parent: any) => any;
  parent?: any;
}

export const createInputField = (field, inputType) => {
  // Create an input field based on the original field's type.
  // If the field is non nullable or a list then it needs to be wrapped with the correct class.

  let type =
    field.type instanceof GraphQLList ? new GraphQLList(inputType) : inputType;

  if (isNonNullable(field)) {
    type = new GraphQLNonNull(type);
  }

  const inputField = {
    name: inputType.name,
    type,
  };

  return inputField;
};

export const addInputTypesForObjectType = ({
  objectType,
  schema,
  prefix = "",
  modifyField = (field, parent) => field,
  parent = null,
}: AddInputTypesForObjectTypeProps) => {
  // Fields of an input type cannot have resolvers
  let fields = omitResolvers(objectType.getFields());
  // To Do: don't map field type for query type
  fields = mapFileFieldsToFileInputType(fields, schema);

  // Create the corresponding input type.
  // For example, if given `type Foo` will create `input FooInputType`
  let inputObjectType = new GraphQLInputObjectType({
    name: `${prefix}${toInputObjectTypeName(objectType.name)}`,
    fields,
  });

  // Adds the newly created input type to the type map.
  //
  // Note: the GraphQLObjectType fields of the input type have not yet been replaced.
  // However we need a reference to the input type added to the type map for lookups during recursion.
  schema.getTypeMap()[inputObjectType.name] = inputObjectType;

  // Iterate over each field in the input type.
  // If the field's type is not a GraphQLObjectType or a GraphQLList then it is copied as is.
  // If the field's type is a GraphQLObjectType or a GraphQLList
  //  Get the type which the GraphQLList contains
  //  Find (or create if not found) the corresponding input type
  //  Replace the field's type with the input type
  const inputObjectFields = Object.keys(fields).reduce((res, key) => {
    let field = fields[key];

    if (!isValidInputFieldType(field.type)) {
      // Check if the input type already exists
      const inputType = getInputType(
        `${prefix}${(getNamedType(field.type) as any).name}`,
        schema
      );
      if (inputType) {
        field = createInputField(field, inputType);
      } else {
        // Input type does not exist so we need to create it
        const fieldType = getNamedType(field.type);
        const newInputType = addInputTypesForObjectType({
          objectType: fieldType as unknown as GraphQLObjectType,
          schema,
          prefix,
          modifyField,
          parent: objectType,
        });
        field = createInputField(field, newInputType);
      }
    }

    return {
      ...res,
      [key]: modifyField(field, parent),
    };
  }, {});

  // Replace our original inputObjectType with new one containing the modified fields

  inputObjectType = new GraphQLInputObjectType({
    name: inputObjectType.name,
    fields: inputObjectFields,
  });

  schema.getTypeMap()[inputObjectType.name] = inputObjectType;

  return inputObjectType;
};
