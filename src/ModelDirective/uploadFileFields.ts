import { v4 as uuidv4 } from "uuid";

import { hasDirective } from "./util";

const fs = require(`fs`);
const path = require(`path`);

export function getDirectiveArguments(type: any, fieldName: string) {
  const field = type.getFields()[fieldName];
  const directive = hasDirective("file", field);

  const args = directive.arguments.reduce((acc: any, val: any) => {
    return {
      ...acc,
      [val.name.value]:
        val.value.kind === "IntValue"
          ? parseInt(val.value.value, 10)
          : val.value.kind === "ListValue"
          ? val.value.values.map((v: any) => v.value)
          : val.value.value,
    };
  }, {});
  return args;
}

async function uploadFile(
  name: string,
  entityName: string,
  file: any
): Promise<string | undefined> {
  const fileExtension = file.name.split(".").pop();
  const folderName = `../../${process.env.UPLOAD_PATH}/${entityName}`;
  const folderPath = path.join(__dirname, folderName);
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

  const fileName = `${folderName}/${name}.${fileExtension}`;
  const filePath = path.join(__dirname, fileName);
  try {
    const fileArrayBuffer = await file.arrayBuffer();
    await fs.promises.writeFile(filePath, Buffer.from(fileArrayBuffer));
  } catch (e) {
    console.log({ e });
    return undefined;
  }
  return filePath;
}

export async function uploadFiles(type: any, data: Record<string, any>) {
  // any field with file directive should store file in the file store
  const fileFieldKeys = Object.keys(data).filter((key) => {
    const field = type.getFields()[key];
    return hasDirective("file", field);
  });

  const fileKeys = fileFieldKeys.filter((key) => Boolean(data[key]));

  await Promise.all(
    fileKeys.map(async (key) => {
      const id = uuidv4();
      const args = getDirectiveArguments(type, key);

      if (args.maxSize && data[key].size > args.maxSize) {
        throw new Error(
          `File size exceeds the maximum size of ${args.maxSize}`
        );
      }

      if (args.types && !args.types.includes(data[key].type)) {
        throw new Error(
          `File type is not supported. Supported types are ${args.types.join(
            ", "
          )}`
        );
      }

      const filePath = await uploadFile(id, type.name.toLowerCase(), data[key]);
      data[key] = filePath;
    })
  );
}
