import { Logger, LogLevel } from "../utils/Logger";

//TryCatchLog wraps methods in a try catch block and logs any errors
export const TryCatchLog: MethodDecorator = (
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<any>
) => {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    try {
      Logger.log(
        LogLevel.DEBUG,
        `${String(propertyKey)} called with: ${
          args.length ? args : "<No Args>"
        }`,
        target.constructor.name
      );

      const result = originalMethod.apply(this, args);
      if (result && result instanceof Promise) {
        // Return promise
        return result.catch((e: any) => {
          Logger.log(
            LogLevel.ERROR,
            `${String(propertyKey)} ${e}`,
            target.constructor.name
          );
        });
      }
      return result;
    } catch (e) {
      Logger.log(
        LogLevel.ERROR,
        `${String(propertyKey)} ${e}`,
        target.constructor.name
      );
    }
  };
};
