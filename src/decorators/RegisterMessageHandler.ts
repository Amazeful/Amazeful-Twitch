import { MESSAGE_HANDLER } from "../utils/Constants";
import { MessageHandlerDecorator } from "../types/decorators/MessageHandlerDecorator";
import { RegisterMessageHandlerOptions } from "../types/options/RegisterMessageHandlerOptions";

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
