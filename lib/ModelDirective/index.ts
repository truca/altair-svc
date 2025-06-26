import {
  __Field,
  defaultFieldResolver,
  getNamedType,
  getNullableType,
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
} from "graphql";
import { SchemaDirectiveVisitor } from "@graphql-tools/utils";
import _, { isArray, isPlainObject, mergeWith, pickBy } from "lodash";
import * as pluralize from "pluralize";
import { generateFieldNames } from "./generateFieldNames";
import {
  cleanNestedObjects,
  getDirectiveParams,
  getInputType,
  hasDirective,
} from "./util";
import { validateInputData } from "./validateInputData";
import { addInputTypesForObjectType } from "./addInputTypesForObjectType";
import { Store } from "./Store";
import mongoose from "mongoose";
import { uploadFiles } from "./uploadFileFields";
import {
  extractFieldDirectiveParams,
  getEntityTypeFromField,
  getFieldType,
} from "../GraphQL/utils";
import { mapEntity } from "./mapEntity";
import admin from "firebase-admin";
import { constants } from "../../src/constants";
import { topLevelServiceKeys, updateServiceInCampaignGroup } from "./mapEntity/campaignGroup";

import { config } from "dotenv";
config();

export interface ResolverContext {
  directives: {
    model: {
      store: Store;
    };
  };
  [key: string]: any;
}

export interface CreateResolverArgs {
  data: any;
}

export interface FindOneResolverArgs {
  where: any;
}

export interface FindResolverArgs {
  where: any;
  page: number;
  pageSize: number;
  includeMaxPages: boolean;
}

export interface UpdateResolverArgs {
  data: any;
  where: any;
  upsert: boolean;
}

export interface RemoveResolverArgs {
  where: any;
}

export async function visitNestedModels({
  data: dataParam,
  type,
  modelFunction,
  modelsFunction,
  context,
  info,
  localInfo,
  _isCreateOrUpdate = false,
}: any) {
  const res: { [key: string]: any } = {};
  const data = { ...dataParam };

  // move into its own function
  const selectedFields =
    localInfo?.selectionSet?.selections ||
    info?.fieldNodes?.[0]?.selectionSet?.selections ||
    info?.selectionSet?.selections ||
    [];
  const selectedFieldsHash = selectedFields.reduce(
    (res: any, selection: any) => {
      res[selection.name.value] = selection;
      return res;
    },
    {}
  );
  Object.keys(selectedFieldsHash).forEach((key) => {
    if (!data[key]) {
      const fieldType = getFieldType(type.astNode, key);
      data[key] =
        fieldType === "array" ? [] : fieldType === "object" ? {} : undefined;
    }
  });
  // end move
  for (const key of Object.keys(data)) {
    if (key === "_id") continue;
    if (!selectedFieldsHash[key]) continue;
    if (topLevelServiceKeys.includes(key)) continue;

    const value = data[key];
    const field = getNamedType(type.getFields()[key]) as any;

    let fieldType = getNamedType(field?.type);
    const hasModelDirective = hasDirective("model", fieldType);

    if (hasModelDirective && isPlainObject(value)) {
      const info = selectedFieldsHash[key];
      const foundObject = await modelFunction(fieldType, value, info);
      res[key] = foundObject;
    }

    // Is this still valid?
    const connectionDirective = extractFieldDirectiveParams(
      type.astNode,
      key,
      "connection"
    );
    const isSearchableArray =
      Array.isArray(value) && connectionDirective?.type === "search";

    if (isSearchableArray) {
      const info = selectedFieldsHash[key];
      const entityType = getEntityTypeFromField(type.astNode, key);
      // const namedType = getNamedType(entityType);
      fieldType = context.schema.getType(entityType);
      const foundObjects = await modelsFunction?.(
        fieldType,
        {
          where: { "chat._id": data.id },
          page: 1,
          pageSize: 10,
        },
        info
      );
      res[key] = foundObjects?.list;
      continue;
    }

    if (Array.isArray(value) && value.every((v) => isPlainObject(v))) {
      const createdObjects: any[] = [];

      for (const v of value) {
        const info = selectedFieldsHash[key];
        let foundObject = v;
        if (hasModelDirective) {
          foundObject = await modelFunction(fieldType, v, info);
        }
        createdObjects.push(foundObject);
      }

      res[key] = createdObjects;
    }
  }

  return res;
}

