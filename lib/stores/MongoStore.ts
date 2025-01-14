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

export interface MongoStoreOptions {
  connection: string;
  options?: object;
}

const schema = new Schema({}, { strict: false });

export class MongoStore implements Store {
  public db: any;
  constructor(options: MongoStoreOptions) {
    this.connect(options.connection);
  }

  private async connect(connection: string) {
    this.db = await mongoose.connect(connection);
    if (!this.db) {
      throw new Error("Could not connect to the database");
    }
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

    const model = this.getModel(props.type.name);
    const findOneParams = this.formatInput(props.where);
    const res = await model.findOne({ ...findOneParams, deletedAt: null });
    return this.formatOutput(res);
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
    const hasPermissionOnlyThroughAnotherEntity =
      getHasPermissionOnlyThroughAnotherEntity({
        config: directiveParams,
        action: ActionTypes.read,
      });
    const isNestedRequest = info.kind === "Field";
    if (
      !hasNecessaryRolePermissionsToContinue ||
      (hasPermissionOnlyThroughAnotherEntity && !isNestedRequest)
    ) {
      return { list: [], maxPages: null };
    }

    const model = this.getModel(props.type.name);
    const page = props.page || 1;
    const pageSize = props.pageSize || 10;
    const includeMaxPages = props.includeMaxPages || false;
    const findOneParams = this.formatInput(props.where);
    console.log({ findOneParams });
    const permissionFilters = getMongoFilterForOwnerOrCollaborator({
      config: directiveParams,
      profile: context?.session,
      action: ActionTypes.read,
    });

    let maxPages: number | null = null;
    if (includeMaxPages) {
      console.log({
        match: JSON.stringify({
          ...findOneParams,
          ...permissionFilters,
          deletedAt: null,
        }),
      });
      const count = await model.aggregate([
        {
          $match: { ...findOneParams, ...permissionFilters, deletedAt: null },
        },
        {
          $count: "count",
        },
      ]);
      const results = count[0]?.count || 0;
      maxPages = Math.ceil(results / pageSize);
      console.log({ count: results, pageSize, maxPages });
    }

    console.log({
      match: JSON.stringify({
        ...findOneParams,
        ...permissionFilters,
        deletedAt: null,
      }),
    });
    const res = await model
      .find({ ...findOneParams, ...permissionFilters, deletedAt: null })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    return { list: this.formatOutput(res), maxPages };
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

    const model = this.getModel(props.type.name);
    // check permissions (if the auth allows the user to create this type)
    // access create permissions from auth directive
    // check if the user has the right permissions

    const res = await model.create({
      ...props.data,
      createdAt: new Date(),
      ownerIds: [context?.session?.uid],
    });
    return this.formatOutput(res);
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

    const model = this.getModel(props.type.name);
    const res = await model.findOneAndUpdate(
      this.formatInput(props.where),
      {
        $set: props.data,
      },
      { new: true }
    );

    return res;
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

    const isHardDelete = props.hardDelete || false;
    if (isHardDelete) {
      return this.hardDelete(props);
    }
    return this.softDelete(props);
  }
  private async hardDelete(
    props: StoreRemoveProps
  ): Promise<StoreRemoveReturn> {
    const model = this.getModel(props.type.name);
    const res = await model.deleteOne(this.formatInput(props.where));
    return res.n > 0;
  }
  private async softDelete(
    props: StoreRemoveProps
  ): Promise<StoreRemoveReturn> {
    const model = this.getModel(props.type.name);
    const res = await model.updateOne(this.formatInput(props.where), {
      $set: {
        deletedAt: new Date(),
      },
    });
    return res.modifiedCount > 0;
  }
  // Adds an `id` field to the output
  private formatOutput(object: any): any {
    if (Array.isArray(object)) {
      return object.map((o) => this.formatOutput(o));
    }
    if (!object) {
      return null;
    }
    if (!object._id) {
      return object;
    }
    const clonedObject = { ...object._doc };
    clonedObject.id = clonedObject._id;
    delete clonedObject._id;
    return clonedObject;
  }
  private formatInput(object: any) {
    if (!object) {
      return null;
    }
    if (!object.id) {
      const clonedObject = cloneDeep(object);
      this.handleCommaFilters(clonedObject);
      this.handleArrayFilters(clonedObject);
      return clonedObject;
    }
    const clonedObject = cloneDeep(object);
    this.handleCommaFilters(clonedObject);
    this.handleArrayFilters(clonedObject);
    clonedObject._id = new mongoose.Types.ObjectId(clonedObject.id);
    delete clonedObject.id;
    console.log({ clonedObject });
    return clonedObject;
  }
  private getModel(modelName: string) {
    return this.db.model(modelName, schema);
  }
  private handleCommaFilters(filters: any) {
    return Object.keys(filters).forEach((key) => {
      if (key === "id" || key === "_id") return;
      const hasComma =
        typeof filters[key] === "string" && filters[key].includes(",");
      if (hasComma) {
        filters[key] = { $in: filters[key].split(",") };
      }
      const hasCodifiedComma =
        typeof filters[key] === "string" && filters[key].includes("%2C");
      if (hasCodifiedComma) {
        filters[key] = { $in: filters[key].split("%2C") };
      }
    });
  }

  private handleArrayFilters(filters: any) {
    return Object.keys(filters).forEach((key) => {
      if (key === "id" || key === "_id") return;
      if (Array.isArray(filters[key])) {
        // ["hero,wild", "elemental 1"] should be mapped as:
        /*
          $or: [
            {
              $and: [
                { tags: { $in: ["hero"] } },  // Checking if 'tags' includes "hero"
                { tags: { $in: ["wild"] } }    // Checking if 'tags' includes "wild"
              ]
            },
            { tags: { $in: ["elemental 1"] } }  // Checking if 'tags' includes "elemental 1"
          ]
        */
        const hasElementsWithComma = filters[key].some((el: any) =>
          typeof el === "string" ? el.includes(",") : false
        );
        if (hasElementsWithComma) {
          const or = filters[key].map((el: any) => {
            if (typeof el === "string" && el.includes(",")) {
              return {
                $and: el.split(",").map((tag) => ({ [key]: { $in: [tag] } })),
              };
            }
            return { [key]: { $in: [el] } };
          });
          // How will it behave with another conditions?
          filters.$or = or;
          delete filters[key];
        } else filters[key] = { $in: filters[key] };
      }
    });
  }
}
