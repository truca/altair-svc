// @ts-nocheck
import {
  getNamedType,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLSchema,
} from "graphql";
import { get } from "lodash";

export const toInputObjectTypeName = (name: string): string =>
  `${name}InputType`;

export const isValidInputFieldType = (type): boolean => {
  return !((getNamedType(type) as unknown) instanceof GraphQLObjectType);
};

export const getInputType = (
  typeName: string,
  schema: GraphQLSchema
): GraphQLInputObjectType => {
  const type = schema.getType(toInputObjectTypeName(typeName));
  return type as GraphQLInputObjectType;
};

export const isNonNullable = (type) =>
  type.astNode && type.astNode.type.kind === "NonNullType";

export const getObjectTypeFromInputType = (
  typeName: string,
  schema: GraphQLSchema
): GraphQLObjectType => {
  const type = schema.getType(typeName.replace("InputType", ""));
  return type as GraphQLObjectType;
};

export const hasDirective = (directive, type) => {
  const directives = get(type, ["astNode", "directives"]);
  if (directives) {
    return directives.find((d) => d.name.value === directive);
  }
  return false;
};

export const getDirectiveParams = (directiveName, type) => {
  const directive = hasDirective(directiveName, type);
  if (!directive) return {};

  return directive.arguments.reduce((acc, arg) => {
    // handle array case
    if (arg.value.kind === "ListValue") {
      acc[arg.name.value] = arg.value.values.map((v) => v.value);
      return acc;
    }

    acc[arg.name.value] = arg.value.value;
    return acc;
  }, {});
};

export const getAllKafkaTopicsFromSchema = (
  schema: GraphQLSchema
): string[] => {
  const types = schema.getTypeMap();
  return Object.keys(types).reduce((acc, key) => {
    const type = types[key];
    const { topic } = getDirectiveParams("subscribe", type);
    if (topic) {
      acc.push(topic);
    }
    return acc;
  }, []);
};

export const cleanNestedObjects = (nestedObjects) => {
  const result = {};
  Object.keys(nestedObjects ?? {}).forEach((key) => {
    if (nestedObjects[key] === null) {
      result[key] = [];
    }
    if (Array.isArray(nestedObjects[key])) {
      result[key] = nestedObjects[key].filter((v) => v);
    }
    if (typeof nestedObjects[key] === "object") {
      result[key] = nestedObjects[key];
    }
  });

  return result;
};
