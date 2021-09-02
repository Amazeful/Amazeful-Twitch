import { PrivmsgMessage } from "@aidenhadisi/dank-twitch-irc";
import { AdditionaTwitchData } from "../data/AdditionalTwitchData";

//MessageHandler is a function that handles incoming twitch messages
export type MessageHandler = (
  msg: PrivmsgMessage,
  info?: AdditionaTwitchData
) => Promise<void>;
