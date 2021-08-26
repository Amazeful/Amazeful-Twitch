import { singleton } from "tsyringe";
import { AutoWired } from "../AutoWired";
@singleton()
class TestSingelton {
  public actual = "test1234";
}

class TestClass {
  @AutoWired public testSingleton!: TestSingelton;
}
describe("./decorators/AutoWired", () => {
  test("Should inject singleton into class", () => {
    const expected = "test1234";

    const testClass = new TestClass();

    expect(testClass.testSingleton.actual).toStrictEqual(expected);
  });
});
