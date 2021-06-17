import { setupORM, getORM, getId } from "./setup.test";
import { Channel } from "../Channel";
import { ObjectId } from "mongodb";
import { User } from "../User";

beforeAll(async () => {
  return setupORM();
});

afterAll(async () => {
  var orm = await getORM();
  orm.close();
});

describe("./models/Channel", () => {
  test("create new channel", async () => {
    var orm = await getORM();
    let repository = orm.em.getRepository(Channel);

    let id = getId();
    let channel = new Channel(id);
    await repository.persistAndFlush(channel);
    var myChannel = await repository.findOneOrFail({ channelID: id });

    expect(typeof myChannel.id).toBe("string");
    expect(myChannel._id).toBeInstanceOf(ObjectId);
    expect(myChannel.createdAt).toBeInstanceOf(Date);
    expect(myChannel.updatedAt).toBeInstanceOf(Date);
    expect(myChannel.channelID).toBe(id);
    expect(myChannel.joined).toBe(true);
    expect(myChannel.live).toBe(false);
    expect(myChannel.silenced).toBe(false);
    expect(myChannel.prefix).toBe("!");
    expect(myChannel.refreshToken).toBeUndefined();
    expect(myChannel.accessToken).toBeUndefined();
    expect(myChannel.shard).toBe(1);
  });

  test("create channel with managers", async () => {
    var orm = await getORM();
    let userRepository = orm.em.getRepository(User);
    let channelRepository = orm.em.getRepository(Channel);
    let channelID = getId();
    let channel = new Channel(channelID);
    let editor1 = new User({
      userID: getId(),
      login: "amazeful",
      displayName: "Amazeful",
      type: "staff",
      broadcasterType: "partner",
      description: "just a random text",
      profileImageURL: "https://example.com/img.jpg",
      offlineImageURL: "https://example.com/img.jpg",
      viewCount: 1000,
    });

    channel.managers.add(editor1);
    channelRepository.persist(channel);

    await channelRepository.persistAndFlush(channel);

    let myChannel = await channelRepository.findOneOrFail({
      channelID: channelID,
    });
    let myUser = await userRepository.findOneOrFail({ userID: editor1.userID });

    expect(myChannel.managers.getItems()[0]).toStrictEqual(editor1);
    expect(myUser.manages.getItems()[0]).toStrictEqual(channel);
    expect(true).toBe(true);
  });
});
