import { setupORM, getORM, getId } from "./setup.test";
import { User } from "../User";
import { Channel } from "../Channel";
beforeAll(async () => {
  return setupORM();
});

afterAll(async () => {
  var orm = await getORM();
  orm.close();
});

describe("./models/User", () => {
  test("create new user", async () => {
    var orm = await getORM();
    let repository = orm.em.getRepository(User);

    let id = getId();
    let user = new User({
      userID: id,
      login: "amazeful",
      displayName: "Amazeful",
      type: "staff",
      broadcasterType: "partner",
      description: "just a random text",
      profileImageURL: "https://example.com/img.jpg",
      offlineImageURL: "https://example.com/img.jpg",
      viewCount: 1000,
    });

    await repository.persistAndFlush(user);
    var myUser = await repository.findOne({ userID: id });

    expect(myUser).toStrictEqual(user);
  });

  test("create user with primary channel", async () => {
    var orm = await getORM();
    let repository = orm.em.getRepository(User);
    let id = getId();

    let user = new User({
      userID: id,
      login: "amazeful",
      displayName: "Amazeful",
      type: "staff",
      broadcasterType: "partner",
      description: "just a random text",
      profileImageURL: "https://example.com/img.jpg",
      offlineImageURL: "https://example.com/img.jpg",
      viewCount: 1000,
    });

    let channel = new Channel(id);

    user.primaryChannel = channel;

    await repository.persistAndFlush(user);
    var myUser = await repository.findOneOrFail({ userID: id });
    let channelRepository = orm.em.getRepository(Channel);

    var myChannel = await channelRepository.findOneOrFail({ channelID: id });

    expect(myUser).toStrictEqual(user);
    expect(myUser.primaryChannel).toStrictEqual(channel);
    expect(myChannel.owner).toStrictEqual(user);
  });
});
