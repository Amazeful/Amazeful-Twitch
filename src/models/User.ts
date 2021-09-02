import {
  Entity,
  ManyToMany,
  OneToOne,
  Property,
  Unique,
  Collection
} from "@mikro-orm/core";
import { BaseModel } from "./BaseModel";
import { Channel } from "./Channel";

@Entity()
export class User extends BaseModel {
  @Unique()
  @Property()
  userID!: number;

  @Property()
  login!: string;

  @Property()
  displayName!: string;

  @Property()
  type!: string;

  @Property()
  broadcasterType!: string;

  @Property()
  description?: string;

  @Property()
  profileImageURL!: string;

  @Property()
  offlineImageURL!: string;

  @Property()
  viewCount!: number;

  @Property()
  suspended = false;

  @Property()
  admin = false;

  @OneToOne({
    entity: () => Channel,
    inversedBy: "owner",
    orphanRemoval: true,
    nullable: true
  })
  primaryChannel?: Channel;

  @ManyToMany({ entity: () => Channel, mappedBy: "managers" })
  manages = new Collection<Channel>(this);
}
