import { Injectable, Logger } from '@nestjs/common';
import { Cache } from './cache.interface';

interface CacheItem<T> {
  value: T;
  expiresAt?: number;
}

@Injectable()
export class MemoryCache implements Cache {
  private readonly logger = new Logger(MemoryCache.name);
  private cache = new Map<string, CacheItem<any>>();

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    
    if (!item) {
      this.logger.debug(`Cache miss para chave: ${key}`);
      return null;
    }

    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.logger.debug(`Cache expirado para chave: ${key}`);
      this.cache.delete(key);
      return null;
    }

    this.logger.debug(`Cache hit para chave: ${key}`);
    return item.value;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const item: CacheItem<T> = {
      value,
      expiresAt: ttl ? Date.now() + ttl * 1000 : undefined
    };

    this.cache.set(key, item);
    this.logger.debug(`Cache set para chave: ${key}`);
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
    this.logger.debug(`Cache delete para chave: ${key}`);
  }

  async clear(): Promise<void> {
    this.cache.clear();
    this.logger.debug('Cache limpo');
  }
} 