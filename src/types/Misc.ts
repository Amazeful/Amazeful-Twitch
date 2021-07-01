import { PrivmsgMessage } from "dank-twitch-irc";
import { CacheManager } from "../services/CahceManager";
export type Constructor<T> = {
  new (...args: any[]): T;
};

export type MessageHandler = {
  (msg: PrivmsgMessage): void;
};

export type CacheableMethodDecorator = <T>(
  target: Object,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<T>>
) => void;
