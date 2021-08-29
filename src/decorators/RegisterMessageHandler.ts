import { MESSAGE_HANDLER } from "../utils/Constants";
import { MessageHandlerDecorator } from "../types/decorators/MessageHandlerDecorator";
import { MessageHandler } from "../types/handlers/MessageHandler";

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
  handler: MessageHandler;
}
