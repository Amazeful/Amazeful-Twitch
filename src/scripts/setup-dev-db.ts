import { ORM } from "../services/ORM";
import { User } from "../models/User";
import { Channel } from "../models/Channel";

(async () => {
  const orm = new ORM();
  try {
    await orm.init();
    console.log("ORM ready.");
    const user = orm.em.create(User, {
      userID: 138760387,
      login: "amazeful",
      displayName: "Amazeful",
      profileImageURL: "test.png",
      offlineImageURL: "test.png",
      viewCount: 1000
    });

    console.log("Created user: ");
    console.log(user);

    const channel = orm.em.create(Channel, {
      channelID: 138760387,
      login: "amazeful",
      displayName: "Amazeful",
      language: "en"
    });

    console.log("Created channel: ");
    console.log(channel);

    user.primaryChannel = channel;

    console.log("updated user primary channel");

    await orm.em.persistAndFlush([user, channel]);

    console.log("Flushed data to the db");
  } catch (e) {
    console.log("ERROR: Failed");
    console.log(e);
  } finally {
    await orm.close();
  }
})();
