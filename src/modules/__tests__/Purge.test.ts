import { parseTwitchMessage, PrivmsgMessage } from "dank-twitch-irc";
import { ValidationError } from "joi";
import { Channel } from "../../models/Channel";
import { PurgeConfig } from "../../models/PurgeConfig";
import { Purge } from "../Purge";
import { PurgeData } from "../../types/data/PurgeData";
let purge: Purge;

beforeEach(() => {
  purge = new Purge(new Channel());
  purge["config"] = new PurgeConfig();
});
describe("./modules/Purge", () => {
  test("Purge(): should throw with invalid options", () => {
    expect(() =>
      purge.purge({
        lookbackTime: 10,
        timeoutDuration: "nam",
        phrase: "nam",
        modName: "amazeful",
        regex: false,
        continuous: false,
        continuousTime: 10
      })
    ).toThrow(ValidationError);
  });

  test("messageHandler(): should store correct info", () => {
    purge.messageHandler(
      parseTwitchMessage(
        "@badge-info=;badges=;color=#AEE7E8;display-name=Amazeful;emotes=25:0-4,12-16/1902:6-10;id=b34ccfc7-4977-403a-8a94-33c6bac34fb8;mod=0;room-id=138760387;subscriber=0;tmi-sent-ts=1507246572675;user-id=138760387 :amazeful!amazeful@amazeful.tmi.twitch.tv PRIVMSG #amazeful :Kappa Keepo Kappa"
      ) as PrivmsgMessage
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

    expect(typeof stored?.timeStamp).toBe("number");
    expect(stored?.timeStamp).toBeGreaterThanOrEqual(expected.timeStamp);
  });
});
