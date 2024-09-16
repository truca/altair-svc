import { hasDirective } from "./util";

export function mapFileFieldsToFileInputType(fields: any, schema: any) {
  const fileInput = schema.getMutationType().getFields()["saveFile"].args[0];
  // If the field has the input directive then it is replaced with the File type.
  // Otherwise the field is copied as is.
  return Object.keys(fields).reduce((res, key) => {
    const field = fields[key];
    const hasFileDirective = hasDirective("file", field);
    if (hasFileDirective) {
      return {
        ...res,
        [key]: {
          ...field,
          ...fileInput,
          name: key,
        },
      };
    }

    return {
      ...res,
      [key]: field,
    };
  }, {});
}
