import {
  Entity,
  Property,
  Unique,
  OneToOne,
  Collection,
  ManyToMany,
} from "@mikro-orm/core";
import { BaseModel } from "./BaseModel";
import { User } from "./User";

@Entity()
export class Channel extends BaseModel {
  @Unique()
  @Property()
  channelID!: number;

  @Property()
  language?: string;

  @Property()
  gameID?: string;

  @Property()
  gameName?: string;

  @Property()
  title?: string;

  @Property()
  joined: boolean = true;

  @Property()
  silenced: boolean = false;

  @Property()
  accessToken?: string;

  @Property()
  refreshToken?: string;

  @Property()
  prefix: string = "!";

  @Property()
  live: boolean = false;

  @Property()
  shard: number = 1;

  @Property()
  startedAt?: Date;

  @Property()
  endedAt?: Date;

  @Property()
  moderator: boolean = false;

  @OneToOne({ entity: () => User, mappedBy: "primaryChannel" })
  owner?: User;

  @ManyToMany({ entity: () => User, inversedBy: "manages", nullable: true })
  managers = new Collection<User>(this);
}
