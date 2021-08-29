import { MessageHandler } from "../handlers/MessageHandler";
export interface RegisterMessageHandlerOptions {
  modRequired: boolean;
  handler: MessageHandler;
}
