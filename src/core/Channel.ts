import { Module } from "../types/Module";
import { promises as fs } from "fs";
import { resolve } from "path";
import { Constructor } from "../types/Misc";

/**
 * Channel is a bot instance for an individual channel.
 * All channel modules are initialized in this class
 */
export class Channel {
  public static moduleContainer: Constructor<Module>[] = [];

  private modules: Record<string, Module>;

  constructor() {
    this.modules = {};
  }

  public async init(): Promise<void> {
    await this.registerModules();
  }

  /**
   * Registers modules marked with @RegisterModule decorator
   */
  public async registerModules(): Promise<void> {
    const modulesDir = resolve(__dirname, "..", "modules");
    const files = await fs.readdir(modulesDir);

    for (const file of files) {
      await import(resolve(modulesDir, file));
    }

    for (const module of Channel.moduleContainer) {
      this.modules[module.name] = new module();
    }
  }
}
