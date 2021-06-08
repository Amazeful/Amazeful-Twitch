import { dbSetUp, getDatabase } from "./db-setup";
import { Channel } from "../src/models/Channel";
import { TriviaCategory } from "../src/types/TriviaCategory";
import { User } from "../src/models/User";
import { ObjectId } from "mongodb";
import { Question } from "../src/models/Question";

var id = 100;

beforeAll(async () => {
  return await dbSetUp();
});

afterAll(async () => {
  var orm = await getDatabase();
  orm.close();
});

describe("User Model", () => {
  test("create new user", async () => {
    var orm = await getDatabase();
    let repository = orm.em.getRepository(User);

    let id = getId();
    let user = new User();
    user.userID = id;
    user.login = "amazeful";
    user.displayName = "Amazeful";
    user.type = "staff";
    user.broadcasterType = "partner";
    user.description = "Just a random text";
    user.profileImageURL = "https://example.com/img.jpg";
    user.offlineImageURL = "https://example.com/img.jpg";
    user.viewCount = 1000;

    await repository.persistAndFlush(user);
    var myUser = await repository.findOne({ userID: id });

    expect(myUser).toStrictEqual(user);
  });

  test("user with primary channel", async () => {
    var orm = await getDatabase();
    let repository = orm.em.getRepository(User);
    let id = getId();

    let user = new User();
    user.userID = id;
    user.login = "amazeful";
    user.displayName = "Amazeful";
    user.type = "staff";
    user.broadcasterType = "partner";
    user.description = "Just a random text";
    user.profileImageURL = "https://example.com/img.jpg";
    user.offlineImageURL = "https://example.com/img.jpg";
    user.viewCount = 1000;

    let channel = new Channel();
    channel.channelID = id;

    user.primaryChannel = channel;

    await repository.persistAndFlush(user);
    var myUser = await repository.findOne({ userID: id });
    let channelRepository = orm.em.getRepository(Channel);

    var myChannel = await channelRepository.findOne({ channelID: id });

    expect(myUser).toStrictEqual(user);
    expect(myUser!.primaryChannel).toStrictEqual(channel);
    expect(myChannel!.owner).toStrictEqual(user);
  });
});

describe("Channel Model", () => {
  test("create new channel", async () => {
    var orm = await getDatabase();
    let repository = orm.em.getRepository(Channel);

    let id = getId();
    let channel = new Channel();
    channel.channelID = id;
    await repository.persistAndFlush(channel);
    var myChannel = await repository.findOne({ channelID: id });

    expect(typeof myChannel!.id).toBe("string");
    expect(myChannel!._id).toBeInstanceOf(ObjectId);
    expect(myChannel!.createdAt).toBeInstanceOf(Date);
    expect(myChannel!.updatedAt).toBeInstanceOf(Date);
    expect(myChannel!.channelID).toBe(id);
    expect(myChannel!.joined).toBe(true);
    expect(myChannel!.live).toBe(false);
    expect(myChannel!.silenced).toBe(false);
    expect(myChannel!.prefix).toBe("!");
    expect(myChannel!.refreshToken).toBeUndefined();
    expect(myChannel!.accessToken).toBeUndefined();
    expect(myChannel!.shard).toBe(1);
  });

  test("channel with managers", async () => {
    var orm = await getDatabase();
    let userRepository = orm.em.getRepository(User);
    let channelRepository = orm.em.getRepository(Channel);
    let channelID = getId();
    let channel = new Channel();
    channel.channelID = channelID;

    let editor1 = new User();
    editor1.userID = getId();
    editor1.login = "amazeful";
    editor1.displayName = "Amazeful";
    editor1.type = "staff";
    editor1.broadcasterType = "partner";
    editor1.description = "Just a random text";
    editor1.profileImageURL = "https://example.com/img.jpg";
    editor1.offlineImageURL = "https://example.com/img.jpg";
    editor1.viewCount = 1000;

    channel.managers.add(editor1);
    channelRepository.persist(channel);

    await channelRepository.persistAndFlush(channel);

    let myChannel = await channelRepository.findOne({ channelID: channelID });
    let myUser = await userRepository.findOne({ userID: editor1.userID });

    expect(myChannel!.managers.getItems()[0]).toStrictEqual(editor1);
    expect(myUser!.manages.getItems()[0]).toStrictEqual(channel);
    expect(true).toBe(true);
  });
});

test("create new question", async () => {
  var orm = await getDatabase();
  let repository = orm.em.getRepository(Question);

  let question = new Question();
  question.question = "What is 2 + 2?";
  question.answer = "4";
  question.category = TriviaCategory.GENERAL;

  await repository.persistAndFlush(question);

  var myQuestion = await repository.findOne({ question: "What is 2 + 2?" });

  expect(myQuestion!.question).toBe("What is 2 + 2?");
  expect(myQuestion!.answer).toBe("4");
  expect(myQuestion!.category).toBe(TriviaCategory.GENERAL);
});

function getId(): number {
  id++;
  return id;
}
