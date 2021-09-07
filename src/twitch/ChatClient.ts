import {
  AlternateMessageModifier,
  ChatClient as TwitchIRC,
  SlowModeRateLimiter,
  ConnectionPool
} from "@aidenhadisi/amazeful-twitch-irc";
import { singleton } from "tsyringe";

@singleton()
export class ChatClient extends TwitchIRC {
  constructor() {
    super({
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      rateLimits: process.env.BOTSTATUS,
      installDefaultMixins: true,
      maxChannelCountPerConnection: 200,
      connectionRateLimits: {
        parallelConnections: 5,
        releaseTime: 2000
      }
    });

    this.use(new AlternateMessageModifier(this));
    this.use(new SlowModeRateLimiter(this));
    this.use(
      new ConnectionPool(this, {
        poolSize: process.env.NODE_ENV === "development" ? 5 : 100
      })
    );
  }

  public async reconnect(): Promise<void> {
    await this.connect();
  }
}
