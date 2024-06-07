import { DocumentNode, gql } from "@apollo/client";
import { getFieldnamesForType } from "../SmartList/getQueriesForType";

export const getQueryStringForType = async (type: string) => {
  const { fieldNames } = await getFieldnamesForType(type);
  const query = `${type}(where: { id: $id }) @include(if: $include) { ${fieldNames?.join(" ")} }`;
  return { query, fieldNames };
};

export async function getQueryForType(
  type: string
): Promise<{ query: DocumentNode }> {
  const { query: entityQuery } = await getQueryStringForType(type);
  const query = gql`
    query Form($id: ID, $type: FormType, $include: Boolean = false) {
      form(type: $type) {
        fields {
          label
          type
          defaultValue
          validation {
            label
            value
            valueType
            errorMessage
          }
        }
      }
      ${entityQuery}
    }
  `;

  return { query };
}

export function capitalizeFirstLetter(text: string) {
  return text.replace(/^\w/, (c: string) => c.toUpperCase());
}

export async function getCreateMutationForType(
  type: string
): Promise<DocumentNode> {
  const { fieldNames } = await getFieldnamesForType(type);
  const capitalizedType = capitalizeFirstLetter(type);
  const mutationParamsString = fieldNames
    ?.filter((fieldName) => fieldName !== "id")
    ?.map((fieldName) => `${fieldName}: $${fieldName}`)
    .join(", ");
  const mutationParamTypesString = fieldNames
    ?.filter((fieldName) => fieldName !== "id")
    ?.map(
      (fieldName) => `$${fieldName}: ${fieldName === "id" ? "ID" : "String"}`
    )
    .join(", ");

  console.log(
    `mutation Create${capitalizedType}(${mutationParamTypesString}) { create${capitalizedType}(data: {${mutationParamsString}}) { ${fieldNames?.join(" ")} } }`
  );
  const createMutation = gql`mutation Create${capitalizedType}(${mutationParamTypesString}) { create${capitalizedType}(data: {${mutationParamsString}}) { ${fieldNames?.join(" ")} } }`;
  return createMutation;
}

export async function getUpdateMutationForType(
  type: string
): Promise<DocumentNode> {
  const { fieldNames } = await getFieldnamesForType(type);
  const capitalizedType = capitalizeFirstLetter(type);
  const mutationParamsString = fieldNames
    ?.filter((fieldName) => fieldName !== "id")
    ?.map((fieldName) => `${fieldName}: $${fieldName}`)
    .join(", ");
  const mutationParamTypesString = fieldNames
    ?.map(
      (fieldName) => `$${fieldName}: ${fieldName === "id" ? "ID!" : "String"}`
    )
    .join(", ");

  console.log(
    `mutation Update${capitalizedType}(${mutationParamTypesString}) { update${capitalizedType}(where: {id: $id}, data: {${mutationParamsString}}) { ${fieldNames?.join(" ")} } }`
  );
  const updateMutation = gql`mutation Update${capitalizedType}(${mutationParamTypesString}) { update${capitalizedType}(where: {id: $id}, data: {${mutationParamsString}}) { ${fieldNames?.join(" ")} } }`;
  return updateMutation;
}

// Get form query based on id existence
export async function getFormQueryForType(
  type: string,
  id?: string
): Promise<DocumentNode> {
  if (id) return await getUpdateMutationForType(type);
  return await getCreateMutationForType(type);
}
