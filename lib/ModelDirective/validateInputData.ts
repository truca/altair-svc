// @ts-nocheck
import { getNullableType, GraphQLObjectType, GraphQLSchema } from "graphql";

import { isEmpty, isPlainObject } from "lodash";
import { isNonNullable } from "./util";

export interface ValidateInputDataProps {
  type: GraphQLObjectType;
  schema: GraphQLSchema;
  data: object;
}

// For every null value in the input data
// check that it can be nullable by check the type definition.
export const validateInputData = (props: ValidateInputDataProps) => {
  if (isEmpty(props.data)) {
    throw new Error("data input object is missing");
  }

  const fields = props.type.getFields();

  Object.keys(fields).forEach((key) => {
    const field = fields[key];
    const value = props.data[key];
    // Encountered an input object within the data. Recursively call this function.
    if (isPlainObject(value)) {
      validateInputData({
        schema: props.schema,
        data: value,
        type: getNullableType(field.type) as any,
      });
    } else {
      // The type is normal, not the input one.
      // We need to continue this case just in case we need to add elements to an existing entity
      // TODO: instead of passing the normal type, pass the input type
      if (props.data.id) return;
      // IF the field value provided is null and the field is non nullable
      // OR the field was not provided but is marked as non nullable in the input type
      if (
        (value === null && isNonNullable(field)) ||
        (value === undefined && isNonNullable(field)) ||
        (props.data[key] === null && isNonNullable(field)) ||
        (props.data[key] === undefined && isNonNullable(field))
      ) {
        throw new Error(`${props.type.name}.${field.name} must not be null`);
      }
    }
  });
};
