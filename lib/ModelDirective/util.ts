import {
  getNamedType,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLSchema,
} from "graphql";
import { get } from "lodash";

export const toInputObjectTypeName = (name: string): string =>
  `${name}InputType`;

export const isValidInputFieldType = (type: any): boolean => {
  return !((getNamedType(type) as unknown) instanceof GraphQLObjectType);
};

export const getInputType = (
  typeName: string,
  schema: GraphQLSchema
): GraphQLInputObjectType => {
  const type = schema.getType(toInputObjectTypeName(typeName));
  return type as GraphQLInputObjectType;
};

export const isNonNullable = (type: any) =>
  type.astNode && type.astNode.type.kind === "NonNullType";

export const getObjectTypeFromInputType = (
  typeName: string,
  schema: GraphQLSchema
): GraphQLObjectType => {
  const type = schema.getType(typeName.replace("InputType", ""));
  return type as GraphQLObjectType;
};

export const hasDirective = (directive: any, type: any) => {
  const directives = get(type, ["astNode", "directives"]);
  if (directives) {
    return directives.find((d: any) => d.name.value === directive);
  }
  return false;
};

export const getDirectiveParams = (directiveName: any, type: any) => {
  const directive = hasDirective(directiveName, type);
  if (!directive) return {};

  return directive.arguments.reduce((acc: any, arg: any) => {
    // handle array case
    if (arg.value.kind === "ListValue") {
      acc[arg.name.value] = arg.value.values.map((v: any) => v.value);
      return acc;
    }

    acc[arg.name.value] = arg.value.value;
    return acc;
  }, {});
};

export const cleanNestedObjects = (nestedObjects: any) => {
  const result: { [key: string]: any } = {};
  Object.keys(nestedObjects ?? {}).forEach((key) => {
    if (nestedObjects[key] === null) {
      result[key] = [];
    }
    if (Array.isArray(nestedObjects[key])) {
      result[key] = nestedObjects[key].filter((v: any) => v);
    }
    if (typeof nestedObjects[key] === "object") {
      result[key] = nestedObjects[key];
    }
  });

  return result;
};
