import {
  Entity,
  ManyToMany,
  OneToOne,
  Property,
  Unique,
  Collection,
} from "@mikro-orm/core";
import { BaseModel } from "./BaseModel";
import { Channel } from "./Channel";

export interface UserDetails {
  userID: number;
  login: string;
  displayName: string;
  type: string;
  broadcasterType: string;
  description: string;
  profileImageURL: string;
  offlineImageURL: string;
  viewCount: number;
}

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
  type: string;

  @Property()
  broadcasterType: string;

  @Property()
  description?: string;

  @Property()
  profileImageURL!: string;

  @Property()
  offlineImageURL!: string;

  @Property()
  viewCount!: number;

  @Property()
  suspended: boolean = false;

  @OneToOne({
    entity: () => Channel,
    inversedBy: "owner",
    orphanRemoval: true,
    nullable: true,
  })
  primaryChannel?: Channel;

  @ManyToMany({ entity: () => Channel, mappedBy: "managers" })
  manages = new Collection<Channel>(this);

  constructor(userDetails: UserDetails) {
    super();

    this.userID = userDetails.userID;
    this.login = userDetails.login;
    this.displayName = userDetails.displayName;
    this.type = userDetails.type;
    this.broadcasterType = userDetails.broadcasterType;
    this.description = userDetails.description;
    this.profileImageURL = userDetails.profileImageURL;
    this.offlineImageURL = userDetails.offlineImageURL;
    this.viewCount = userDetails.viewCount;
  }

  public testFunc() {
    return 1000;
  }
}
