import { AutoWired } from "../decorators/AutoWired";
import { Channel } from "../models/Channel";
import { ChatClient } from "../twitch/ChatClient";
export abstract class Module {
  @AutoWired protected chatClient!: ChatClient;

  protected readonly channelData: Channel;

  constructor(channelData: Channel) {
    this.channelData = channelData;
  }

  protected abstract destroy(): void;
}
