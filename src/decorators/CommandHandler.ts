import { CommandHandlerDecorator } from "../types/Misc";
import { COMMAND_HANDLER } from "../utils/Constants";
export const CommandHandler =
  (): CommandHandlerDecorator => (target, properyKey, descriptor) => {
    Reflect.defineMetadata(COMMAND_HANDLER, descriptor.value, target);
  };
