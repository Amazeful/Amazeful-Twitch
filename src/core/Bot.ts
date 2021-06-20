import { DebugLogger } from "../decorators/DebugLogger";
import { ChatClient } from "../twitch/Client";
import { TwitchData } from "../types/TwitchAuth";
import { Agenda } from "agenda";
import { ChannelBot } from "./ChannelBot";
import { Logger, LogLevel } from "../utils/Logger";

/**
 * Class Bot defines global Twitch bot object
 * Serves as an entry point for all modules
 * All components are accessable through this class
 */
export class Bot {
  private _twitchData: TwitchData;
  private readonly _chatClient: ChatClient;
  private readonly _agenda: Agenda;
  private _channelBots: Map<number, ChannelBot>;

  constructor(twitchData: TwitchData) {
    this._twitchData = twitchData;
    this._chatClient = new ChatClient({
      username: this._twitchData.username,
      password: this._twitchData.password,
      rateLimits: this._twitchData.botStatus,
      installDefaultMixins: true,
      maxChannelCountPerConnection: 200,
      connectionRateLimits: {
        parallelConnections: 100,
        releaseTime: 2000,
      },
    });

    this._agenda = new Agenda();
    this._channelBots = new Map();
  }

  /**
   * Initializes the global bot object with all necessary modules
   */
  @DebugLogger
  public async init() {
    try {
      await this._chatClient.connect();
      await this._agenda.start();
    } catch (e) {
      Logger.log(
        LogLevel.ERROR,
        `Failed to init the global bot object. Shutting down ...`
      );
      process.exit();
    }
  }

  get client() {
    return this._chatClient;
  }

  get twitchData() {
    return this._twitchData;
  }
}
