import {
  Store,
  StoreCreateProps,
  StoreCreateReturn,
  StoreFindOneProps,
  StoreFindOneReturn,
  StoreFindProps,
  StoreFindReturn,
  StoreRemoveProps,
  StoreRemoveReturn,
  StoreUpdateProps,
  StoreUpdateReturn,
} from "./types";
import { Context } from "../types";
import {
  ActionTypes,
  getHasNecessaryRolePermissionsToContinue,
} from "../AuthDirective";
import { extractDirectiveParams } from "../GraphQL/utils";

import { Firestore } from "@google-cloud/firestore";
import admin from "firebase-admin";
import { GoogleAuth } from "google-auth-library";

export interface FirestoreOptions {
  name?: string;
}

export class FirestoreStore implements Store {
  public db: Firestore;

  constructor(options: FirestoreOptions) {
    this.db = {} as any;
    this.connectToDb(options);
  }

  private async connectToDb(options: FirestoreOptions) {
    const auth = new GoogleAuth({
      scopes: "https://www.googleapis.com/auth/cloud-platform", // adjust the scopes as needed
    });
    const app = admin.initializeApp();

    this.db = app.firestore();

    this.db.settings({
      ...(options.name ? { databaseId: options.name, projectId: await auth.getProjectId() } : {}),
      ignoreUndefinedProperties: true,
    });
  }

  public async findOne(
    props: StoreFindOneProps,
    context: Context,
    info: any,
    bypassPermissions?: boolean
  ): Promise<StoreFindOneReturn | null> {
    const directiveParams = extractDirectiveParams(
      props.type.astNode as any,
      "auth"
    );
    const hasNecessaryRolePermissionsToContinue =
      bypassPermissions ||
      getHasNecessaryRolePermissionsToContinue(
        directiveParams,
        context?.session,
        ActionTypes.read
      );

    if (!hasNecessaryRolePermissionsToContinue) {
      return null;
    }

    const collectionRef = this.getCollection(props.type.name);
    if ((props.where as any).id) {
      // get element by id
      const doc = await collectionRef.doc((props.where as any).id).get();
      return doc ? this.formatOutput({ id: doc.id, ...doc.data() }) : null;
    }

    const query = collectionRef.where("deletedAt", "==", null);
    const formattedInput = this.formatInput(props.where);

    for (const key in formattedInput) {
      query.where(key, "==", formattedInput[key]);
    }

    const snapshot = await query.limit(1).get();
    const doc = snapshot.docs[0];
    return doc ? this.formatOutput({ id: doc.id, ...doc.data() }) : null;
  }

  public async find(
    props: StoreFindProps,
    context: Context,
    info: any
  ): Promise<{ list: StoreFindReturn[]; maxPages: number | null }> {
    const directiveParams = extractDirectiveParams(
      props.type.astNode as any,
      "auth"
    );
    const hasNecessaryRolePermissionsToContinue =
      getHasNecessaryRolePermissionsToContinue(
        directiveParams,
        context?.session,
        ActionTypes.read
      );
    if (!hasNecessaryRolePermissionsToContinue) {
      return { list: [], maxPages: null };
    }

    const typeName = props.type.name;
    const collectionRef = this.getCollection(typeName);
    let query: any =
      typeName === "Profile"
        ? collectionRef
        : collectionRef.where("deletedAt", "==", null);
    const formattedInput = this.formatInput(props.where);

    // support {[key]: { operator, value: dateObj }} and {[key]: [{ operator, value: dateObj }]}
    for (const key in formattedInput) {
      if (Array.isArray(formattedInput[key])) {
        for (const condition of formattedInput[key]) {
          query = query.where(key, condition.operator, condition.value);
        }
      } else if (typeof formattedInput[key] === "object") {
        query = query.where(
          key,
          formattedInput[key].operator,
          formattedInput[key].value
        );
      } else {
        query = query.where(key, "==", formattedInput[key]);
      }
    }

    const pageSize = props.pageSize || 10;
    let snapshot = null;
    if (pageSize === -1) {
      snapshot = await query.get();
    } else {
      snapshot = await query.limit(pageSize).get();
    }

    const list = snapshot.docs.map((doc: any) =>
      this.formatOutput({ id: doc.id, ...doc.data() })
    );
    const countQuerySnapshot = await collectionRef.get();
    const totalCount = countQuerySnapshot.size;
    const maxPages = Math.ceil(totalCount / pageSize);

    return { list, maxPages };
  }

