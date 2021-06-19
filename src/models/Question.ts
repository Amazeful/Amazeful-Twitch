import { Entity, Enum, Property } from "@mikro-orm/core";
import { TriviaCategory } from "../types/TriviaCategory";
import { BaseModel } from "./BaseModel";

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
