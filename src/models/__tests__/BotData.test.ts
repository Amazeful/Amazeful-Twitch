import { getORM, setupORM } from "../../jest.setup";
import { BotData } from "../BotData";

beforeAll(async () => {
  return setupORM();
});

afterAll(async () => {
  var orm = await getORM();
  orm.close();
});

describe("./models/BotData", () => {
  test("should create a new BotData record", async () => {
    let orm = await getORM();
    let repository = orm.em.getRepository(BotData);

    let botData = new BotData();
    botData.accessToken = "1111";
    botData.refreshToken = "2222";
    botData.shardID = 1;

    await repository.persistAndFlush(botData);

    // let myData = await repository.findOneOrFail({ shardID: 1 });

    // expect(myData.accessToken).toBe("1111");
    // expect(myData.refreshToken).toBe("2222");
  });
});
