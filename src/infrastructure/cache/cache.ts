import { Injectable, Logger } from '@nestjs/common';
import { ICache } from './cache.interface';

interface CacheItem<T> {
  value: T;
  expiresAt: number | null;
}

@Injectable()
export class Cache implements ICache {
  private readonly logger = new Logger(Cache.name);
  private readonly cache: Map<string, CacheItem<any>> = new Map();

  get<T>(key: string): T | null {
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
    return item.value as T;
  }

  set<T>(key: string, value: T, ttl?: number): void {
    const item: CacheItem<T> = {
      value,
      expiresAt: ttl ? Date.now() + ttl * 1000 : null,
    };

    this.cache.set(key, item);
    this.logger.debug(`Cache set para chave: ${key}`);
  }

  delete(key: string): void {
    this.cache.delete(key);
    this.logger.debug(`Cache delete para chave: ${key}`);
  }

  clear(): void {
    this.cache.clear();
    this.logger.debug('Cache limpo');
  }
}
