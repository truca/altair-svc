export const AUTHOR_FORM = {
  name: {
    label: "name",
    type: "TEXT",
    validation: [
      {
        label: "type",
        value: "string",
        valueType: "STRING",
        errorMessage: "Name should be a string",
      },
      {
        label: "required",
        value: "true",
        valueType: "BOOLEAN",
        errorMessage: "Name is required",
      },
    ],
  },
};
