// @ts-nocheck
import {
  __Field,
  defaultFieldResolver,
  getNamedType,
  getNullableType,
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
} from "graphql";
import { SchemaDirectiveVisitor } from "@graphql-tools/utils";
import _, { isArray, isPlainObject, merge, mergeWith, pickBy } from "lodash";
import * as pluralize from "pluralize";
import { generateFieldNames } from "./generateFieldNames";
import { cleanNestedObjects, getInputType, hasDirective } from "./util";
import { validateInputData } from "./validateInputData";
import { addInputTypesForObjectType } from "./addInputTypesForObjectType";
import { Store } from "./Store";
import mongoose from "mongoose";

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
}

export interface UpdateResolverArgs {
  data: any;
  where: any;
  upsert: boolean;
}

export interface RemoveResolverArgs {
  where: any;
}

export class ModelDirective extends SchemaDirectiveVisitor {
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

  private async visitNestedModels({ data, type, modelFunction, info }) {
    // console.log({ data, type, modelFunction, info });
    const res = {};

    // move into its own function
    const selectedFields =
      info?.fieldNodes?.[0].selectionSet.selections ||
      info?.selectionSet.selections ||
      [];
    const selectedFieldsHash = selectedFields.reduce((res, selection) => {
      res[selection.name.value] = selection;
      return res;
    }, {});
    // end move
    for (const key of Object.keys(data)) {
      if (key === "_id") continue;
      if (!selectedFieldsHash[key]) continue;

      const value = data[key];
      const field = getNamedType(type.getFields()[key]) as any;

      const fieldType = getNamedType(field.type);

      if (isPlainObject(value) && hasDirective("model", fieldType)) {
        const info = selectedFieldsHash[key];
        const foundObject = await modelFunction(fieldType, value, info);
        res[key] = foundObject;
      }

      if (Array.isArray(value) && value.every((v) => isPlainObject(v))) {
        const createdObjects: any[] = [];

        for (const v of value) {
          const info = selectedFieldsHash[key];
          const foundObject = await modelFunction(fieldType, v, info);
          createdObjects.push(foundObject);
        }

        res[key] = createdObjects;
      }
    }

    return res;
  }

  private pluckModelObjectIds(data) {
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
          .map((value) => this.pluckModelObjectIds(value))
          .filter((v) =>
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

  private findQueryResolver(type) {
    return async (
      root,
      args: FindResolverArgs,
      context: ResolverContext,
      info: any
    ) => {
      const initialData: object[] = await context.directives.model.store.find({
        where: args.where,
        type,
      });

      if (!initialData) {
        return null;
      }

      const results = await Promise.all(
        initialData.map(async (data) => {
          const nestedObjects = await this.visitNestedModels({
            type,
            data,
            info,
            modelFunction: async (localType, value, newInfo = null) => {
              const found = await this.findOneQueryResolver(localType)(
                root,
                { ...args, where: value },
                context,
                newInfo ? newInfo : info
              );
              return found;
            },
          });
          return { ...data, ...cleanNestedObjects(nestedObjects) };
        })
      );

      return results;
    };
  }

  private findOneQueryResolver(type) {
    return async (
      root,
      args: FindOneResolverArgs,
      context: ResolverContext,
      info: any
    ) => {
      console.log("findOneQueryResolver", args.where, type.name.toString());
      const rootObject = await context.directives.model.store.findOne({
        where: args.where,
        type,
      });

      if (!rootObject) {
        return null;
      }

      const nestedObjects = await this.visitNestedModels({
        type,
        data: rootObject,
        info,
        modelFunction: (localType: any, value: any, infoParam: any = {}) =>
          this.findOneQueryResolver(localType)(
            root,
            { ...args, where: value },
            context,
            infoParam
          ),
      });

      return { ...rootObject, ...cleanNestedObjects(nestedObjects) };
    };
  }

  private createMutationResolver(type, parentIdsParam = {}) {
    return async (
      root,
      args: CreateResolverArgs,
      context: ResolverContext,
      info: any
    ) => {
      validateInputData({
        data: args.data,
        type,
        schema: this.schema,
      });

      // add _id to the object if it doesn't exist
      if (!args.data._id) {
        args.data._id = new mongoose.Types.ObjectId();
      }

      const relatedObjects = await this.visitNestedModels({
        type,
        data: args.data,
        info,
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
            parentIds[parentFieldName] = { _id: parentData._id };
          }
          if (hasParentType && !isSingular) {
            parentIds[parentFieldName] = [{ _id: parentData._id }];
          }

          const createdObject = await this.createMutationResolver(
            localType,
            parentIds
          )(root, { ...args, data: value }, context, info);
          return createdObject;
        },
      });

      const objectIds = this.pluckModelObjectIds(relatedObjects);

      const rootObject = await context.directives.model.store.create({
        data: {
          ...args.data,
          ...objectIds,
          ...parentIdsParam,
        },
        type,
      });

      const mergedObjects = {
        ...rootObject,
        ...cleanNestedObjects(relatedObjects),
      };

      return mergedObjects;
    };
  }

  private updateResolver(type) {
    return async (
      root,
      args: UpdateResolverArgs,
      context: ResolverContext,
      info: any
    ) => {
      validateInputData({
        data: args.data,
        type,
        schema: this.schema,
      });

      const currentRootObject = await context.directives.model.store.findOne({
        where: args.where,
        type,
      });

      if (!args.data._id) {
        args.data._id = currentRootObject.id;
      }

      const relatedObjects = await this.visitNestedModels({
        type,
        data: args.data,
        info,
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
            parentIds[parentFieldName] = { _id: parentData._id };
          }
          if (hasParentType && !isSingular) {
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

      function customizer(objValue, srcValue) {
        if (isArray(objValue)) {
          return objValue.concat(srcValue);
        }
      }
      const objectIds = mergeWith(filteredRootObject, newObjectIds, customizer);

      const updated = await context.directives.model.store.update({
        where: args.where,
        data: {
          ...filteredData,
          ...objectIds,
        },
        upsert: args.upsert,
        type,
      });

      if (!updated) {
        throw new Error(`Failed to update ${type}`);
      }

      const rootObject = await context.directives.model.store.findOne({
        where: args.where,
        type,
      });

      const nestedObjects = await this.visitNestedModels({
        type,
        data: rootObject,
        info,
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
  private addMutation(field, replaceExisting = false) {
    if (
      replaceExisting ||
      !(this.schema.getMutationType() as any).getFields()[field.name]
    ) {
      (this.schema.getMutationType() as any).getFields()[field.name] = field;
    }
  }

  // Helper function for adding queries to the schema
  private addQuery(field, replaceExisting = false) {
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
      resolve: (root, args: RemoveResolverArgs, context: ResolverContext) => {
        return context.directives.model.store.remove({
          where: args.where,
          type,
        });
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

    this.addQuery({
      name: names.query.many,
      type: new GraphQLList(type),
      description: `Find multiple ${pluralize.plural(type.name)}`,
      args: [
        {
          name: "where",
          type: this.schema.getType(names.input.type),
        } as any,
      ],
      resolve: this.findQueryResolver(type),
      isDeprecated: false,
    });
  }
}
