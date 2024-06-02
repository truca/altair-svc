import { gql } from "@apollo/client";
import axios from "axios";

const data = JSON.stringify({
  query:
    "query IntrospectionQuery {__schema {description queryType {name}mutationType {name}subscriptionType {name} types { ...FullType } directives { name description locations args { ...InputValue } } }} fragment FullType on __Type { kind name description fields(includeDeprecated: true) { name description args { ...InputValue } type { ...TypeRef } isDeprecated deprecationReason } inputFields { ...InputValue } interfaces { ...TypeRef } enumValues(includeDeprecated: true) { name description isDeprecated deprecationReason } possibleTypes { ...TypeRef }}fragment InputValue on __InputValue { name description type { ...TypeRef } defaultValue}fragment TypeRef on __Type { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name } } } } } } }}",
  operationName: "IntrospectionQuery",
  extensions: {},
});

const config = {
  method: "post",
  maxBodyLength: Infinity,
  url: "http://localhost:4000/graphql",
  headers: {
    "Accept-Language": "en-US,en;q=0.9,es-US;q=0.8,es;q=0.7",
    Connection: "keep-alive",
    Cookie:
      "ajs_anonymous_id=3c158793-544e-49c6-b25d-0337874d798c; ajs_user_id=nacho-ureta; next-auth.csrf-token=90084eff84118c7dcfee57c7c602d8792d04142270e657738c8c89bb62542bbe%7C344a9fa719fe5c46a6ba5766f9b1b566310f408eafc8d250f9093984afcf879e; next-auth.callback-url=http%3A%2F%2Flocalhost%3A8080%2Fauthing",
    Origin: "http://localhost:4000",
    Referer:
      "http://localhost:4000/graphql?query=%7B%0A++authors%28where%3A+%7B+name%3A+%22nachoo%22+%7D%2C+limit%3A+3%29+%7B%0A++++id%0A++++name%0A++%7D%0A%7D",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    accept:
      "application/graphql-response+json, application/json, multipart/mixed",
    "content-type": "application/json",
    "sec-ch-ua":
      '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
  },
  data: data,
};

const getTypeFromSchemaTypes = (
  schemaTypes: { name: string; fields: { name: string }[] }[],
  typeName: string
) => {
  return schemaTypes.find((type: { name: string }) => type.name === typeName);
};

export const getQueryForType = async (type: string) => {
  const { data } = await axios.request(config);
  const schema = data.data.__schema;
  const queries = getTypeFromSchemaTypes(schema.types, schema.queryType.name);
  // get query
  // @ts-ignore
  const listType = getTypeFromSchemaTypes(queries?.fields, type);

  const entityType = getTypeFromSchemaTypes(
    schema.types,
    // @ts-ignore
    listType?.type.ofType.name
  );

  const fieldNames = entityType?.fields
    .filter((field) => {
      return (
        // @ts-ignore
        field?.type?.kind === "SCALAR" || field?.type?.ofType?.kind === "SCALAR"
      );
    })
    .map((field) => field.name)
    .sort((a, b) => {
      // if A is "id", then it should be first
      if (a === "id") return -1;
      // if B is "id", then it should be first
      if (b === "id") return 1;
      return 0;
    });

  const query = gql`query ${type}($page: Int, $pageSize: Int) { ${type}(page: $page, pageSize: $pageSize) { ${fieldNames?.join(" ")} } }`;
  return { query, fieldNames };
};
