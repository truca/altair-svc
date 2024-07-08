import { v4 as uuidv4 } from "uuid";

import { hasDirective } from "./util";

const fs = require(`fs`);
const path = require(`path`);

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

  // To Do: handle error when a non nullable file field is not provided
  // handle error in case it's not a file or undefined
  //   const hasFileFieldsWithWrongValues = fileFieldKeys.some(
  //     (key) =>
  //       data[key] !== undefined &&
  //       data[key] !== null &&
  //       !(data[key] instanceof File)
  //   );
  //   if (hasFileFieldsWithWrongValues) {
  //     throw new Error("File fields must be of type File");
  //   }
  const fileKeys = fileFieldKeys.filter((key) => Boolean(data[key]));

  // To Do: validate file types and sizes
  await Promise.all(
    fileKeys.map(async (key) => {
      const id = uuidv4();
      const filePath = await uploadFile(id, type.name.toLowerCase(), data[key]);
      data[key] = filePath;
    })
  );
}
