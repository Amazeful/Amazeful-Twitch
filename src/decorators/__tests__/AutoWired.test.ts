import { singleton } from "tsyringe";
import { AutoWired } from "../AutoWired";
@singleton()
class TestSingelton {
  public actual: string = "test1234";
}

class TestClass {
  @AutoWired public testSingleton!: TestSingelton;
}
describe("./decorators/AutoWired", () => {
  test("Should inject singleton into class", () => {
    var expected = "test1234";

    var testClass = new TestClass();

    expect(testClass.testSingleton.actual).toStrictEqual(expected);
  });
});
