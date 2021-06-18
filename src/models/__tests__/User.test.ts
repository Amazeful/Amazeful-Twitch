import { setupORM, getORM, getId } from "./setup.test";
import { User } from "../User";
import { Channel } from "../Channel";
import { Collection } from "@mikro-orm/core";
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
    orm.em.clear();
    var myUser = await repository.findOneOrFail({ userID: id });
    expect(myUser.broadcasterType).toBe(user.broadcasterType);
    expect(myUser.createdAt).toBeInstanceOf(Date);
    expect(myUser.description).toBe(user.description);
    expect(myUser.displayName).toBe(user.displayName);
    expect(myUser.id).toBe(user.id);
    expect(myUser.login).toBe(user.login);
    expect(myUser.manages.isInitialized()).toBe(false);
    expect(myUser.offlineImageURL).toBe(user.offlineImageURL);
    expect(myUser.profileImageURL).toBe(user.profileImageURL);
    expect(myUser.primaryChannel).toBe(undefined);
    expect(myUser.suspended).toBe(false);
    expect(myUser.type).toBe(user.type);
    expect(myUser.updatedAt).toBeInstanceOf(Date);
    expect(myUser.userID).toBe(user.userID);
    expect(myUser.viewCount).toBe(user.viewCount);

    await myUser.manages.init();
    expect(myUser.manages).toStrictEqual(user.manages);
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
    orm.em.clear();

    var myUser = await repository.findOneOrFail({ userID: id }, [
      "primaryChannel",
    ]);

    expect(myUser.primaryChannel!.channelID).toStrictEqual(
      user.primaryChannel.channelID
    );
  });
});
