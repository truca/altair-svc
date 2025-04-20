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
  StoreUpdateReturn
} from "./types";
import { Context } from "../types";
import { RedisKeyGenerator, RedisCacheStrategy, RedisStructure } from "../RedisDirective";
import { getDirectiveParams } from "../ModelDirective/util";
import { extractDirectiveParams } from "../GraphQL/utils";
import Redis from "ioredis";

export interface RedisStoreOptions {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
}

export class RedisStore implements Store {
  private redis: Redis;
  private keyPrefix: string;

  constructor(options: RedisStoreOptions) {
    this.redis = new Redis({
      host: options.host,
      port: options.port,
      password: options.password,
      db: options.db || 0,
    });
    
    this.keyPrefix = options.keyPrefix || '';
  }

  async findOne(
    props: StoreFindOneProps,
    context: Context,
    info: any
  ): Promise<StoreFindOneReturn | null> {
    const redisParams = extractDirectiveParams(props.type.astNode as any, "redis");
    if (!redisParams) return null;

    const structure = redisParams.structure || RedisStructure.STRING;
    const id = (props.where as any)?.id || (props.where as any)?._id;
    
    if (!id) return null;
    
    // Generate key based on type and id
    const key = this.prefixKey(RedisKeyGenerator.forEntity(props.type.name, id));

    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async find(
    props: StoreFindProps,
    context: Context,
    info: any
  ): Promise<{ list: StoreFindReturn[]; maxPages: number | null }> {
    const redisParams = extractDirectiveParams(props.type.astNode as any, "redis");
    if (!redisParams) return { list: [], maxPages: null };

    // For list queries, we need to use a different key pattern
    const key = this.prefixKey(RedisKeyGenerator.forList(props.type.name, props.where || {}));
    
    const data = await this.redis.get(key);
    if (!data) return { list: [], maxPages: null };
    
    const parsed = JSON.parse(data);
    return {
      list: Array.isArray(parsed.items) ? parsed.items : [],
      maxPages: parsed.maxPages || null
    };
  }

  async create(
    props: StoreCreateProps,
    context: Context,
    info: any
  ): Promise<StoreCreateReturn> {
    const redisParams = extractDirectiveParams(props.type.astNode as any, "redis");
    if (!redisParams) return null;

    // Ensure TTL is a number
    const ttl = redisParams.ttl !== undefined ? parseInt(String(redisParams.ttl), 10) : 3600;
    const structure = redisParams.structure || RedisStructure.STRING;
    
    // Ensure we have an ID
    const id = props.data.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const key = this.prefixKey(RedisKeyGenerator.forEntity(props.type.name, id));
    const data = { ...props.data, id };
    
    console.log(`Setting Redis key ${key} with TTL: ${ttl}`);
    await this.redis.set(key, JSON.stringify(data), 'EX', ttl);
    
    return data as StoreCreateReturn;
  }

  async update(
    props: StoreUpdateProps,
    context: Context,
    info: any
  ): Promise<StoreUpdateReturn> {
    const redisParams = extractDirectiveParams(props.type.astNode as any, "redis");
    if (!redisParams) return false;

    const structure = redisParams.structure || RedisStructure.STRING;
    // Ensure TTL is a number
    const ttl = redisParams.ttl !== undefined ? parseInt(String(redisParams.ttl), 10) : 3600;
    
    // Get ID from where clause
    const id = (props.where as any)?.id || (props.where as any)?._id;
    if (!id) return false;
    
    // Generate key for the entity
    const key = this.prefixKey(RedisKeyGenerator.forEntity(props.type.name, id));
    
    // Check if key exists
    const exists = await this.redis.exists(key);
    if (!exists) {
      // Create instead of update if not exists
      return Boolean(await this.create({ 
        data: { ...props.data, id }, 
        type: props.type 
      }, context, info));
    }
    
    // For STRING, we need to get current data, merge, and set
    const currentData = await this.redis.get(key);
    const merged = { ...JSON.parse(currentData || '{}'), ...props.data, id };
    console.log(`Updating Redis key ${key} with TTL: ${ttl}`);
    await this.redis.set(key, JSON.stringify(merged), 'EX', ttl);
    return merged as StoreUpdateReturn;
  }

  async remove(
    props: StoreRemoveProps,
    context: Context,
    info: any
  ): Promise<StoreRemoveReturn> {
    const id = (props.where as any)?.id || (props.where as any)?._id;
    if (!id) return false;
    
    const key = this.prefixKey(RedisKeyGenerator.forEntity(props.type.name, id));
    
    const deleted = await this.redis.del(key);
    return deleted > 0;
  }

  // Helper to convert Redis hash to object
  private convertHashToObject(hash: Record<string, string>): any {
    const result: any = { };
    
    Object.entries(hash).forEach(([key, value]) => {
      try {
        // Try to parse JSON values
        result[key] = JSON.parse(value);
      } catch (e) {
        // If not JSON, use as is
        result[key] = value;
      }
    });
    
    return result;
  }
  
  // Helper to flatten object for Redis hash
  private flattenObjectForHash(obj: any, prefix = ''): Record<string, string> {
    const result: Record<string, string> = {};
    
    Object.entries(obj).forEach(([key, value]) => {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (value === null || value === undefined) {
        // Skip null/undefined values
        return;
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        // Recursively flatten nested objects
        Object.assign(result, this.flattenObjectForHash(value, newKey));
      } else {
        // Store as JSON string
        result[newKey] = JSON.stringify(value);
      }
    });
    
    return result;
  }
  
  private prefixKey(key: string): string {
    return this.keyPrefix ? `${this.keyPrefix}:${key}` : key;
  }
} 