import { PrivmsgMessage } from "dank-twitch-irc";
import { Roles } from "./Roles";
import { StreamStatus } from "./StreamStatus";

export interface TwitchMessage extends PrivmsgMessage {
  role: Roles;
  streamStatus: StreamStatus;
}
