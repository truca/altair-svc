import { gql } from "@apollo/client";
import { getFieldnamesForType } from "../SmartList/getQueriesForType";

export const getQueryStringForType = async (type: string) => {
  const { fieldNames } = await getFieldnamesForType(type);
  const query = `${type}(where: { id: $id }) @include(if: $include) { ${fieldNames?.join(" ")} }`;
  return { query, fieldNames };
};

export async function getQueryForType(type: string) {
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

export const getRemoveMutationForType = (type: string) => {
  const capitalizedType = capitalizeFirstLetter(type);
  const removeMutation = gql`mutation Remove${capitalizedType}($id: ID!) { remove${capitalizedType}(where: {id: $id}) }`;
  return { removeMutation };
};
