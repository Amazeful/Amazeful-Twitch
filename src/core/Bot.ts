import { DebugLogger } from "../decorators/DebugLogger";
import { Logger, LogLevel } from "../utils/Logger";
import { Channel } from "./Channel";
import { AutoWired } from "../decorators/AutoWired";
import { ChatClient } from "../twitch/ChatClient";
import { Agenda } from "../services/Agenda";
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
  @AutoWired private agenda!: Agenda;
  @AutoWired private client!: ChatClient;
  @AutoWired private twitch!: Twitch;
  private channelBots: Map<number, Channel>;

  constructor() {
    this.channelBots = new Map();
  }

  /**
   * Initializes the global bot object with all necessary modules
   */
  @DebugLogger
  public async init() {
    try {
      console.log(process.env);
      //ORM always first
      await this.orm.init();

      await this.twitch.init();

      await this.client.connect();

      let channel = new Channel();
      await channel.init();
    } catch (e) {
      Logger.log(
        LogLevel.ERROR,
        `Failed to init the global bot object. Shutting down ...: ${e}`
      );
    }
  }
}
