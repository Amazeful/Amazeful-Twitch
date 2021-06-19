import { DebugLogger } from "../decorators/DebugLogger";
import { ChatClient } from "../twitch/Client";
import { TwitchData } from "../types/TwitchAuth";

/**
 * Class Bot defines global Twitch bot object
 * Serves as an entry point for all modules
 * All components are accessable through this class
 */
export class Bot {
  private _twitchData: TwitchData;
  private _chatClient: ChatClient;

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
  }

  /**
   * Initializes the global bot object with all necessary modules
   */
  @DebugLogger
  public async init() {
    await this._chatClient.connect();
  }
}
