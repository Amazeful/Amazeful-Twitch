import { Module } from "../../types/Module";
import { RegisterMessageHandler } from "../RegisterMessageHandler";
import {
  PrivmsgMessage,
  parseTwitchMessage
} from "@aidenhadisi/amazeful-twitch-irc";
import { Channel } from "../../models/Channel";
import { MESSAGE_HANDLER } from "../../utils/Constants";
import { RegisterMessageHandlerOptions } from "../../types/options/RegisterMessageHandlerOptions";
import { TwitchInfo } from "../../types/data/AdditionalTwitchData";

describe("./decorators/RegisterMessageHandler", () => {
  test("should add correct meta data to module", async () => {
    class Test extends Module {
      public init(): Promise<void> {
        throw new Error("Method not implemented.");
      }
      public testString = "This is a test";
      public destroy(): void {
        throw new Error("Method not implemented.");
      }
      @RegisterMessageHandler()
      public async test(msg: PrivmsgMessage, _: TwitchInfo): Promise<void> {
        this.testString = msg.messageText;
      }
    }
    const test = new Test(new Channel());
    const messageHandlers: RegisterMessageHandlerOptions = Reflect.getMetadata(
      MESSAGE_HANDLER,
      test
    );

    const handler = messageHandlers.handler;
    await handler.bind(test)(
      parseTwitchMessage(
        "@badge-info=;badges=;color=#AEE7E8;display-name=Amazeful;emotes=25:0-4,12-16/1902:6-10;id=b34ccfc7-4977-403a-8a94-33c6bac34fb8;mod=0;room-id=138760387;subscriber=0;tmi-sent-ts=1507246572675;user-id=138760387 :amazeful!amazeful@amazeful.tmi.twitch.tv PRIVMSG #amazeful :Kappa Keepo Kappa"
      ) as PrivmsgMessage,
      {
        userRole: 100
      }
    );
    expect(test.testString).toBe("Kappa Keepo Kappa");
    expect(messageHandlers.modRequired).toBe(false);
  });
});
