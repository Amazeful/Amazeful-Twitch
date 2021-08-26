import "reflect-metadata";

import { Bot } from "./core/Bot";
import { EnvSchema } from "./validators/EnvSchema";
import * as dotenv from "dotenv";
import { Logger, LogLevel } from "./utils/Logger";
(async () => {
  const result = EnvSchema.validate(dotenv.config().parsed);
  if (result.error) {
    Logger.log(LogLevel.ERROR, result.error.message);
    process.exit();
  } else {
    Object.assign(process.env, result.value);
    const bot = new Bot();
    await bot.init();
  }
})();
