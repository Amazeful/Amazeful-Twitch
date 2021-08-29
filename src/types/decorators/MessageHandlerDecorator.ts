import { MessageHandler } from "../handlers/MessageHandler";
import { Module } from "../Module";
// MessageHandlerDecorator defines a type for message handler decorators.
// Message handler methods must return a void Promise
export type MessageHandlerDecorator = (
  target: Module,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<MessageHandler>
) => void;
