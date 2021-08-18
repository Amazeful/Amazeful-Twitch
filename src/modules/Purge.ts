import { RegisterModule } from "../decorators/RegisterModule";
import { Channel } from "../models/Channel";
import { Module } from "../types/Module";
import { PrivmsgMessage } from "dank-twitch-irc";
import { RegisterMessageHandler } from "../decorators/RegisterMessageHandler";

export interface PurgeMessageData {
  id: string;
  sender: string;
  message: string;
  timeStamp: number;
}

@RegisterModule()
export class Purge extends Module {
  private messages: PurgeMessageData[];
  constructor(channelData: Channel) {
    super(channelData);
    this.messages = [];
  }

  @RegisterMessageHandler()
  public async messageHandler(msg: PrivmsgMessage): Promise<void> {
    this.messages.push({
      id: msg.messageID,
      sender: msg.senderUsername,
      message: msg.messageText,
      timeStamp: new Date().valueOf(),
    });
  }

  protected init(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  protected destroy(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