export class ModelDirective extends SchemaDirectiveVisitor {
  // public isFirestore = process.env.DB_TYPE === "firestore";
  public isFirestore = process.env.DB_ENGINE === constants.DB_ENGINES.FIRESTORE;

  public visitObject(type: GraphQLObjectType) {
    // TODO check that id field does not already exist on type
    // Add an "id" field to the object type.
    //
    type.getFields().id = {
      name: "id",
      type: GraphQLID,
      description: "Unique ID",
      args: [],
      resolve: defaultFieldResolver,
      // @ts-ignore
      isDeprecated: false,
      deprecationReason: undefined,
      extensions: undefined,
    };

    // Modify schema with input types generated based off of the given type
    this.addInputTypes(type);

    // Modify root Mutation type to add create, update, upsert, and remove mutations
    this.addMutations(type);

    // Modify root Query type to add "find one" and "find many" queries
    this.addQueries(type);
  }

  private addInputTypes(objectType: GraphQLObjectType) {
    // Generate corresponding input types for the given type.
    // Each field returning GraphQLObjectType in the given type will also
    // have input types generated recursively.
    addInputTypesForObjectType({
      objectType,
      schema: this.schema,
      modifyField: (field) => {
        field.type = getNullableType(field.type);
        return field;
      },
    });
  }

  private pluckModelObjectIds(data: any): Record<string, any> {
    if (!data) return {};

    return Object.keys(data).reduce((res, key) => {
      if (key === "id") {
        return {
          ...res,
          _id: data[key],
        };
      }
      if (isPlainObject(data[key])) {
        const value = this.pluckModelObjectIds(data[key]);
        return {
          ...res,
          ...(Object.keys(value).length ? { [key]: value } : {}),
        };
      }
      if (Array.isArray(data[key])) {
        const value = data[key]
          .map((value: any) => this.pluckModelObjectIds(value))
          .filter((v: any) =>
            v && typeof v === "object" ? Object.keys(v).length : Boolean(v)
          );
        return {
          ...res,
          ...(value.length ? { [key]: value } : {}),
        };
      }
      return res;
    }, {});
  }

  private getListSelection(info: any) {
    return (
      info?.fieldNodes?.[0]?.selectionSet?.selections?.[0] ??
      info?.selectionSet?.selections?.[0]
    );
  }

  public findQueryResolver(type: any) {
    return async (
      root: any,
      args: FindResolverArgs,
      context: any,
      info: any
    ) => {
      const params = getDirectiveParams("model", type);
      const db = params?.db ?? "store";
      const initialData: any = await context.directives.model[db].find(
        {
          where: args.where,
          page: args.page,
          pageSize: args.pageSize,
          includeMaxPages: args.includeMaxPages,
          type,
        },
        context,
        info
      );

      if (!initialData) {
        return null;
      }

      const results = {
        maxPages: initialData.maxPages,
        list: await Promise.all(
          initialData.list.map(async (data: any) => {
            const nestedObjects = await visitNestedModels({
              type,
              data,
              info,
              context,
              localInfo: this.getListSelection
                ? this.getListSelection(info)
                : info,
              modelFunction: async (
                localType: any,
                value: any,
                newInfo = null
              ) => {
                const found = await this.findOneQueryResolver(localType)(
                  root,
                  { ...args, where: value },
                  context,
                  newInfo ? newInfo : info
                );
                return found;
              },
              modelsFunction: async (
                localType: any,
                value: any,
                newInfo = null
              ) => {
                // We need to get the right type here
                const found = await this.findQueryResolver(localType)(
                  root,
                  {
                    ...args,
                    where: value.where,
                    page: value.page,
                    pageSize: value.pageSize,
                  },
                  context,
                  newInfo ? newInfo : info
                );
                return found;
              },
            });
            return { ...data, ...cleanNestedObjects(nestedObjects) };
          })
        ),
      };

      console.log({ results, where: args.where });
      return results;
    };
  }

