import { EntityName, AnyEntity } from "@mikro-orm/core";
import { Roles } from "./Roles";
import { CommandHandlerType } from "./Misc";
//Options to set a cache key
export interface CacheSetOptions {
  key: string;
  value: string;
  expiry: number;
}

//Cacheable decorator options
export interface CacheableOptions {
  expiry: number;
  key?: string;
  entity?: EntityName<AnyEntity>;
}

export interface DefaultCommandOptions {
  name: string;
  minimumRole: Roles;
  role: Roles;
  aliases: string[];
  enabled: boolean;
  handler: CommandHandlerType;
}

//Purge options to init a purge action
export interface PurgeOptions {
  lookbackTime: number; //Lookback time in seconds
  timeoutDuration: number | string;
  phrase: string; //phrase to ban
  regex: boolean; //Phrase is a regex?
  modName: string; //name of the mod calling the command
  continuous: boolean; //continue timing out this phrase
  continuousTime: number; //time to continue
}
