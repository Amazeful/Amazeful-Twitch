import { Entity, Property } from "@mikro-orm/core";

import { BaseModel } from "./BaseModel";

import { PurgeOptions } from "../types/options/PurgeOptions";
import { PurgeData } from "../types/data/PurgeData";

@Entity()
export class PurgeResults extends BaseModel {
  //Will make a suquence model to use for this to get auto-incremented id
  // @Property()
  // @Unique()
  // purgeId!: number;

  @Property()
  lookbackTime!: number;

  @Property()
  timeoutDuration!: number | string;

  @Property()
  pattern!: string;

  @Property()
  regex!: boolean;

  @Property()
  caseSensitive!: boolean;

  @Property()
  modName!: string;

  @Property()
  continuous!: boolean;

  @Property()
  continuousTime!: number;

  @Property()
  matches!: PurgeData[];

  constructor(options: PurgeOptions, matches: PurgeData[]) {
    super();
    this.lookbackTime = options.lookbackTime;
    this.timeoutDuration = options.timeoutDuration;
    this.pattern = options.pattern;
    this.regex = options.regex;
    this.caseSensitive = options.caseSensitive;
    this.modName = options.modName;
    this.continuous = options.continuous;
    this.continuousTime = options.continuousTime;
    this.matches = matches;
  }
}
