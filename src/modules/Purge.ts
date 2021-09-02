import { RegisterModule } from "../decorators/RegisterModule";
import { Channel } from "../models/Channel";
import { Module } from "../types/Module";
import { PrivmsgMessage } from "@aidenhadisi/dank-twitch-irc";
import { RegisterMessageHandler } from "../decorators/RegisterMessageHandler";
import { Valid, Validate } from "@aidenhadisi/joi-decorators";

import { PurgeConfig } from "../models/PurgeConfig";

import { PurgeSchema } from "../validators/PurgeSchema";
import LinkedList from "@aidenhadisi/doublylinkedlist";
import { ValidationError } from "../types/errors/ValidationError";
import { PurgeOptions } from "../types/options/PurgeOptions";
import { PurgeData } from "../types/data/PurgeData";

@RegisterModule()
export class Purge extends Module {
  //A linked list is the best structure for purge since it allows insertation and deletion at both ends in constant time (O(1))
  private messages: LinkedList<PurgeData>;
  private config!: PurgeConfig;
  constructor(channelData: Channel) {
    super(channelData);
    this.messages = new LinkedList();
  }

  /**
   * Initializes the purge module
   */
  public async init(): Promise<void> {
    const repository = this.orm.em.getRepository(PurgeConfig);
    let config = await repository.findOne({
      channel: this.channelData.channelID
    });

    if (!config) {
      config = new PurgeConfig();
      config.channel = this.channelData.channelID;
      await repository.persistAndFlush(config);
    }

    this.config = config;
  }

  @RegisterMessageHandler()
  public async messageHandler(msg: PrivmsgMessage): Promise<void> {
    //Add new messages to the end of list
    this.messages.push({
      id: msg.messageID,
      sender: msg.senderUsername,
      message: msg.messageText,
      timeStamp: new Date().valueOf()
    });
  }

  @Validate()
  public async purge(@Valid(PurgeSchema) options: PurgeOptions): Promise<void> {
    if (!this.config.enabled) {
      throw new ValidationError(
        "Module purge is currently disabled. You must enable the purge module before using this command."
      );
    }
    console.log(options);
  }

  public destroy(): void {
    throw new Error("Method not implemented.");
  }
}
