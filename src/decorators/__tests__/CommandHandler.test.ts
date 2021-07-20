import { RegisterCommand } from "../RegisterCommand";
import { Module } from "../../modules/Module";
import { COMMAND_HANDLER } from "../../utils/Constants";
import { DefaultCommandOptions } from "../../types/DefaultCommandOptions";
import { Roles } from "../../types/Roles";

jest.mock("../../modules/Module");
describe("./decorators/CommandHandler", () => {
  test("should add correct meta data to module", async () => {
    class Test extends Module {
      private testString = "This is a test";
      protected destroy(): void {
        throw new Error("Method not implemented.");
      }
      @RegisterCommand({})
      public async test(sender: string, args: string[]): Promise<string> {
        return this.testString;
      }
    }
    var test = new Test(123);

    var commands: Array<DefaultCommandOptions> = Reflect.getMetadata(
      COMMAND_HANDLER,
      test
    );

    let firstCom = commands[0];

    var result = await firstCom.handler.bind(test)("amazeful", []);

    expect(result).toBe("This is a test");
    expect(firstCom.name).toBe("test test");
    expect(firstCom.aliases).toEqual([]);
    expect(firstCom.enabled).toBe(true);
    expect(firstCom.minimumRole).toBe(Roles.GLOBAL);
    expect(firstCom.minimumRole).toBe(Roles.GLOBAL);
  });
});