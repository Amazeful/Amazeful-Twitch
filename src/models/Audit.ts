import { Entity, Enum, Index, Property } from "@mikro-orm/core";
import { BaseModel } from "./BaseModel";
import { Roles } from "../types/Roles";
import { AuditLogCategory } from "../types/AuditLogCategory";
import { AudtiLogAction } from "../types/AuditLogAction";

@Entity()
@Index({ properties: ["createdAt"], options: { expireAfterSeconds: 864000 } })
export class Audit extends BaseModel {
  @Property()
  action!: AudtiLogAction;

  @Enum(() => AuditLogCategory)
  category!: AuditLogCategory;

  @Property()
  message!: string;

  @Enum(() => Roles)
  userLevel!: Roles;

  @Property()
  username!: string;

  constructor(
    category: AuditLogCategory,
    action: AudtiLogAction,
    message: string,
    userLevel: Roles,
    username: string
  ) {
    super();

    this.category = category;
    this.action = action;
    this.message = message;
    this.username = username;
    this.userLevel = userLevel;
  }
}
