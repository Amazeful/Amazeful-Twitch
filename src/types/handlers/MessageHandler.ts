import { PrivmsgMessage } from "dank-twitch-irc";

//MessageHandler is a function that handles incoming twitch messages
export type MessageHandler = (msg: PrivmsgMessage) => Promise<void>;
