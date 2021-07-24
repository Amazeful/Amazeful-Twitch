import { Channel as ChannelData } from "../models/Channel";
import { Module } from "../types/Module";
import { promises as fs } from "fs";
import { resolve } from "path";
import { ApiClient } from "@twurple/api";
import { CHANNEL_MODULE } from "../utils/Constants";
import { Constructor } from "../types/Misc";

/**
 * Channel is a bot instance for an individual channel.
 * All channel modules are initialized in this class
 */
export class Channel {
  private modules: Record<string, Module>;
  private botStatus?: "mod" | "vip";

  constructor() {
    this.modules = {};
  }

  public async init() {
    await this.registerModules();
  }

  /**
   * Registers modules marked with @RegisterModule decorator
   */
  public async registerModules() {
    let modulesDir = resolve(__dirname, "..", "modules");
    let files = await fs.readdir(modulesDir);

    for (let file of files) {
      await import(resolve(modulesDir, file));
    }

    let modules: Constructor<Module>[] = Reflect.getOwnMetadata(
      CHANNEL_MODULE,
      Channel
    );

    for (let module of modules) {
      this.modules[module.name] = new module();
    }
  }
}
