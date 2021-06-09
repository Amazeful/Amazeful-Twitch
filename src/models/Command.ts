import { Entity, Enum, Index, Property, Unique } from "@mikro-orm/core";
import { BaseModel } from "./BaseModel";
import { Roles } from "../types/Roles";
import { StreamStatus } from "../types/StreamStatus";

@Entity()
export class Command extends BaseModel {
  @Unique()
  @Property()
  name!: string;

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
}
