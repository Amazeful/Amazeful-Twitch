//This file is used to set up the load balancer and other capabilities
//that are shared among child processes. The main entry point for the bot is main.ts
import "reflect-metadata";

import { Bot } from "./core/Bot";
import { EnvSchema } from "./validators/EnvSchema";
import * as dotenv from "dotenv";
import { Logger, LogLevel } from "./utils/Logger";
(async () => {
  var result = EnvSchema.validate(dotenv.config().parsed);
  if (result.error) {
    Logger.log(LogLevel.ERROR, result.error.message);
    process.exit();
  } else {
    Object.assign(process.env, result.value);
    var bot = new Bot();
    await bot.init();
  }
})();
