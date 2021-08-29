import { Entity, Property, Unique, Enum } from "@mikro-orm/core";
import { BaseModel } from "./BaseModel";
import { Roles } from "../types/enums/Roles";

@Entity()
export class PurgeConfig extends BaseModel {
  @Unique()
  @Property()
  channel!: number;

  @Property()
  enabled = false;

  @Enum(() => Roles)
  minTarget: Roles = Roles.REGUALR;

  @Property()
  defaultContinuous = false;

  @Property()
  defaultContinuousTime = 60;

  @Property()
  announceResults = true;
}
