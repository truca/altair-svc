// @ts-nocheck
import * as pluralize from "pluralize";

const pascalCase = (name: string) => {
  return name.replace(/(\w)(\w*)/g, (g0, g1, g2) => g1.toUpperCase() + g2);
};

function camelCase(name: string) {
  return name
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, "");
}

export const generateFieldNames = (name: string) => {
  const pascalCaseName = pascalCase(name ?? "");
  const camelCaseName = camelCase(name ?? "");

  const names = {
    input: {
      type: `${pluralize.singular(pascalCaseName)}InputType`,
      mutation: {
        create: `Create${pluralize.singular(pascalCaseName)}InputType`,
        remove: `Remove${pluralize.singular(pascalCaseName)}InputType`,
        update: `Update${pluralize.singular(pascalCaseName)}InputType`,
      },
    },
    query: {
      one: pluralize.singular(camelCaseName),
      many: pluralize.plural(camelCaseName),
    },
    mutation: {
      create: `create${pluralize.singular(pascalCaseName)}`,
      remove: `remove${pluralize.singular(pascalCaseName)}`,
      update: `update${pluralize.singular(pascalCaseName)}`,
    },
  };

  return names;
};