  public findOneQueryResolver(type: any) {
    return async (
      root: any,
      args: FindOneResolverArgs,
      context: any,
      info: any
    ) => {
      const params = getDirectiveParams("model", type);
      const db = params?.db ?? "store";
      const rootObject = await context.directives.model[db].findOne(
        {
          where: args.where,
          type,
        },
        context,
        info
      );

      if (!rootObject) {
        return null;
      }

      const nestedObjects = await visitNestedModels({
        type,
        data: rootObject,
        info,
        context,
        modelFunction: async (localType: any, value: any, newInfo = null) => {
          const found = await this.findOneQueryResolver(localType)(
            root,
            { ...args, where: value },
            context,
            newInfo ? newInfo : info
          );
          return found;
        },
      });

      return { ...rootObject, ...cleanNestedObjects(nestedObjects) };
    };
  }

  public createMutationResolver(type: any, parentIdsParam = {}) {
    return async (
      root: any,
      args: CreateResolverArgs,
      context: any,
      info: any
    ) => {
      args.data = await mapEntity(args.data, type);

      console.log({ data: args.data, type })
      validateInputData({
        data: args.data,
        type,
        schema: this.schema,
      });

      // This will update all files and return the file paths
      await uploadFiles(type, args.data);

      // add _id to the object if it doesn't exist
      if (!args.data._id && !this.isFirestore) {
        args.data._id = new mongoose.Types.ObjectId();
      }

      if (this.isFirestore) {
        // TODO: do this only if the model has soft delete
        args.data.deletedAt = null;
      }

      const relatedObjects = await visitNestedModels({
        type,
        data: args.data,
        info,
        context,
        isCreateOrUpdate: true,
        modelFunction: async (localType: any, value: any) => {
          const parentType = getNamedType(type) as any;
          const parentTypeName = parentType.name.toLowerCase();
          const fields = localType._fields;

          const parentFieldName = Object.keys(fields).find((fieldName) => {
            return fieldName.startsWith(parentTypeName);
          });
          const hasParentType = Boolean(parentFieldName);
          const isSingular = parentFieldName === parentTypeName;

          if (value.id) {
            const found = await this.findOneQueryResolver(localType)(
              root,
              { where: { id: value.id } },
              context,
              info
            );
            return found;
          }

          const parentData = args.data;
          const parentIds = {};
          // This is to add the references to the parent node
          if (hasParentType && isSingular) {
            // @ts-ignore
            parentIds[parentFieldName] = { _id: parentData._id };
          }
          if (hasParentType && !isSingular) {
            // @ts-ignore
            parentIds[parentFieldName] = [{ _id: parentData._id }];
          }

          console.log({ localType, parentIds, value })
          const createdObject = await this.createMutationResolver(
            localType,
            parentIds
          )(root, { ...args, data: value }, context, info);
          return createdObject;
        },
      });

      const objectIds = this.pluckModelObjectIds(relatedObjects);

      const params = getDirectiveParams("model", type);
      const db = params?.db ?? "store";
      const rootObject = await context.directives.model[db].create(
        {
          data: {
            ...args.data,
            ...objectIds,
            ...parentIdsParam,
          },
          type,
        },
        context,
        info
      );

      // publish if the model is subscribable

      const mergedObjects = {
        ...rootObject,
        ...cleanNestedObjects(relatedObjects),
      };

      return mergedObjects;
    };
  }

