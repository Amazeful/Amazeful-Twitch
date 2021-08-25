import { Entity, Property, Unique, Enum } from "@mikro-orm/core";
import { BaseModel } from "./BaseModel";
import { Roles } from "../types/Roles";

@Entity()
export class PurgeConfig extends BaseModel {
  @Unique()
  @Property()
  channel!: number;

  @Property()
  enabled: boolean = false;

  @Enum(() => Roles)
  minTarget: Roles = Roles.REGUALR;

  @Property()
  defaultContinuous: boolean = false;

  @Property()
  defaultContinuousTime: number = 60;

  @Property()
  announceResults: boolean = true;
}
