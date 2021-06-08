import { Entity, Enum, Property } from "@mikro-orm/core";
import { TriviaCategory } from "../types/TriviaCategory";
import { BaseModel } from "./BaseEntity";

@Entity()
export class Question extends BaseModel {
  @Property()
  question!: string;

  @Property()
  answer!: string;

  @Enum(() => TriviaCategory)
  category!: TriviaCategory;
}