  public updateResolver(type: any) {
    return async (
      root: any,
      args: UpdateResolverArgs,
      context: any,
      info: any
    ) => {
      validateInputData({
        data: args.data,
        type,
        schema: this.schema,
      });

      // This will update all files and return the file paths
      await uploadFiles(type, args.data);

      const params = getDirectiveParams("model", type);
      const db = params?.db ?? "store";
      const currentRootObject = await context.directives.model[db].findOne(
        {
          where: args.where,
          type,
        },
        context,
        info
      );

      if (!args.data._id) {
        args.data._id = currentRootObject.id;
      }

      const relatedObjects = await visitNestedModels({
        type,
        data: args.data,
        info,
        context,
        isCreateOrUpdate: true,
        modelFunction: async (localType: any, value: any) => {
          // update
          if (value.id) {
            const updated = await this.updateResolver(localType)(
              root,
              {
                data: value,
                where: {
                  id: value.id,
                },
                upsert: false,
              },
              context,
              info
            );
            if (updated) {
              const foundObject = await this.findOneQueryResolver(localType)(
                root,
                {
                  where: {
                    id: value.id,
                  },
                },
                context,
                info
              );

              return foundObject;
            }
          }

          // Create
          // TODO: instead of copying the create modelFunction, we should just call it
          // TODO: move to a function
          const parentType = getNamedType(type) as any;
          const parentTypeName = parentType.name.toLowerCase();
          const fields = localType._fields;

          const parentFieldName = Object.keys(fields).find((fieldName) => {
            return fieldName.startsWith(parentTypeName);
          });
          const hasParentType = Boolean(parentFieldName);
          const isSingular = parentFieldName === parentTypeName;
          const parentData = args.data;
          const parentIds = {};
          // This is to add the references to the parent node
          if (hasParentType && isSingular) {
            //@ts-ignore
            parentIds[parentFieldName] = { _id: parentData._id };
          }
          if (hasParentType && !isSingular) {
            //@ts-ignore
            parentIds[parentFieldName] = [{ _id: parentData._id }];
          }
          // end move

          const createdObject = await this.createMutationResolver(
            localType,
            parentIds
          )(root, { ...args, data: value }, context, info);
          return createdObject;
        },
      });

      const newObjectIds = this.pluckModelObjectIds(relatedObjects);
      const filteredRootObject = pickBy(currentRootObject, (_, key) => {
        return newObjectIds[key];
      });

      const filteredData = pickBy(args.data, (_, key) => {
        return !relatedObjects[key] && key !== "_id";
      });

      function customizer(objValue: any, srcValue: any) {
        if (isArray(objValue)) {
          return objValue.concat(srcValue);
        }
      }
      const objectIds = mergeWith(filteredRootObject, newObjectIds, customizer);

      const data = {
        ...filteredData,
        ...objectIds,
      };

      const dateFields = [
        "startDate",
        "endDate",
        "implementationDate",
        "bannerFadStartDate",
        "bannerMenuStartDate",
        "bannerFadEndDate",
        "bannerMenuEndDate"
      ];
      dateFields.forEach((key) => {
        if (data[key] && typeof data[key] === 'string') {
          const date = new Date(data[key]);
          if (key === "endDate" || key === "bannerFadEndDate" || key === "bannerMenuEndDate") {
            date.setUTCHours(23, 59, 59, 999);
          } else if (key === "implementationDate") {
            date.setUTCHours(12, 0, 0, 0);
          } else {
            date.setUTCHours(0, 0, 0, 0);
          }
          data[key] = admin.firestore.Timestamp.fromDate(date);
        }
      });

      if (data.bannerForms && Array.isArray(data.bannerForms)) {
        data.bannerForms = data.bannerForms.map(banner => {
          if (!banner) return banner;
          if (banner.startDate && typeof banner.startDate === 'string') {
            const date = new Date(banner.startDate);
            date.setUTCHours(0, 0, 0, 0);
            banner.startDate = admin.firestore.Timestamp.fromDate(date);
          }
          if (banner.endDate && typeof banner.endDate === 'string') {
            const date = new Date(banner.endDate);
            date.setUTCHours(23, 59, 59, 999);
            banner.endDate = admin.firestore.Timestamp.fromDate(date);
          }
          if (banner.implementationDate && typeof banner.implementationDate === 'string') {
            const date = new Date(banner.implementationDate);
            date.setUTCHours(12, 0, 0, 0);
            banner.implementationDate = admin.firestore.Timestamp.fromDate(date);
          }
          return banner;
        });
      }

      const updated = await context.directives.model[db].update(
        {
          where: args.where,
          data,
          upsert: args.upsert,
          type,
        },
        context,
        info
      );

      if (!updated) {
        throw new Error(`Failed to update ${type}`);
      }

      if (type.name === "Service" && this.isFirestore) {
        try {
          const serviceId = updated?.id || args?.where.id || args?.where._id;
          const campaignId = updated?.campaignId || data?.campaignId || args?.data.campaignId;
          const serviceType = updated?.serviceType || data?.serviceType || args?.data.serviceType;

          if (serviceId && campaignId && serviceType) {
            await updateServiceInCampaignGroup(campaignId, serviceId, serviceType, data);
          }
        } catch (error) {
          console.error("Error updating CampaignGroup from service:", error);
        }
      }

      const rootObject = await context.directives.model[db].findOne(
        {
          where: args.where,
          type,
        },
        context,
        info
      );

      const nestedObjects = await visitNestedModels({
        type,
        data: rootObject,
        info,
        context,
        isCreateOrUpdate: true,
        modelFunction: (localType: any, value: any, infoParam: any = {}) =>
          this.findOneQueryResolver(localType)(
            root,
            { ...args, where: value },
            context,
            infoParam
          ),
      });

      // TODO: concat arrays
      const mergedObjects = {
        ...rootObject,
        ...cleanNestedObjects(nestedObjects),
      };

      return mergedObjects;
    };
  }

