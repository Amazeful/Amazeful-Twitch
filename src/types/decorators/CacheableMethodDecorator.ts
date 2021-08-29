//Defines a type for Cacheable method decorators.
//Cacheable methods must return a Promise
export type CacheableMethodDecorator = <T>(
  target: Object,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<T>>
) => void;
