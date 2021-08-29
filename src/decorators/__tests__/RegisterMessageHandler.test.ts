import { Module } from "../../types/Module";
import { RegisterMessageHandler } from "../RegisterMessageHandler";
import { PrivmsgMessage, parseTwitchMessage } from "dank-twitch-irc";
import { Channel } from "../../models/Channel";
import { MESSAGE_HANDLER } from "../../utils/Constants";
import { RegisterMessageHandlerOptions } from "../../types/options/RegisterMessageHandlerOptions";

describe("./decorators/RegisterMessageHandler", () => {
  test("should add correct meta data to module", async () => {
    class Test extends Module {
      protected init(): Promise<void> {
        throw new Error("Method not implemented.");
      }
      public testString = "This is a test";
      protected destroy(): Promise<void> {
        throw new Error("Method not implemented.");
      }
      @RegisterMessageHandler()
      public async test(msg: PrivmsgMessage): Promise<void> {
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
      ) as PrivmsgMessage
    );
    expect(test.testString).toBe("Kappa Keepo Kappa");
    expect(messageHandlers.modRequired).toBe(false);
  });
});
