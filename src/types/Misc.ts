import { PrivmsgMessage } from "dank-twitch-irc";
//Defines an object constructor type
export type Constructor<T> = {
  new (...args: any[]): T;
};

// CommandHandlerType defines a type of command handler method within modules
export type CommandHandlerType = (
  sender: string,
  args: string[]
) => Promise<string>;

// VariableResolverType defines a type of a method that resolves custom variable values
export type VariableResolverType = (...args: any[]) => Promise<string>;

export type MessageHandlerType = (msg: PrivmsgMessage) => Promise<void>;

//ComperatorFunc defines a type for comperator functions used by different classes
export type ComperatorFunc<T> = (a: T, b: T) => number;
