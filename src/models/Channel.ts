import {
  Entity,
  Property,
  Unique,
  OneToOne,
  Collection,
  ManyToMany
} from "@mikro-orm/core";
import { BaseModel } from "./BaseModel";
import { User } from "./User";

@Entity()
export class Channel extends BaseModel {
  @Unique()
  @Property()
  channelID!: number;

  @Property()
  login!: string;

  @Property()
  displayName!: string;

  @Property()
  language?: string;

  @Property()
  gameID?: string;

  @Property()
  gameName?: string;

  @Property()
  title?: string;

  @Property()
  joined = true;

  @Property()
  silenced = false;

  @Property()
  accessToken?: string;

  @Property()
  refreshToken?: string;

  @Property()
  prefix = "!";

  @Property()
  live = false;

  @Property()
  shard = 1;

  @Property()
  startedAt?: Date;

  @Property()
  endedAt?: Date;

  @Property()
  moderator = false;

  @OneToOne({ entity: () => User, mappedBy: "primaryChannel" })
  owner?: User;

  @ManyToMany({ entity: () => User, inversedBy: "manages", nullable: true })
  managers = new Collection<User>(this);
}
