import { Entity, Property, Unique } from "@mikro-orm/core";
import { BaseModel } from "./BaseModel";

@Entity()
export class BotData extends BaseModel {
  @Unique()
  @Property()
  shardID!: number;

  @Property()
  accessToken!: string;

  @Property()
  refreshToken!: string;

  @Property()
  expirey?: number;
}
