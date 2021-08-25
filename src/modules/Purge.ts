import { RegisterModule } from "../decorators/RegisterModule";
import { Channel } from "../models/Channel";
import { Module } from "../types/Module";
import { PrivmsgMessage } from "dank-twitch-irc";
import { RegisterMessageHandler } from "../decorators/RegisterMessageHandler";
import { Valid, Validate } from "@aidenhadisi/joi-decorators";

import { PurgeConfig } from "../models/PurgeConfig";
import { PurgeOptions } from "../types/PurgeOptions";
import { ValidationError } from "../types/Errors";

import { PurgeSchema } from "../validators/PurgeSchema";
import LinkedList from "@aidenhadisi/doublylinkedlist";

export interface PurgeMessageData {
  id: string;
  sender: string;
  message: string;
  timeStamp: number; //unix timestamp
}

@RegisterModule()
export class Purge extends Module {
  //A linked list is the best structure for purge since it allows insertation and deletion at both ends in constant time (O(1))
  private messages: LinkedList<PurgeMessageData>;
  private config!: PurgeConfig;
  constructor(channelData: Channel) {
    super(channelData);
    this.messages = new LinkedList();
  }

  protected async init(): Promise<void> {
    var repository = this.orm.em.getRepository(PurgeConfig);
    var config = await repository.findOne({
      channel: this.channelData.channelID,
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
      timeStamp: new Date().valueOf(),
    });
  }

  @Validate()
  public purge(@Valid(PurgeSchema) options: PurgeOptions) {
    if (!this.config.enabled) {
      throw new ValidationError(
        "Module purge is currently disabled. You must enable the purge module before using this command."
      );
    }
    console.log(options);
  }

  protected destroy(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