  public async create(
    props: StoreCreateProps,
    context: Context,
    info: any
  ): Promise<StoreCreateReturn> {
    const directiveParams = extractDirectiveParams(
      props.type.astNode as any,
      "auth"
    );
    const hasNecessaryRolePermissionsToContinue =
      getHasNecessaryRolePermissionsToContinue(
        directiveParams,
        context?.session,
        ActionTypes.create
      );
    if (!hasNecessaryRolePermissionsToContinue) {
      return null;
    }

    const data = {
      ...props.data,
      createdAt: new Date(),
      ownerIds: [context?.session?.uid],
    };

    const collectionRef = this.getCollection(props.type.name);
    const docRef = await collectionRef.add(data);
    const snapshot = await docRef.get();

    return this.formatOutput({ id: snapshot.id, ...snapshot.data() });
  }

  public async update(
    props: StoreUpdateProps,
    context: Context,
    info: any,
    bypassPermissions?: boolean
  ): Promise<StoreUpdateReturn> {
    const directiveParams = extractDirectiveParams(
      props.type.astNode as any,
      "auth"
    );
    const hasNecessaryRolePermissionsToContinue =
      bypassPermissions ||
      getHasNecessaryRolePermissionsToContinue(
        directiveParams,
        context?.session,
        ActionTypes.update
      );

    if (!hasNecessaryRolePermissionsToContinue) {
      return false;
    }

    const collectionRef = this.getCollection(props.type.name);
    const formattedInput = this.formatInput(props.where);

    const querySnapshot = await collectionRef
      .where("id", "==", formattedInput.id)
      .limit(1)
      .get();
    const doc = querySnapshot.docs[0];

    if (doc) {
      await doc.ref.update(props.data);
      const updatedSnapshot = await doc.ref.get();
      return this.formatOutput({
        id: formattedInput.id,
        ...updatedSnapshot.data(),
      });
    }

    return false;
  }

  public async remove(
    props: StoreRemoveProps & { hardDelete: boolean },
    context: Context,
    info: any
  ): Promise<StoreRemoveReturn> {
    const directiveParams = extractDirectiveParams(
      props.type.astNode as any,
      "auth"
    );
    const hasNecessaryRolePermissionsToContinue =
      getHasNecessaryRolePermissionsToContinue(
        directiveParams,
        context?.session,
        ActionTypes.delete
      );

    if (!hasNecessaryRolePermissionsToContinue) {
      return false;
    }

    const collectionRef = this.getCollection(props.type.name);
    const formattedInput = this.formatInput(props.where);

    const querySnapshot = await collectionRef
      .where("id", "==", formattedInput.id)
      .limit(1)
      .get();
    const doc = querySnapshot.docs[0];

    if (!doc) {
      return false;
    }

    if (props.hardDelete) {
      await doc.ref.delete();
      return true;
    } else {
      await doc.ref.update({ deletedAt: new Date() });
      return true;
    }
  }

  private getCollection(collectionName: string) {
    return this.db.collection(collectionName);
  }

  // Simplified formatOutput to reflect Firestore's native format
  private formatOutput(object: any) {
    if (!object) {
      return null;
    }
    return { id: object.id || object._id, ...object };
  }

  private formatInput(where: any) {
    if (!where) {
      return null;
    }
    const formattedWhere = { ...where };
    if (formattedWhere.id) {
      formattedWhere.id = formattedWhere.id;
    }

    // [key]: '>=2025-02-27,<=2025-02-28'
    // search between start of day and end of day
    for (const key in where) {
      const value = where[key];
      if (
        typeof value === "string" &&
        (value.includes(">") || value.includes("<"))
      ) {
        // Split the string into parts (e.g. ">=2025-02-27,<=2025-02-28")
        let parts = [value.trim()];
        if (value.includes(",")) {
          parts = value.split(",").map((part) => part.trim());
        }

        // Process each condition
        const conditions = parts
          .map((part) => {
            // Look for operators: >=, <=, >, or <
            const operatorMatch = part.match(/(>=|<=|>|<)/);
            if (!operatorMatch) {
              console.warn(
                `No valid operator found in condition "${part}" for field "${key}". Skipping this condition.`
              );
              return null;
            }
            const operator = operatorMatch[0];
            // Extract the date string by removing the operator
            const dateStr = part.replace(operator, "").trim();
            // utc timezne
            const dateObj = new Date(dateStr);

            // Adjust the time to cover the full day range:
            // For greater-than conditions, set to start of day.
            // For less-than conditions, set to end of day.
            if (operator === ">=" || operator === ">") {
              dateObj.setHours(0, 0, 0, 0);
            } else if (operator === "<=" || operator === "<") {
              dateObj.setHours(23, 59, 59, 999);
            }

            const result = {
              operator,
              value: admin.firestore.Timestamp.fromDate(dateObj),
            };
            console.log({ operator: { ...result, dateObj } });
            return result;
          })
          .filter((condition) => condition !== null);

        if (conditions.length === 1) {
          formattedWhere[key] = conditions[0];
        } else if (conditions.length > 1) {
          formattedWhere[key] = conditions;
        }
      }
    }

    return formattedWhere;
  }
}
