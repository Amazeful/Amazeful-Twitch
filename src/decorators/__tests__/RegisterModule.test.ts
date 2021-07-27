import { Channel } from "../../core/Channel";
import { Module } from "../../types/Module";
import { RegisterModule } from "../RegisterModule";
jest.mock("../../types/Module");
@RegisterModule()
class TestModule extends Module {
  protected destroy(): void {
    throw new Error("Method not implemented.");
  }
}
describe("./decorators/RegisterModule", () => {
  test("Should add module to Channel class metadata", () => {
    var expected = [TestModule];

    var actual = Channel.moduleContainer;

    //Use strict equal. No need to check types as they will be converted to module type in Channel class
    expect(actual).toStrictEqual(expected);
  });
});
