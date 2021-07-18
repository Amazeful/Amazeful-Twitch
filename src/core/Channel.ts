import { Channel as ChannelData } from "../models/Channel";
import { Module } from "../modules/Module";
import { promises as fs } from "fs";

/**
 * Channel is a bot instance for an individual channel.
 * All channel modules are initialized in this class
 */
export class Channel {
  private data: ChannelData;
  private modules: Record<string, Module>;

  constructor(data: ChannelData) {
    this.data = data;
    this.modules = {};
  }

  public async init() {}
  public async registerModules() {
    // fs.readdirSync("./src/modules").forEach(function (file) {
    //   require("../modules/" + file);
    // });
    // for (const model of await fs.readdir(__dirname)) {
    //   await import(join(__dirname, model));
    // }
    // var modules: ModuleType[] = Reflect.getOwnMetadata("Modules", Bot);
    // console.log(modules);
    // var initModules: Record<string, Module> = {};
    // for (var mod of modules) {
    //   initModules[mod.name] = new mod();
    // }
    // console.log(initModules);
  }
}
