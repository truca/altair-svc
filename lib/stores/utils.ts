import { FirestoreStore, FirestoreOptions } from "./FirestoreStore";
import { Store } from "./types";

// const serviceAccount = require("../../serviceAccountKey.json");

export type DbTypes = "firestore";

// export function getDbOptions(dbType: DbTypes) {
//   switch (dbType) {
//     case "firestore":
//       return serviceAccount;
//     default:
//       throw new Error("Unsupported database type");
//   }
// }

export function createStore(dbType: DbTypes, options: FirestoreOptions, schema?: any): Store {
  switch (dbType) {
    case "firestore":
      const store = new FirestoreStore(options as FirestoreOptions);
      if (schema) {
        store.initFieldMetadataFromSchema(schema);
      }
      return store;
    default:
      throw new Error("Unsupported database type");
  }
}
