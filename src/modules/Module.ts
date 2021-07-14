import { AutoWired } from "../decorators/AutoWired";
import { ChatClient } from "../twitch/ChatClient";
import { DefaultCommandOptions } from "../types/DefaultCommandOptions";
import { COMMAND_HANDLER } from "../utils/Constants";
export abstract class Module {
  protected channelId: number;
  @AutoWired protected readonly chatClient!: ChatClient;

  constructor(channelId: number) {
    this.channelId = channelId;
  }

  protected abstract destroy(): void;
}
