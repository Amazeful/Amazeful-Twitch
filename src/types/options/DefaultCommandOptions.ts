import { CommandHandler } from "../handlers/CommandHandler";
import { Roles } from "../enums/Roles";

export interface DefaultCommandOptions {
  name: string;
  minimumRole: Roles;
  role: Roles;
  aliases: string[];
  enabled: boolean;
  handler: CommandHandler;
}
