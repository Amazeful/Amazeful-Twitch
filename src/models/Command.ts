import {
  ArrayType,
  Embedded,
  Entity,
  Enum,
  Property,
  Unique,
} from "@mikro-orm/core";
import { BaseModel } from "./BaseModel";
import { Roles } from "../types/Roles";
import { StreamStatus } from "../types/StreamStatus";
import { Timer } from "./embeddables/Timer";
import { CommandAttributes } from "./embeddables/CommandAttributes";

@Entity()
@Unique({ properties: ["name", "channel"] })
export class Command extends BaseModel {
  @Property()
  name!: string;

  @Property()
  channel!: number;

  @Property()
  enabled: boolean = true;

  @Property()
  cooldown: number = 5;

  @Property()
  userCooldown: number = 15;

  @Enum(() => Roles)
  role: Roles = Roles.GLOBAL;

  @Enum(() => StreamStatus)
  streamStatus: StreamStatus = StreamStatus.ANY;

  @Property()
  response!: string;

  @Property({ type: ArrayType })
  aliases: string[] = [];

  @Property()
  hasVars: boolean = false;

  @Embedded({ entity: () => Timer })
  timer: Timer = new Timer();

  @Embedded({ entity: () => CommandAttributes })
  attributes: CommandAttributes = new CommandAttributes();
}
