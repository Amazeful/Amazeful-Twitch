import { DebugLogger } from "../decorators/DebugLogger";
import { Logger, LogLevel } from "../utils/Logger";
import { AutoWired } from "../decorators/AutoWired";
import { ChatClient } from "../twitch/ChatClient";
import { ORM } from "../services/ORM";
import { Twitch } from "../twitch/Twitch";
/**
 * Class Bot defines global Twitch bot instance
 * Serves as an entry point for all channelbots
 * All components are accessable through this class
 */

export class Bot {
  @AutoWired private orm!: ORM;
  @AutoWired private client!: ChatClient;
  @AutoWired private twitch!: Twitch;

  private shardID: number;
  constructor() {
    this.shardID = process.env.SHARD_ID;
  }

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

      Logger.log(
        LogLevel.INFO,
        `All services are now running.`,
        `SHARD: ${this.shardID}`
      );
    } catch (e) {
      Logger.log(
        LogLevel.ERROR,
        `Failed to init the global bot object. Shutting down ...: ${e}`
      );
    }
  }
}
