import { setupORM, getORM } from "./setup.test";
import { Question } from "../Question";
import { TriviaCategory } from "../../types/TriviaCategory";
beforeAll(async () => {
  return setupORM();
});

afterAll(async () => {
  var orm = await getORM();
  orm.close();
});

describe("./models/Question", () => {
  test("create new question", async () => {
    var orm = await getORM();
    let repository = orm.em.getRepository(Question);

    let question = new Question("What is 2 + 2?", "4", TriviaCategory.GENERAL);

    await repository.persistAndFlush(question);

    orm.em.clear();
    var myQuestion = await repository.findOneOrFail({
      question: "What is 2 + 2?",
    });

    expect(myQuestion.question).toBe("What is 2 + 2?");
    expect(myQuestion.answer).toBe("4");
    expect(myQuestion.category).toBe(TriviaCategory.GENERAL);
  });
});
