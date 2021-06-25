import { container } from "tsyringe";

//AutoWired injects injectable classes into class properties
export const AutoWired: PropertyDecorator = (target, propertyKey) => {
  const type = Reflect.getMetadata("design:type", target, propertyKey);
  //Do nothing if a method
  if (type === Function) return;
  if (type === undefined)
    throw new Error(
      `Could not inject ${String(propertyKey)}, Failed to get type of ${
        target.constructor.name
      }`
    );

  Object.defineProperty(target, propertyKey, {
    get: () => {
      return container.resolve(type);
    },
  });
};
