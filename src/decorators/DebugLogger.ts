import { Logger, LogLevel } from "../utils/Logger";

//DebugLogger intercepts methods and logs some data for debugging purposes
export const DebugLogger: MethodDecorator = (
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<any>
) => {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    Logger.log(
      LogLevel.DEBUG,
      `${String(propertyKey)} called with: ${args.length ? args : "<No Args>"}`,
      target.constructor.name
    );

    return originalMethod.apply(this, args);
  };
};
