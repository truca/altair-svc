import { GraphQLNamedType } from "graphql";
import { Context } from "../types";

export interface StoreFindProps {
  where: object;
  type: GraphQLNamedType;
  page?: number;
  pageSize?: number;
  includeMaxPages?: boolean;
}
export interface StoreFindReturn {
  id: string;
  [key: string]: any;
}
export interface StoreFindOneProps {
  where: object;
  type: GraphQLNamedType;
}
export interface StoreFindOneReturn {
  id: string;
  [key: string]: any;
}
export interface StoreCreateProps {
  data: object & { id?: string };
  type: GraphQLNamedType;
}
export type StoreCreateReturn = {
  id: string;
  [key: string]: any;
} | null;
export interface StoreUpdateProps {
  data: object;
  type: GraphQLNamedType;
  where?: object;
  upsert?: boolean;
}
export declare type StoreUpdateReturn = {
  id: string;
  [key: string]: any;
} | null | boolean;
export interface StoreRemoveProps {
  where: object;
  type: GraphQLNamedType;
}
export declare type StoreRemoveReturn = boolean;
export interface Store {
  find(
    props: StoreFindProps,
    context: Context,
    info: any
  ): Promise<{ list: StoreFindReturn[]; maxPages: number | null }>;
  findOne(
    props: StoreFindOneProps,
    context: Context,
    info: any
  ): Promise<StoreFindOneReturn | null>;
  create(
    props: StoreCreateProps,
    context: Context,
    info: any
  ): Promise<StoreCreateReturn>;
  update(
    props: StoreUpdateProps,
    context: Context,
    info: any
  ): Promise<StoreUpdateReturn>;
  remove(
    props: StoreRemoveProps,
    context: Context,
    info: any
  ): Promise<StoreRemoveReturn>;
}
