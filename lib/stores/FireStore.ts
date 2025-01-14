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
import { cloneDeep } from "lodash";
import mongoose, { Schema } from "mongoose";
import { Context } from "../types";
import {
  ActionTypes,
  getHasNecessaryRolePermissionsToContinue,
  getHasPermissionOnlyThroughAnotherEntity,
  getMongoFilterForOwnerOrCollaborator,
} from "../AuthDirective";
import { extractDirectiveParams } from "../GraphQL/utils";

import { Firestore } from "@google-cloud/firestore";

class FirestoreStore implements Store {
  public db: Firestore;

  constructor() {
    this.db = new Firestore();
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
    const query = collectionRef.where("deletedAt", "==", null);
    const formattedInput = this.formatInput(props.where);

    for (const key in formattedInput) {
      query.where(key, "==", formattedInput[key]);
    }

    const snapshot = await query.limit(1).get();
    const doc = snapshot.docs[0];
    return doc ? this.formatOutput(doc.data()) : null;
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

    const collectionRef = this.getCollection(props.type.name);
    let query = collectionRef.where("deletedAt", "==", null);
    const formattedInput = this.formatInput(props.where);

    for (const key in formattedInput) {
      query = query.where(key, "==", formattedInput[key]);
    }

    const pageSize = props.pageSize || 10;
    const snapshot = await query.limit(pageSize).get();

    const list = snapshot.docs.map((doc) => this.formatOutput(doc.data()));
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

    return this.formatOutput(snapshot.data());
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
      return this.formatOutput(updatedSnapshot.data());
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

  private formatInput(object: any) {
    if (!object) {
      return null;
    }
    const clonedObject = { ...object };
    if (clonedObject.id) {
      clonedObject.id = clonedObject.id;
    }
    return clonedObject;
  }
}
