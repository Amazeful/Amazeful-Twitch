import {
  parseTwitchMessage,
  PrivmsgMessage
} from "@aidenhadisi/dank-twitch-irc";
import { ValidationError } from "joi";
import { Channel } from "../../models/Channel";
import { PurgeConfig } from "../../models/PurgeConfig";
import { Purge } from "../Purge";
import { PurgeData } from "../../types/data/PurgeData";
import MockDate from "mockdate";

let purge: Purge;

beforeEach(() => {
  purge = new Purge(new Channel());
  purge["config"] = new PurgeConfig();
  purge["config"].enabled = true;
});
describe("./modules/Purge", () => {
  test("#purge(): should throw with invalid options", () => {
    expect(() =>
      purge.purge({
        lookbackTime: 10,
        timeoutDuration: "nam",
        pattern: "nam",
        modName: "amazeful",
        regex: false,
        continuous: false,
        caseSensitive: false,
        continuousTime: 10
      })
    ).toThrow(ValidationError);
  });

  test("#messageHandler(): should store correct info", () => {
    MockDate.set(0);

    purge.messageHandler(
      parseTwitchMessage(
        "@badge-info=;badges=;color=#AEE7E8;display-name=Amazeful;emotes=25:0-4,12-16/1902:6-10;id=b34ccfc7-4977-403a-8a94-33c6bac34fb8;mod=0;room-id=138760387;subscriber=0;tmi-sent-ts=1507246572675;user-id=138760387 :amazeful!amazeful@amazeful.tmi.twitch.tv PRIVMSG #amazeful :Kappa Keepo Kappa"
      ) as PrivmsgMessage,
      { userRole: 1 }
    );
    const expected: PurgeData = {
      id: "b34ccfc7-4977-403a-8a94-33c6bac34fb8",
      sender: "amazeful",
      message: "Kappa Keepo Kappa",
      timeStamp: new Date().valueOf()
    };

    const stored = purge["messages"].toArray()[0];
    expect(stored?.id).toBe(expected.id);
    expect(stored?.sender).toBe(expected.sender);
    expect(stored?.message).toBe(expected.message);

    expect(stored?.timeStamp).toBe(expected.timeStamp);
  });

  test("#messageHandler(): should stop if user role is above max target", () => {
    purge.messageHandler(
      parseTwitchMessage(
        "@badge-info=;badges=;color=#AEE7E8;display-name=Amazeful;emotes=25:0-4,12-16/1902:6-10;id=b34ccfc7-4977-403a-8a94-33c6bac34fb8;mod=0;room-id=138760387;subscriber=0;tmi-sent-ts=1507246572675;user-id=138760387 :amazeful!amazeful@amazeful.tmi.twitch.tv PRIVMSG #amazeful :Kappa Keepo Kappa"
      ) as PrivmsgMessage,
      { userRole: 16 }
    );

    expect(purge["messages"].toArray()).toHaveLength(0);
  });

  test("#messageHandler(): should stop if not enabled", () => {
    purge["config"].enabled = false;
    purge.messageHandler(
      parseTwitchMessage(
        "@badge-info=;badges=;color=#AEE7E8;display-name=Amazeful;emotes=25:0-4,12-16/1902:6-10;id=b34ccfc7-4977-403a-8a94-33c6bac34fb8;mod=0;room-id=138760387;subscriber=0;tmi-sent-ts=1507246572675;user-id=138760387 :amazeful!amazeful@amazeful.tmi.twitch.tv PRIVMSG #amazeful :Kappa Keepo Kappa"
      ) as PrivmsgMessage,
      { userRole: 1 }
    );

    expect(purge["messages"].toArray()).toHaveLength(0);
  });
});
