import { PrivmsgMessage } from "@aidenhadisi/amazeful-twitch-irc";
import { TwitchInfo } from "../data/AdditionalTwitchData";

//MessageHandler is a function that handles incoming twitch messages
export type MessageHandler = (
  msg: PrivmsgMessage,
  info: TwitchInfo
) => Promise<void>;
