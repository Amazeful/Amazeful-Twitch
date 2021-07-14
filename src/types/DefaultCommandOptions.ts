import { Roles } from "./Roles";
import { CommandHandlerType } from "./Misc";
export interface DefaultCommandOptions {
  name: string;
  minimumRole: Roles;
  role: Roles;
  aliases: string[];
  enabled: boolean;
  handler: CommandHandlerType;
}
