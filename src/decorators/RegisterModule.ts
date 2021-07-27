import { Module } from "../types/Module";
import { Constructor } from "../types/Misc";
import { Channel } from "../core/Channel";

//RegisterModule adds a module to Channel class
//A registrable module MUST extend types/Module
export const RegisterModule =
  (): ((target: Constructor<Module>) => void) => (target) => {
    Channel.moduleContainer.push(target);
  };
