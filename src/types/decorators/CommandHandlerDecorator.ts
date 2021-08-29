import { Module } from "../Module";
import { CommandHandler } from "../handlers/CommandHandler";
// CommandHandlerDecorator defines a type for command handler decorators.
// Command handler methods must return a Promise
export type CommandHandlerDecorator = (
  target: Module,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<CommandHandler>
) => void;
