import { AnyEntity, EntityName } from "@mikro-orm/core";

export interface CacheableConfig {
  expiry: number;
  key?: string;
  entity?: EntityName<AnyEntity>;
}
