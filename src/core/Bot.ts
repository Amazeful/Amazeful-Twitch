import { DebugLogger } from "../decorators/DebugLogger";
import { Agenda } from "agenda";
import { Logger, LogLevel } from "../utils/Logger";
import { Channel } from "./ChannelBot";
import { AutoWired } from "../decorators/AutoWired";
import { ChatClient } from "../twitch/ChatClient";
/**
 * Class Bot defines global Twitch bot instance
 * Serves as an entry point for all channelbots
 * All components are accessable through this class
 */

export class Bot {
  private readonly _agenda: Agenda;
  @AutoWired private readonly _client!: ChatClient;
  private _channelBots: Map<number, Channel>;

  constructor() {
    this._agenda = new Agenda();
    this._channelBots = new Map();
  }

  /**
   * Initializes the global bot object with all necessary modules
   */
  @DebugLogger
  public async init() {
    try {
      await this._agenda.start();
      await this._client.connect();
    } catch (e) {
      Logger.log(
        LogLevel.ERROR,
        `Failed to init the global bot object. Shutting down ...: ${e}`
      );
      process.exit();
    }
  }
}
