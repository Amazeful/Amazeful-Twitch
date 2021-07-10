import { Cacheable } from "../decorators/Cacheable";
import { RegisterModule } from "../decorators/RegisterModule";
import { Module } from "./Module";
import { CacheManager } from "../services/CahceManager";
@RegisterModule()
export class Command extends Module {
  private _cache!: CacheManager;
  protected destroy(): void {
    throw new Error("Method not implemented.");
  }

  get cache() {
    return this._cache;
  }

  @Cacheable({ expiry: 60 })
  protected async handleMessage(
    user: string,
    message: string
  ): Promise<string> {
    throw new Error("Method not implemented.");
  }
  private _commands: Map<string, string>;

  constructor(channelId: number) {
    super(channelId);
    this._commands = new Map();
  }

  get commands() {
    return this._commands;
  }
}
