import { MESSAGE_HANDLER } from "../utils/Constants";
import { MessageHandlerType } from "../types/Misc";
import { MessageHandlerDecorator } from "../types/Decorators";

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
