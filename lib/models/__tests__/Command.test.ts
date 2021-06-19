import { setupORM, getORM } from "./setup.test";
import { Command } from "../Command";
import { Timer } from "../embeddables/Timer";
import { StreamStatus } from "../../types/StreamStatus";

beforeAll(async () => {
  return setupORM();
});

afterAll(async () => {
  var orm = await getORM();
  orm.close();
});

describe("./models/Command", () => {
  test("create new command", async () => {
    let orm = await getORM();
    let repository = orm.em.getRepository(Command);
    let command = new Command("test", 1234, "test!");
    await repository.persistAndFlush(command);

    orm.em.clear();
    var mycommand = await repository.findOneOrFail({
      name: command.name,
      channelID: command.channelID,
    });

    expect(mycommand.name).toBe(command.name);
    expect(mycommand.timer).toBeInstanceOf(Timer);
    expect(mycommand.timer.enabled).toBe(false);
    expect(mycommand.attributes.count).toBe(0);
    expect(mycommand.timer.streamStatus).toBe(StreamStatus.ANY);
  });
});
