import {
  CommandHandlerType,
  VariableResolverType,
  MessageHandlerType
} from "./Misc";
import { Module } from "./Module";
//Defines a type for Cacheable method decorators.
//Cacheable methods must return a Promise
export type CacheableMethodDecorator = <T>(
  target: Object,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<T>>
) => void;

// CommandHandlerDecorator defines a type for command handler decorators.
// Command handler methods must return a Promise
export type CommandHandlerDecorator = (
  target: Module,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<CommandHandlerType>
) => void;

// VariableResolverDecorator defines a type for custom variable resolver method decorator
// Variable resolver method must be an async function that returns a string
export type VariableResolverDecorator = (
  target: Module,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<VariableResolverType>
) => void;

// MessageHandlerDecorator defines a type for message handler decorators.
// Message handler methods must return a void Promise
export type MessageHandlerDecorator = (
  target: Module,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<MessageHandlerType>
) => void;
