import { MongoStore, MongoStoreOptions } from "./MongoStore";
import { FirestoreStore, FirestoreOptions } from "./FirestoreStore";
import { Store } from "./types";

const serviceAccount = require("../../serviceAccountKey.json");

export function getDbOptions(dbType: "mongo" | "firestore") {
  switch (dbType) {
    case "mongo":
      return {
        connection: `${process.env.DB_URI}/${process.env.DATABASE}`,
      };
    case "firestore":
      return serviceAccount;
    default:
      throw new Error("Unsupported database type");
  }
}

export function createStore(
  dbType: "mongo" | "firestore",
  options: MongoStoreOptions | FirestoreOptions
): Store {
  switch (dbType) {
    case "mongo":
      return new MongoStore(options as MongoStoreOptions);
    case "firestore":
      return new FirestoreStore(options as FirestoreOptions);
    default:
      throw new Error("Unsupported database type");
  }
}
