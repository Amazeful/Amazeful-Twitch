import { RegisterModule } from "../decorators/RegisterModule";
import { Channel } from "../models/Channel";
import { Module } from "../types/Module";
import { PrivmsgMessage } from "dank-twitch-irc";
import { RegisterMessageHandler } from "../decorators/RegisterMessageHandler";
import { LinkedList } from "../data_structures/LinkedList";

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
  constructor(channelData: Channel) {
    super(channelData);
    this.messages = new LinkedList();
  }

  protected init(): Promise<void> {
    throw new Error("Method not implemented.");
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

  protected destroy(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
