import { COMMAND_HANDLER } from "../utils/Constants";
import { DefaultCommandOptions } from "../types/options/DefaultCommandOptions";
import { CommandHandlerDecorator } from "../types/decorators/CommandHandlerDecorator";
import { Roles } from "../types/enums/Roles";

//RegisterCommand registers a module command.
//This is only used for default commands
export const RegisterCommand =
  (options: Partial<DefaultCommandOptions>): CommandHandlerDecorator =>
  (target, properyKey, descriptor) => {
    if (!descriptor.value) return;
    options.name =
      options.name ?? `${target.constructor.name} ${properyKey}`.toLowerCase();
    options.handler = descriptor.value;
    options.minimumRole = options.minimumRole ?? Roles.GLOBAL;
    options.role = options.role ?? Roles.GLOBAL;
    options.aliases = options.aliases ?? [];
    options.enabled = options.enabled === false ? false : true;
    const existingCommands = Reflect.getMetadata(COMMAND_HANDLER, target) || [];
    existingCommands.push(options);
    Reflect.defineMetadata(COMMAND_HANDLER, existingCommands, target);
  };
