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
import { RedisKeyGenerator, RedisStructure } from "../RedisDirective";
import { getDirectiveParams } from "../ModelDirective/util";
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
    const redisParams = getDirectiveParams("redis", props.type) || {
      ttl: 3600,
    };

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
    const redisParams = getDirectiveParams("redis", props.type) || {
      ttl: 3600,
    };

    // Create a pattern to match all entities of this type
    const pattern = this.prefixKey(RedisKeyGenerator.forEntity(props.type.name, '*'));
    
    // Get all matching key-value pairs
    const results = await this.getKeyValuesByPatternSafe(pattern);
    
    // Apply filtering if where clause is provided
    let filteredResults = results;
    if (props.where && Object.keys(props.where).length > 0) {
      filteredResults = results.filter(item => {
        for (const [key, value] of Object.entries(props.where)) {
          if (item.value[key] !== value) {
            return false;
          }
        }
        return true;
      });
    }
    
    // Calculate pagination
    const page = props.page || 1;
    const pageSize = props.pageSize || filteredResults.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredResults.length);
    const maxPages = pageSize > 0 ? Math.ceil(filteredResults.length / pageSize) : 1;
    
    // Extract just the values for the current page
    const paginatedResults = filteredResults
      .slice(startIndex, endIndex)
      .map(item => item.value);
    
    return {
      list: paginatedResults,
      maxPages: props.includeMaxPages ? maxPages : null
    };
  }

  async create(
    props: StoreCreateProps,
    context: Context,
    info: any
  ): Promise<StoreCreateReturn> {
    const redisParams = getDirectiveParams("redis", props.type) || {
      ttl: 3600,
    };

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
    const redisParams = getDirectiveParams("redis", props.type) || {
      ttl: 3600,
    };

    const structure = redisParams.structure || RedisStructure.STRING;
    // Ensure TTL is a number
    const ttl = redisParams.ttl !== undefined ? parseInt(String(redisParams.ttl), 10) : 3600;
    
    // Get ID from where clause
    const id = (props.where as any)?.id || (props.where as any)?._id;
    if (!id) return null as StoreUpdateReturn;
    
    // Generate key for the entity
    const key = this.prefixKey(RedisKeyGenerator.forEntity(props.type.name, id));
    
    // Check if key exists
    const exists = await this.redis.exists(key);
    if (!exists) {
      return null as StoreUpdateReturn;
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

  /**
   * Helper function to get all key-value pairs that match a pattern using SCAN
   * This is more suitable for production with large datasets
   * @param pattern Redis key pattern with wildcards (e.g., "user:*")
   * @returns Array of {key, value} objects for all matching keys
   */
  async getKeyValuesByPatternSafe(pattern: string): Promise<Array<{key: string, value: any}>> {
    const results: Array<{key: string, value: any}> = [];
    let cursor = '0';
    
    try {
      do {
        // Get batch of keys
        const [nextCursor, keys] = await this.redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
        cursor = nextCursor;
        
        if (keys.length > 0) {
          // Get values for this batch
          const values = await this.redis.mget(keys);
          
          // Add to results
          keys.forEach((key, index) => {
            if (values[index]) {
              try {
                results.push({
                  key,
                  value: JSON.parse(values[index] as string)
                });
              } catch (e) {
                // If not valid JSON, use as is
                results.push({
                  key,
                  value: values[index]
                });
              }
            }
          });
        }
      } while (cursor !== '0');
      
      return results;
    } catch (error) {
      console.error('Error scanning keys by pattern:', error);
      return [];
    }
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