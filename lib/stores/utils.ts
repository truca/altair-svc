import { MongoStore, MongoStoreOptions } from "./MongoStore";
import { FirestoreStore, FirestoreOptions } from "./FirestoreStore";
import { CloudSQLStore, CloudSQLStoreOptions } from "./PostgresStore";
import { Store } from "./types";

export type DbTypes = "mongo" | "firestore" | "postgres";

export function createStore(
  dbType: DbTypes,
  options: MongoStoreOptions | FirestoreOptions | CloudSQLStoreOptions
): Store {
  switch (dbType) {
    case "mongo":
      return new MongoStore(options as MongoStoreOptions);
    case "firestore":
      return new FirestoreStore(options as FirestoreOptions);
    case "postgres":
      return new CloudSQLStore(options as CloudSQLStoreOptions);
    default:
      throw new Error("Unsupported database type");
  }
}
