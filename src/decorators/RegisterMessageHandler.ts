import { MESSAGE_HANDLER } from "../utils/Constants";
import { MessageHandlerType } from "../types/Misc";
import { Module } from "../types/Module";

//RegisterMessageHandler registers a module message handler.
export const RegisterMessageHandler =
  (modRequired = false): MessageHandlerDecorator =>
  (target, _, descriptor) => {
    if (!descriptor.value) return;
    const registerOptions: RegisterMessageHandlerOptions = {
      modRequired: modRequired,
      handler: descriptor.value
    };

    Reflect.defineMetadata(MESSAGE_HANDLER, registerOptions, target);
  };

export interface RegisterMessageHandlerOptions {
  modRequired: boolean;
  handler: MessageHandlerType;
}

// MessageHandlerDecorator defines a type for message handler decorators.
// Message handler methods must return a void Promise
export type MessageHandlerDecorator = (
  target: Module,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<MessageHandlerType>
) => void;
