import { Module } from "../../types/Module";
import { RegisterModule } from "../RegisterModule";
import { CHANNEL_MODULE } from "../../utils/Constants";
import { Channel } from "../../core/Channel";
jest.mock("../../modules/Module.ts");
@RegisterModule()
class TestModule extends Module {
  protected destroy(): void {
    throw new Error("Method not implemented.");
  }
}
describe("./decorators/RegisterModule", () => {
  test("Should add module to Channel class metadata", () => {
    var expected = [TestModule];

    var actual = Reflect.getOwnMetadata(CHANNEL_MODULE, Channel);

    //Use strict equal. No need to check types as they will be converted to module type in Channel class
    expect(actual).toStrictEqual(expected);
  });
});
