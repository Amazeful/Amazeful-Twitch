import { Module } from "../types/Module";
import { Constructor } from "../types/Misc";
import { ChannelBot } from "../core/ChannelBot";

//RegisterModule adds a module to Channel class
//A registrable module MUST extend types/Module
export const RegisterModule =
  (): ((target: Constructor<Module>) => void) => (target) => {
    ChannelBot.moduleContainer.push(target);
  };
