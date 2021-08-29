import { Entity, Enum, Property } from "@mikro-orm/core";
import { BaseModel } from "./BaseModel";
import { TriviaCategory } from "../types/enums/TriviaCategory";

@Entity()
export class Question extends BaseModel {
  @Property()
  question!: string;

  @Property()
  answer!: string;

  @Enum(() => TriviaCategory)
  category!: TriviaCategory;

  constructor(question: string, answer: string, category: TriviaCategory) {
    super();
    this.question = question;
    this.answer = answer;
    this.category = category;
  }
}
