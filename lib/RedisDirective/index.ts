import { SchemaDirectiveVisitor } from "@graphql-tools/utils";
import { GraphQLObjectType } from "graphql";
import { getDirectiveParams } from "../ModelDirective/util";
import { RedisStore } from "../stores/RedisStore";

export enum RedisCacheStrategy {
  CACHE_FIRST = "CACHE_FIRST",
  CACHE_ONLY = "CACHE_ONLY",
  WRITE_THROUGH = "WRITE_THROUGH",
  WRITE_BEHIND = "WRITE_BEHIND",
  REFRESH_AHEAD = "REFRESH_AHEAD",
  READ_THROUGH = "READ_THROUGH"
}

export enum RedisStructure {
  STRING = "STRING",
  HASH = "HASH",
  LIST = "LIST",
  SET = "SET",
  SORTED_SET = "SORTED_SET",
  GEO = "GEO",
  HYPERLOGLOG = "HYPERLOGLOG",
  STREAM = "STREAM"
}

export enum RedisInvalidationEvent {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  RELATED_UPDATE = "RELATED_UPDATE",
  SCHEDULED = "SCHEDULED",
  CUSTOM_EVENT = "CUSTOM_EVENT"
}

export interface RedisConfig {
  ttl: number;
  strategy: RedisCacheStrategy;
  structure: RedisStructure;
  invalidateOn: string[];
}

export interface ResolverContext {
  directives: {
    redis: {
      store: RedisStore;
    };
  };
  [key: string]: any;
}

export class RedisDirective extends SchemaDirectiveVisitor {
  visitObject(type: GraphQLObjectType) {
    // Get Redis directive parameters
    const params = getDirectiveParams("redis", type);
    // Apply default values if not specified
    const config: RedisConfig = {
      ttl: params?.ttl !== undefined ? parseInt(String(params.ttl), 10) : 3600,
      strategy: params?.strategy || RedisCacheStrategy.CACHE_FIRST,
      structure: params?.structure || RedisStructure.STRING,
      invalidateOn: params?.invalidateOn || [
        RedisInvalidationEvent.CREATE,
        RedisInvalidationEvent.UPDATE,
        RedisInvalidationEvent.DELETE
      ]
    };

    console.log(`Redis config for ${type.name}: TTL=${config.ttl}, strategy=${config.strategy}`);
    
    // Store configuration on the type for later use
    (type as any).redisConfig = config;

    // Check if type also has @model directive
    const hasModelDirective = Boolean((type as any).getFields().id);
    if (!hasModelDirective) {
      // This is a Redis-only entity, we need to add resolvers
      this.addRedisOnlyResolvers(type, config);
    }
  }

  private addRedisOnlyResolvers(type: GraphQLObjectType, config: RedisConfig) {
    // Implement Redis-specific resolvers for the type
    // This would handle queries and mutations for Redis-only entities
    // Similar to how ModelDirective adds CRUD operations
    
    // Note: Implementation would be similar to ModelDirective but using RedisStore instead
    // For brevity, actual implementation details are omitted here
  }
}

export class RedisKeyGenerator {
  /**
   * Generate a key for a single entity
   */
  static forEntity(typeName: string, id: string): string {
    return `${typeName.toLowerCase()}:${id}`;
  }
  
  /**
   * Generate a key for a list query with pagination and filters
   */
  static forList(typeName: string, params: Record<string, any>): string {
    const { page = 1, pageSize, ...filters } = params;
    
    // Start with base key including page
    let key = `${typeName.toLowerCase()}|page:${page}`;
    
    // Add pageSize if specified
    if (pageSize) {
      key += `|pageSize:${pageSize}`;
    }
    
    // Add all other filter params in alphabetical order
    const sortedParams = Object.keys(filters).sort();
    
    for (const param of sortedParams) {
      const value = filters[param];
      
      // Handle different value types
      if (Array.isArray(value)) {
        key += `|${param}:[${value.join(',')}]`;
      } else if (typeof value === 'object' && value !== null) {
        key += `|${param}:${JSON.stringify(value)}`;
      } else {
        key += `|${param}:${value}`;
      }
    }
    
    return key;
  }
} 