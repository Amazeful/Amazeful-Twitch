import { Module } from "../types/Module";
import { Constructor } from "../types/Misc";
import { Channel } from "../core/Channel";
import { CHANNEL_MODULE } from "../utils/Constants";

//RegisterModule adds a module to Channel class metadata
//A registrable module MUST extend types/Module
export const RegisterModule =
  (): ((target: Constructor<Module>) => void) => (target) => {
    const existingModules: Constructor<Module>[] =
      Reflect.getOwnMetadata(CHANNEL_MODULE, Channel) || [];
    existingModules.push(target);

    Reflect.defineMetadata(CHANNEL_MODULE, existingModules, Channel);
  };
