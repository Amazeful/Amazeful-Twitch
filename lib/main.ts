import { ClientConfiguration } from "dank-twitch-irc";
import { Bot } from "./core/Bot";
import { EnvSchema } from "./validators/schemas/EnvSchema";
import * as dotenv from "dotenv";
import { Logger, LogLevel } from "./utils/Logger";
import { TwitchData } from "./types/TwitchAuth";

(async () => {
  var result = EnvSchema.validate(dotenv.config());
  if (result.error) {
    Logger.log(LogLevel.ERROR, result.error.message);
    process.exit();
  } else {
    Object.assign(process.env, result.value);
    let twitchData: TwitchData = {
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      botStatus: process.env.BOTSTATUS,
      clientID: "",
      clientSecret: "",
      accessToken: "",
      refreshToken: "",
    };
    globalThis.bot = new Bot(twitchData);
    await bot.init();
  }
})();
