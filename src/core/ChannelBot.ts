import { promises as fs } from "fs";
import { resolve } from "path";
import { PrivmsgMessage } from "@aidenhadisi/amazeful-twitch-irc";

import { Module } from "../types/Module";
import { Constructor } from "../types/Misc";
import { Logger, LogLevel } from "../utils/Logger";
import { RegisterMessageHandlerOptions } from "../types/options/RegisterMessageHandlerOptions";
import { MESSAGE_HANDLER } from "../utils/Constants";
import { Roles } from "../types/enums/Roles";
import { Channel } from "../models/Channel";
import { UserRole } from "../models/UserRole";
import { AutoWired } from "../decorators/AutoWired";
import { ORM } from "../services/ORM";

/**
 * Channel is a bot instance for an individual channel.
 * All channel modules are initialized in this class
 */
export class ChannelBot {
  public static moduleContainer: Constructor<Module>[] = [];
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

  @AutoWired private orm!: ORM;
  private modules: Record<string, Module>;
  private messageHandlers: Array<RegisterMessageHandlerOptions>;
  private userRoleList: Record<string, UserRole>;
  public data: Channel;

  constructor(channel: Channel) {
    this.data = channel;
    this.modules = {};
    this.messageHandlers = [];
    this.userRoleList = {};
    this.registerModules();
    this.registerHandlers();
  }

  public async init(): Promise<void> {
    await this.addUserRoles();

    for (const module in this.modules) {
      await this.modules[module].init();
    }
  }

  public onMessage(msg: PrivmsgMessage) {}

  //TODO: Add command handlers

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

  private async addUserRoles() {
    const roles = await this.orm.em.find(UserRole, {
      channelID: this.data.channelID
    });

    for (const role of roles) {
      this.userRoleList[role.login] = role;
    }
  }

  /**
   * Registers modules that are currently in the module container
   */
  private registerModules(): void {
    for (const module of ChannelBot.moduleContainer) {
      this.modules[module.name] = new module(this.data);
    }
  }

  /**
   * Register handlers for each module
   */
  private registerHandlers(): void {
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

  public destory(): void {
    for (const module in this.modules) {
      this.modules[module].destroy();
    }
  }
}
