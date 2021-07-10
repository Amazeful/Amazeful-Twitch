import { AutoWired } from "../decorators/AutoWired";
import { ChatClient } from "../twitch/ChatClient";
export abstract class Module {
  protected channelId: number;
  @AutoWired protected readonly chatClient!: ChatClient;

  constructor(channelId: number) {
    this.channelId = channelId;
  }

  protected abstract destroy(): void;
}