  // Helper function for adding mutations to the schema
  private addMutation(field: any, replaceExisting = false) {
    if (
      replaceExisting ||
      !(this.schema.getMutationType() as any).getFields()[field.name]
    ) {
      (this.schema.getMutationType() as any).getFields()[field.name] = field;
    }
  }

  // Helper function for adding queries to the schema
  private addQuery(field: any, replaceExisting = false) {
    if (
      replaceExisting ||
      !(this.schema.getQueryType() as any).getFields()[field.name]
    ) {
      (this.schema.getQueryType() as any).getFields()[field.name] = field;
    }
  }

  private addMutations(type: GraphQLObjectType) {
    const names = generateFieldNames(type.name);

    // TODO add check to make sure mutation root type is defined and if not create it

    // create mutation

    this.addMutation({
      name: names.mutation.create,
      type,
      description: `Create a ${type.name}`,
      args: [
        {
          name: "data",
          type: this.schema.getType(names.input.type),
        },
      ],
      resolve: this.createMutationResolver(type),
      isDeprecated: false,
    });

    // update mutation

    this.addMutation({
      name: names.mutation.update,
      type,
      description: `Update a ${type.name}`,
      args: [
        {
          name: "data",
          type: getInputType(type.name, this.schema),
        },
        {
          name: "where",
          type: getInputType(type.name, this.schema),
        } as any,
        {
          name: "upsert",
          type: GraphQLBoolean,
        } as any,
      ],
      resolve: this.updateResolver(type),
      isDeprecated: false,
    });

    // remove mutation

    this.addMutation({
      name: names.mutation.remove,
      type: GraphQLBoolean,
      description: `Remove a ${type.name}`,
      args: [
        {
          name: "where",
          type: this.schema.getType(names.input.type),
        } as any,
      ],
      resolve: (
        _root: any,
        args: RemoveResolverArgs,
        context: any,
        info: any
      ) => {
        const params = getDirectiveParams("model", type);
        const db = params?.db ?? "store";
        return context.directives.model[db].remove(
          {
            where: args.where,
            type,
          },
          context,
          info
        );
      },
      isDeprecated: false,
    });
  }

  private addQueries(type: GraphQLObjectType) {
    const names = generateFieldNames(type.name);

    // find one query

    this.addQuery({
      name: names.query.one,
      type,
      description: `Find one ${type.name}`,
      args: [
        {
          name: "where",
          type: this.schema.getType(names.input.type),
        } as any,
      ],
      resolve: this.findOneQueryResolver(type),
      isDeprecated: false,
    });

    // find many query
    this.schema.getTypeMap()["GraphQLInt"] = GraphQLInt;

    const listTypeName = `${names.query.one}List`;
    const listType = new GraphQLObjectType({
      name: listTypeName,
      fields: () => ({
        list: {
          type: new GraphQLList(type),
        },
        maxPages: {
          type: GraphQLInt,
        },
      }),
    });
    this.schema.getTypeMap()[listTypeName] = listType;

    this.addQuery({
      name: names.query.many,
      type: listType,
      description: `Find multiple ${pluralize.plural(type.name)}`,
      args: [
        {
          name: "where",
          type: this.schema.getType(names.input.type),
        } as any,
        {
          name: "page",
          type: GraphQLInt,
        },
        {
          name: "pageSize",
          type: GraphQLInt,
        },
        {
          name: "includeMaxPages",
          type: GraphQLBoolean,
        },
      ],
      resolve: this.findQueryResolver(type),
      isDeprecated: false,
    });
  }
}
