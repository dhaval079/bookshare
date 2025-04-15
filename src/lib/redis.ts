// src/lib/redis.ts
import { createClient } from 'redis';

// Simple in-memory cache as complete fallback
const memoryCache = new Map<string, { data: any; expiry: number }>();
const CACHE_SIZE_LIMIT = 100;

// Set Redis as disabled by default, only enable if connection succeeds
let isRedisEnabled = false;
let client: any = null;

// Try to create Redis client if URL is provided
try {
  const redisUrl = process.env.REDIS_URL;
  
  if (redisUrl) {
    console.log('Redis URL found, attempting connection');
    
    // Ensure URL has proper protocol
    const formattedRedisUrl = !redisUrl.startsWith('redis://') && !redisUrl.startsWith('rediss://') 
      ? `redis://${redisUrl}` 
      : redisUrl;
    
    client = createClient({ 
      url: formattedRedisUrl,
      socket: {
        connectTimeout: 3000, // 3 second timeout
        reconnectStrategy: false // Disable auto-reconnect
      }
    });
    
    // Don't block app startup on Redis connection
    if (process.env.NODE_ENV !== 'test') {
      client.connect()
        .then(() => {
          console.log('Redis connected successfully');
          isRedisEnabled = true;
        })
        .catch((err: Error) => {
          console.warn('Redis connection failed, using memory cache only:', err.message);
          isRedisEnabled = false;
        });
    }
  } else {
    console.log('No Redis URL found, using memory cache only');
  }
} catch (error) {
  console.warn('Error setting up Redis client, using memory cache only:', 
    error instanceof Error ? error.message : String(error));
}

// Helper function to get from memory cache
function getFromMemoryCache(key: string) {
  const item = memoryCache.get(key);
  if (!item) return null;
  
  if (Date.now() > item.expiry) {
    memoryCache.delete(key);
    return null;
  }
  
  return item.data;
}

// Helper function to set to memory cache
function setToMemoryCache(key: string, data: any, expireInSeconds: number) {
  // Clean up cache if it's too large
  if (memoryCache.size >= CACHE_SIZE_LIMIT) {
    const oldestKey = memoryCache.keys().next().value;
    if (oldestKey !== undefined) {
      memoryCache.delete(oldestKey);
    }
  }
  
  memoryCache.set(key, { 
    data, 
    expiry: Date.now() + (expireInSeconds * 1000)
  });
}

export async function getCache<T>(key: string): Promise<T | null> {
  // Try Redis first if enabled
  if (isRedisEnabled && client && client.isOpen) {
    try {
      const data = await client.get(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      // Silent fallback to memory cache
    }
  }
  
  // Fallback to memory cache
  return getFromMemoryCache(key);
}

export async function setCache(key: string, data: any, expireInSeconds = 60): Promise<void> {
  // Try Redis first if enabled
  if (isRedisEnabled && client && client.isOpen) {
    try {
      await client.set(key, JSON.stringify(data), { EX: expireInSeconds });
    } catch (error) {
      // Silent fallback to memory cache
    }
  }
  
  // Always set in memory cache as backup
  setToMemoryCache(key, data, expireInSeconds);
}

export async function deleteCache(key: string): Promise<void> {
  // Try Redis first if enabled
  if (isRedisEnabled && client && client.isOpen) {
    try {
      await client.del(key);
    } catch (error) {
      // Silent continue
    }
  }
  
  // Always delete from memory cache
  memoryCache.delete(key);
}

// Exporting a dummy client object if Redis isn't available
export default {
  isOpen: isRedisEnabled && client?.isOpen,
  connect: async () => {
    if (client) return client.connect();
    return Promise.resolve();
  },
  get: async (key: string) => {
    if (isRedisEnabled && client && client.isOpen) 
      return client.get(key);
    return null;
  },
  set: async (key: string, value: string, options?: any) => {
    if (isRedisEnabled && client && client.isOpen) 
      return client.set(key, value, options);
    return null;
  },
  del: async (key: string) => {
    if (isRedisEnabled && client && client.isOpen) 
      return client.del(key);
    return null;
  }
};