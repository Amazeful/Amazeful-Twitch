import { DebugLogger } from "../decorators/DebugLogger";
import { Logger, LogLevel } from "../utils/Logger";
import { AutoWired } from "../decorators/AutoWired";
import { ChatClient } from "../twitch/ChatClient";
import { ORM } from "../services/ORM";
import { Twitch } from "../twitch/Twitch";
import { singleton } from "tsyringe";

/**
 * Class Bot defines global Twitch bot instance
 * Serves as an entry point for all channelbots
 * All components are accessable through this class
 */
@singleton()
export class Bot {
  @AutoWired private orm!: ORM;
  @AutoWired private client!: ChatClient;
  @AutoWired private twitch!: Twitch;

  constructor() {}

  /**
   * Initializes the global bot object with all necessary modules
   */
  @DebugLogger
  public async init(): Promise<void> {
    try {
      //ORM always first
      await this.orm.init();
      await this.twitch.init();
      await this.client.connect();

      Logger.log(LogLevel.INFO, "All services are now running");
    } catch (e) {
      Logger.log(
        LogLevel.ERROR,
        `Failed to init the global bot object. Shutting down ...: ${e}`
      );
    }
  }
}
