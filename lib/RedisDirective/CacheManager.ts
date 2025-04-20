import { RedisKeyGenerator, RedisCacheStrategy, RedisStructure } from "./index";
import { extractDirectiveParams } from "../GraphQL/utils";

export class RedisCacheManager {
  /**
   * Check if a type has Redis caching enabled
   */
  static hasRedisCaching(type: any, context: any): boolean {
    const redisParams = extractDirectiveParams(type.astNode, "redis");
    return Boolean(redisParams && context.directives.redis?.enabled);
  }

  /**
   * Get Redis parameters for a type
   */
  static getRedisParams(type: any): any {
    return extractDirectiveParams(type.astNode, "redis");
  }

  /**
   * Try to get an item from cache based on strategy
   */
  static async tryGetFromCache(params: {
    type: any;
    context: any;
    info: any;
    where: any;
    strategy?: RedisCacheStrategy;
  }) {
    const { type, context, info, where, strategy: strategyParam } = params;
    
    if (!this.hasRedisCaching(type, context)) {
      return { found: false, data: null };
    }
    
    const redisStore = context.directives.redis.store;
    const redisParams = this.getRedisParams(type);
    const strategy = strategyParam || redisParams.strategy || RedisCacheStrategy.CACHE_FIRST;
    
    // Only check cache for certain strategies
    if (strategy !== RedisCacheStrategy.CACHE_FIRST && 
        strategy !== RedisCacheStrategy.CACHE_ONLY) {
      return { found: false, data: null };
    }
    
    try {
      // Try to get from Redis
      const cachedItem = await redisStore.findOne({
        where,
        type
      }, context, info);
      
      if (cachedItem) {
        return { found: true, data: cachedItem };
      }
      
      // If not found but we're cache only, return null with found=true to prevent DB lookup
      if (strategy === RedisCacheStrategy.CACHE_ONLY) {
        return { found: true, data: null };
      }
      
      return { found: false, data: null };
    } catch (err) {
      console.error('Redis cache read error:', err);
      return { found: false, data: null };
    }
  }

  /**
   * Try to get a list from cache based on strategy
   */
  static async tryGetListFromCache(params: {
    type: any;
    context: any;
    info: any;
    where: any;
    page?: number;
    pageSize?: number;
    includeMaxPages?: boolean;
    strategy?: RedisCacheStrategy;
  }) {
    const { type, context, info, where, page, pageSize, includeMaxPages, strategy: strategyParam } = params;
    
    if (!this.hasRedisCaching(type, context)) {
      return { found: false, data: null };
    }
    
    const redisStore = context.directives.redis.store;
    const redisParams = this.getRedisParams(type);
    const strategy = strategyParam || redisParams.strategy || RedisCacheStrategy.CACHE_FIRST;
    
    // Only check cache for certain strategies
    if (strategy !== RedisCacheStrategy.CACHE_FIRST && 
        strategy !== RedisCacheStrategy.CACHE_ONLY) {
      return { found: false, data: null };
    }
    
    try {
      // Try to get from Redis
      const cachedData = await redisStore.find({
        where,
        page,
        pageSize,
        includeMaxPages,
        type
      }, context, info);
      
      // If found in cache and has data
      if (cachedData.list.length > 0) {
        return { found: true, data: cachedData };
      }
      
      // If not found but we're cache only, return empty result
      if (strategy === RedisCacheStrategy.CACHE_ONLY) {
        return { found: true, data: { list: [], maxPages: null } };
      }
      
      return { found: false, data: null };
    } catch (err) {
      console.error('Redis cache read error:', err);
      return { found: false, data: null };
    }
  }

  /**
   * Update an item in the cache based on strategy
   */
  static async updateCache(params: {
    type: any;
    context: any;
    info: any;
    data: any;
    strategy?: RedisCacheStrategy;
    operation: 'create' | 'update';
  }) {
    const { type, context, info, data, strategy: strategyParam, operation } = params;
    
    if (!this.hasRedisCaching(type, context)) {
      return;
    }
    
    const redisStore = context.directives.redis.store;
    const redisParams = this.getRedisParams(type);
    const strategy = strategyParam || redisParams.strategy || RedisCacheStrategy.CACHE_FIRST;
    
    // Only update cache for strategies that write data
    if (strategy !== RedisCacheStrategy.WRITE_THROUGH && 
        strategy !== RedisCacheStrategy.WRITE_BEHIND && 
        strategy !== RedisCacheStrategy.CACHE_FIRST &&
        strategy !== RedisCacheStrategy.READ_THROUGH) {
      return;
    }
    
    try {
      // For asynchronous updates
      if (strategy === RedisCacheStrategy.WRITE_BEHIND) {
        // Fire and forget caching
        if (operation === 'create') {
          redisStore.create({
            data,
            type
          }, context, info).catch((err: Error) => console.error('Redis caching error:', err));
        } else {
          redisStore.update({
            where: { id: data.id },
            data,
            type
          }, context, info).catch((err: Error) => console.error('Redis caching error:', err));
        }
      } 
      // For synchronous updates
      else {
        if (operation === 'create') {
          await redisStore.create({
            data,
            type
          }, context, info);
        } else {
          await redisStore.update({
            where: { id: data.id },
            data,
            type
          }, context, info);
        }
      }
    } catch (err) {
      console.error('Redis cache update error:', err);
    }
  }

  /**
   * Update a list in the cache based on strategy
   */
  static async updateListCache(params: {
    type: any;
    context: any;
    info: any;
    data: { list: any[]; maxPages: number | null };
    where: any;
    page?: number;
    pageSize?: number;
  }) {
    const { type, context, info, data, where, page, pageSize } = params;
    
    if (!this.hasRedisCaching(type, context) || !data.list.length) {
      return;
    }
    
    const redisStore = context.directives.redis.store;
    
    try {
      // Cache in Redis
      await redisStore.create({
        data: { 
          items: data.list,
          maxPages: data.maxPages,
          id: RedisKeyGenerator.forList(type.name, {
            ...where,
            page,
            pageSize
          })
        },
        type
      }, context, info);
    } catch (err) {
      console.error('Redis list cache update error:', err);
    }
  }

  /**
   * Remove an item from cache
   */
  static async invalidateCache(params: {
    type: any;
    context: any;
    info: any;
    where: any;
  }) {
    const { type, context, info, where } = params;
    
    if (!this.hasRedisCaching(type, context)) {
      return;
    }
    
    const redisStore = context.directives.redis.store;
    const redisParams = this.getRedisParams(type);
    const invalidateEvents = redisParams.invalidateOn || ["CREATE", "UPDATE", "DELETE"];
    
    // Only invalidate cache if DELETE is in the invalidation events
    if (invalidateEvents.includes("DELETE")) {
      try {
        await redisStore.remove({
          where,
          type
        }, context, info);
      } catch (err) {
        console.error('Redis cache invalidation error:', err);
      }
    }
  }
} 