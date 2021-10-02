import { Entity, Property, Enum } from "@mikro-orm/core";

import { BaseModel } from "./BaseModel";
import { Roles } from "../types/enums/Roles";

@Entity()
export class UserRole extends BaseModel {
  @Property()
  channelID!: number;

  @Property()
  login!: string;

  @Enum(() => Roles)
  role: Roles = Roles.GLOBAL;
}
