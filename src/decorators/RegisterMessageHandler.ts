import { MessageHandlerDecorator } from "../types/Decorators";
import { MESSAGE_HANDLER } from "../utils/Constants";

//RegisterMessageHandler registers a module message handler.
export const RegisterMessageHandler =
  (): MessageHandlerDecorator => (target, properyKey, descriptor) => {
    Reflect.defineMetadata(MESSAGE_HANDLER, descriptor.value, target);
  };
