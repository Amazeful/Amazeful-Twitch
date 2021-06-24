import { ClientConfiguration } from "dank-twitch-irc";
export interface ChatClientConfiguration extends ClientConfiguration {
  poolSize: number;
}
