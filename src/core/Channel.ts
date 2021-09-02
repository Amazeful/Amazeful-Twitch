import { Module } from "../types/Module";
import { promises as fs } from "fs";
import { resolve } from "path";
import { Constructor } from "../types/Misc";
import { Logger, LogLevel } from "../utils/Logger";
import { RegisterMessageHandlerOptions } from "../types/options/RegisterMessageHandlerOptions";
import { MESSAGE_HANDLER } from "../utils/Constants";
import { PrivmsgMessage } from "@aidenhadisi/dank-twitch-irc";
import { Roles } from "../types/enums/Roles";

/**
 * Channel is a bot instance for an individual channel.
 * All channel modules are initialized in this class
 */
export class Channel {
  public static moduleContainer: Constructor<Module>[] = [];

  private modules: Record<string, Module>;
  private messageHandlers: Array<RegisterMessageHandlerOptions>;

  constructor() {
    this.modules = {};
    this.messageHandlers = [];
  }

  public async init(): Promise<void> {
    try {
      this.registerModules();
      for (const module in this.modules) {
        await this.modules[module].init();
      }
    } catch (e) {
      //TODO: Add channelID for logger
      Logger.log(
        LogLevel.ERROR,
        "Failed to init channel: <ChannelID>",
        "Channel"
      );
      this.destory();
    }
  }

  /**
   * Registers modules that are currently in the module container
   */
  public registerModules(): void {
    for (const module of Channel.moduleContainer) {
      this.modules[module.name] = new module();
    }
  }

  public registerHandlers(): void {
    for (const module in this.modules) {
      //Register module message handler
      const messageHandler: RegisterMessageHandlerOptions | undefined =
        Reflect.getMetadata(MESSAGE_HANDLER, this.modules[module]);

      if (messageHandler) {
        messageHandler.handler.bind(this.modules[module]);
        this.messageHandlers.push(messageHandler);
      }

      //TODO: Add other handlers
    }
  }

  //TODO: Add command handlers

  /**
   * Gets all module files and adds them to Channel module container
   */
  public static async populateModuleContainer(): Promise<void> {
    const modulesDir = resolve(__dirname, "..", "modules");

    const files = await fs.readdir(modulesDir);

    for (const file of files) {
      if (file === "__tests__") continue;
      await import(resolve(modulesDir, file));
    }
  }

  public destory(): void {
    for (const module in this.modules) {
      this.modules[module].destroy();
    }
  }

  public getUserRoles(msg: PrivmsgMessage): number {
    let userRoles: number = Roles.GLOBAL;

    if (msg.badges.hasSubscriber) {
      userRoles |= Roles.SUBSCRIBER;
    }

    if (msg.badges.hasVIP) {
      userRoles |= Roles.VIP;
    }

    if (msg.badges.hasModerator) {
      userRoles |= Roles.MODERATOR;
    }

    if (msg.badges.hasBroadcaster) {
      userRoles |= Roles.BROADCASTER;
    }

    return userRoles;
  }
}
