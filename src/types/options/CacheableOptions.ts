import { EntityName, AnyEntity } from "@mikro-orm/core";
//Cacheable decorator options
export interface CacheableOptions {
  expiry: number;
  key?: string;
  entity?: EntityName<AnyEntity>;
}
