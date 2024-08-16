import { QueryRunner } from "typeorm";
import { QueryResultCache } from "typeorm/cache/QueryResultCache";
import { QueryResultCacheOptions } from "typeorm/cache/QueryResultCacheOptions";

export class MappedCache implements QueryResultCache {
  private cache: Map<String, any> = new Map();
  connect(): Promise<void> {
    return Promise.resolve();
  }
  disconnect(): Promise<void> {
    return Promise.resolve();
  }
  synchronize(queryRunner?: QueryRunner | undefined): Promise<void> {
    return Promise.resolve();
  }
  getFromCache(
    options: QueryResultCacheOptions,
    queryRunner?: QueryRunner | undefined,
  ): Promise<QueryResultCacheOptions | undefined> {
    const id = (options.identifier || options.query) as string;
    return this.cache.get(id);
  }
  storeInCache(
    options: QueryResultCacheOptions,
    savedCache: QueryResultCacheOptions | undefined,
    queryRunner?: QueryRunner | undefined,
  ): Promise<void> {
    const id = (options.identifier || options.query) as string;
    this.cache.set(id, options);

    // delete after specified duration
    setTimeout(() => this.cache.delete(id), options.duration);
    return Promise.resolve();
  }
  isExpired(savedCache: QueryResultCacheOptions): boolean {
    return savedCache.time! + savedCache.duration < new Date().getTime();
  }
  clear(queryRunner?: QueryRunner | undefined): Promise<void> {
    this.cache.clear();
    return Promise.resolve();
  }
  remove(identifiers: string[], queryRunner?: QueryRunner | undefined): Promise<void> {
    identifiers.forEach((id) => this.cache.delete(id));
    return Promise.resolve();
  }
}
