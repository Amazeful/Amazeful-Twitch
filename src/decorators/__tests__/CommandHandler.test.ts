import { RegisterCommand } from "../RegisterCommand";
import { Module } from "../../types/Module";
import { COMMAND_HANDLER } from "../../utils/Constants";
import { Channel } from "../../models/Channel";
import { DefaultCommandOptions } from "../../types/options/DefaultCommandOptions";
import { Roles } from "../../types/enums/Roles";

describe("./decorators/CommandHandler", () => {
  test("should add correct meta data to module", async () => {
    class Test extends Module {
      public init(): Promise<void> {
        throw new Error("Method not implemented.");
      }
      private testString = "This is a test";
      public destroy(): void {
        throw new Error("Method not implemented.");
      }
      @RegisterCommand({})
      public async test(_: string, _1: string[]): Promise<string> {
        return this.testString;
      }
    }
    const test = new Test(new Channel());
    const commands: Array<DefaultCommandOptions> = Reflect.getMetadata(
      COMMAND_HANDLER,
      test
    );
    const firstCom = commands[0];
    const result = await firstCom.handler.bind(test)("amazeful", []);
    expect(result).toBe("This is a test");
    expect(firstCom.name).toBe("test test");
    expect(firstCom.aliases).toEqual([]);
    expect(firstCom.enabled).toBe(true);
    expect(firstCom.minimumRole).toBe(Roles.GLOBAL);
    expect(firstCom.minimumRole).toBe(Roles.GLOBAL);
  });
});
