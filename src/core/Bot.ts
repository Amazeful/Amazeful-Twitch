import { DebugLogger } from "../decorators/DebugLogger";
import { Logger, LogLevel } from "../utils/Logger";
import { Channel } from "./ChannelBot";
import { AutoWired } from "../decorators/AutoWired";
import { ChatClient } from "../twitch/ChatClient";
import { Agenda } from "../services/Agenda";
import { ORM } from "../services/ORM";

/**
 * Class Bot defines global Twitch bot instance
 * Serves as an entry point for all channelbots
 * All components are accessable through this class
 */
export class Bot {
  @AutoWired private readonly _orm!: ORM;
  @AutoWired private readonly _agenda!: Agenda;
  @AutoWired private readonly _client!: ChatClient;
  private _channelBots: Map<number, Channel>;

  constructor() {
    this._channelBots = new Map();
  }

  /**
   * Initializes the global bot object with all necessary modules
   */
  @DebugLogger
  public async init() {
    try {
      await this._orm.connect();
      await this._agenda.start();
      await this._client.connect();
    } catch (e) {
      Logger.log(
        LogLevel.ERROR,
        `Failed to init the global bot object. Shutting down ...: ${e}`
      );
    }
  }
}
