import { Module } from "./Module";

//Defines an object constructor type
export type Constructor<T> = {
  new (...args: any[]): T;
};

//Defines a type for Cacheable method decorators.
//Cacheable methods must return a Promise
export type CacheableMethodDecorator = <T>(
  target: Object,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<T>>
) => void;

// CommandHandlerType defines a type of command handler method within modules
export type CommandHandlerType = (
  sender: string,
  args: string[]
) => Promise<string>;

// CommandHandlerDecorator defines a type for command handler decorators.
// Command handler methods must return a Promise
export type CommandHandlerDecorator = (
  target: Module,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<CommandHandlerType>
) => void;
