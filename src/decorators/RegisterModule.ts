import { Module } from "../modules/Module";
import { Constructor } from "../types/Misc";
import { Channel } from "../core/ChannelBot";
import { CHANNEL_MODULE } from "../utils/Constants";

//RegisterModule adds a module to Channel class metadata
export const RegisterModule =
  (): ((target: Constructor<Module>) => void) => (target) => {
    const existingModules =
      Reflect.getOwnMetadata(CHANNEL_MODULE, Channel) || [];
    existingModules.push(target);

    Reflect.defineMetadata(CHANNEL_MODULE, existingModules, Channel);
  };
