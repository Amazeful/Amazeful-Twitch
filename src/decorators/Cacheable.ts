import { CacheableMethodDecorator } from "../types/Misc";
import { CacheableConfig } from "../types/CacheableConfig";
import { container } from "tsyringe";
import { CacheManager } from "../services/CahceManager";
import { ORM } from "../services/ORM";
import { Logger, LogLevel } from "../utils/Logger";

export const Cacheable =
  (config: CacheableConfig): CacheableMethodDecorator =>
  (target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value!;
    descriptor.value = async function name(...args: any[]) {
      let cacheManger = container.resolve(CacheManager);
      if (!config.key) {
        config.key = `${propertyKey}/${args
          .map((arg) => arg.toString())
          .join(":")}`;
      }
      try {
        let cachedValue = await cacheManger.get(config.key);
        if (cachedValue) {
          let jsonValue = JSON.parse(cachedValue);
          if (config.entity) {
            let orm = container.resolve(ORM);
            let repository = orm.em.getRepository(config.entity);
            return repository.merge(jsonValue);
          }
          return jsonValue;
        }
      } catch (e) {
        Logger.log(
          LogLevel.ERROR,
          `Failed to get Cachable value from cache for key ${config.key}: ${e}`
        );
        return originalMethod.apply(this, args);
      }

      var result = await originalMethod.apply(this, args);

      cacheManger
        .cache({
          key: config.key,
          value: JSON.stringify(result),
          expiry: config.expiry,
        })
        .catch((e) => {
          Logger.log(
            LogLevel.ERROR,
            `Failed to set cache for key ${config.key}: ${e}`
          );
        });

      return result;
    };

    return descriptor;
  };
