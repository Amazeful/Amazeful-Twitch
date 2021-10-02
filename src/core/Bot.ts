import { DebugLogger } from "../decorators/DebugLogger";
import { Logger, LogLevel } from "../utils/Logger";
import { AutoWired } from "../decorators/AutoWired";
import { ChatClient } from "../twitch/ChatClient";
import { ORM } from "../services/ORM";
import { Twitch } from "../twitch/Twitch";
import { Channel } from "../models/Channel";
import { ChannelBot } from "./ChannelBot";
import { TryCatchLog } from "../decorators/TryCatchLog";
import { Admin } from "../services/Admin";

/**
 * Class Bot defines global Twitch bot instance
 */
export class Bot {
  @AutoWired private orm!: ORM;
  @AutoWired private client!: ChatClient;
  @AutoWired private twitch!: Twitch;
  @AutoWired private admin!: Admin;

  private shardID: number;
  private channels: Record<number, ChannelBot>;

  constructor() {
    this.shardID = process.env.SHARD_ID;
    this.channels = {};
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
      await this.admin.init();
      await ChannelBot.populateModuleContainer();
      Logger.log(
        LogLevel.INFO,
        `All services are now running.`,
        `SHARD: ${this.shardID}`
      );

      await this.addChannels();
      Logger.log(LogLevel.INFO, "Added all channels");

      //Send priv messages to the channel handler
      this.client.on("PRIVMSG", (msg) => {
        if (this.channels[+msg.channelID]) {
          this.channels[+msg.channelID].onMessage(msg);
        }
      });
    } catch (e) {
      Logger.log(
        LogLevel.ERROR,
        `Failed to init the global bot object. Shutting down ...: ${e}`
      );
    }
  }

  /**
   * Gets and registers channels
   */
  @TryCatchLog
  public async addChannels(): Promise<void> {
    const channels = await this.getChannels();
    for (const channel of channels) {
      this.initChannel(channel);
    }
  }

  /**
   * Inits a channel by creating channel bot
   * @param channel channel data
   * @returns promise void
   */
  @TryCatchLog
  public async initChannel(channel: Channel): Promise<void> {
    if (this.channels[channel.channelID]) {
      Logger.log(
        LogLevel.WARN,
        "Attempt to reconnect to existing channel blocked."
      );
      return;
    }

    //Join channel here first so if the join fails ChannelBot won't be created
    //In case streamer is banned, etc.
    await this.client.join(channel.login);

    this.channels[channel.channelID] = new ChannelBot(channel);
    try {
      await this.channels[channel.channelID].init();
    } catch (e) {
      this.channels[channel.channelID].destory();
      await this.client.part(channel.login);
      Logger.log(LogLevel.ERROR, `Failed to init channel. ${e}`, channel.login);
    }
  }

  @TryCatchLog
  public async destoryChannel(channelID: number): Promise<void> {
    const channel = this.channels[channelID];
    if (channel) {
      await this.client.part(channel.data.id);
      this.channels[channelID].destory();
      delete this.channels[channelID];
    }
  }

  /**
   * Get channel list for this process
   * @returns List of channels
   */
  private async getChannels(): Promise<Array<Channel>> {
    return this.orm.em.find(Channel, {
      shard: this.shardID,
      joined: true
    });
  }
}
