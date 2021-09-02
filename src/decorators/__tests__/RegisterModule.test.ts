import { Channel } from "../../core/Channel";
import { Module } from "../../types/Module";
import { RegisterModule } from "../RegisterModule";
jest.mock("../../types/Module");
@RegisterModule()
class TestModule extends Module {
  public destroy(): void {
    throw new Error("Method not implemented.");
  }
  public init(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
describe("./decorators/RegisterModule", () => {
  test("Should add module to Channel class metadata", () => {
    const expected = [TestModule];

    const actual = Channel.moduleContainer;

    //Use strict equal. No need to check types as they will be converted to module type in Channel class
    expect(actual).toStrictEqual(expected);
  });
});
