import { AutoWired } from "../decorators/AutoWired";
import { Channel } from "../models/Channel";
import { ChatClient } from "../twitch/ChatClient";
import { Twitch } from "../twitch/Twitch";
import { ORM } from "../services/ORM";
export abstract class Module {
  @AutoWired protected orm!: ORM;
  @AutoWired protected chatClient!: ChatClient;
  @AutoWired protected twitch!: Twitch;

  protected channelData: Channel;

  constructor(channelData: Channel) {
    this.channelData = channelData;
  }

  protected abstract init(): Promise<void>;
  protected abstract destroy(): Promise<void>;
}
