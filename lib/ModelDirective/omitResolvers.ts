import { omitBy } from "lodash";

interface ResolverField {
  [key: string]: any;
}

interface Fields {
  [key: string]: ResolverField;
}

export const omitResolvers = (fields: Fields): Fields => {
  return Object.keys(fields).reduce((res: Fields, key: string) => {
    const value = omitBy(
      fields[key],
      (_value: any, key: string) => key === "resolve"
    );
    return {
      ...res,
      [key]: value,
    };
  }, {});
};
