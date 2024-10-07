import { FieldDefinitionNode } from "graphql";
import { ASTNode, FieldDefinitionNodeType } from "./types";

export function extractDirectiveParams(
  astNode: ASTNode,
  directiveName: string
) {
  const directiveParams: any = {};

  // Iterate over the directives in the AST node
  astNode?.directives?.forEach((directive: any) => {
    if (directive.name.value === directiveName) {
      directive.arguments.forEach((arg: any) => {
        // Get the argument name
        const argName = arg.name.value;

        // Get the values of the argument (assuming ListValue)
        if (arg.value.kind === "ListValue") {
          directiveParams[argName] = arg.value.values.map(
            (val: any) => val.value
          );
        }
      });
    }
  });

  return directiveParams;
}

export function extractFieldDirectiveParams(
  astNode: ASTNode,
  fieldName: string,
  directiveName: string
) {
  // Find the field by name
  const field = astNode.fields?.find((f: any) => f.name.value === fieldName);

  // If field doesn't exist, return null
  if (!field) {
    return null;
  }

  // Find the directive on the field
  const directive = field.directives?.find(
    (d: any) => d.name.value === directiveName
  );

  // If directive doesn't exist, return null
  if (!directive) {
    return null;
  }

  // Convert directive arguments into a key-value object
  const directiveParams: any = {};
  directive.arguments?.forEach((arg: any) => {
    if (arg.value.kind === "ListValue") {
      directiveParams[arg.name.value] = arg.value.values.map(
        (v: any) => v.value
      );
    } else {
      directiveParams[arg.name.value] = arg.value.value;
    }
  });

  return directiveParams;
}

export function getEntityTypeFromField(astNode: ASTNode, fieldName: string) {
  // Find the field in the fields array
  const field = astNode.fields?.find((f: any) => f.name.value === fieldName);

  // Check if the field exists
  if (!field) {
    return null;
  }

  // Navigate through the type to get the NamedType, which contains the entity type
  let fieldType: FieldDefinitionNodeType | undefined = field.type;

  // If the type is a List or NonNull, drill down to the inner type
  while (fieldType?.kind === "ListType" || fieldType?.kind === "NonNullType") {
    fieldType = fieldType.type;
  }

  // Return the name of the type (the entity type)
  return (fieldType as any)?.name?.value;
}

export function getFieldType(astNode: ASTNode, fieldName: string) {
  // Find the field by name
  const field = astNode.fields?.find((f: any) => f.name.value === fieldName);

  // If field doesn't exist, return null
  if (!field) {
    return null;
  }

  // Get the named type (recursively, in case it's a NonNull or List type)
  function getNamedType(type: any) {
    if (type.kind === "NamedType") {
      return type.name.value;
    }
    if (type.kind === "NonNullType" || type.kind === "ListType") {
      return getNamedType(type.type);
    }
    return null;
  }

  const fieldType = getNamedType(field.type);

  // Map GraphQL types to desired output types
  switch (fieldType) {
    case "String":
      return "text";
    case "Int":
    case "Float":
      return "number";
    case "Boolean":
      return "boolean";
    case "ID":
      return "text"; // IDs are typically treated as strings
    default:
      // If it's an array, return "array"
      if (field.type.kind === "ListType") {
        return "array";
      }
      // Otherwise, it's an object (custom types, etc.)
      return "object";
  }
}
