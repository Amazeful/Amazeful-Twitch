import {
  ArrayType,
  Embedded,
  Entity,
  Enum,
  Property,
  Unique
} from "@mikro-orm/core";
import { BaseModel } from "./BaseModel";
import { Timer } from "./embeddables/Timer";
import { CommandAttributes } from "./embeddables/CommandAttributes";
import { Roles } from "../types/enums/Roles";
import { StreamStatus } from "../types/enums/StreamStatus";

@Entity()
@Unique({ properties: ["name", "channel"] })
export class Command extends BaseModel {
  @Property()
  name!: string;

  @Property()
  channel!: number;

  @Property()
  enabled = true;

  @Property()
  cooldown = 5;

  @Property()
  userCooldown = 15;

  @Enum(() => Roles)
  role: Roles = Roles.GLOBAL;

  @Enum(() => StreamStatus)
  streamStatus: StreamStatus = StreamStatus.ANY;

  @Property()
  response!: string;

  @Property({ type: ArrayType })
  aliases: string[] = [];

  @Property()
  hasVars = false;

  @Embedded({ entity: () => Timer })
  timer: Timer = new Timer();

  @Embedded({ entity: () => CommandAttributes })
  attributes: CommandAttributes = new CommandAttributes();
}
