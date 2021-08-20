import {
  AlternateMessageModifier,
  ChatClient as DankClient,
  correctChannelName,
  removeInPlace,
  say,
  sendPrivmsg,
  SingleConnection,
  SlowModeRateLimiter,
  validateChannelName,
} from "dank-twitch-irc";
import { singleton } from "tsyringe";
import { DebugLogger } from "../decorators/DebugLogger";
import { Logger, LogLevel } from "../utils/Logger";

@singleton()
export class ChatClient extends DankClient {
  private massTransportSockets: SingleConnection[];
  private massTransportPoolSize: number =
    process.env.NODE_ENV === "development" ? 5 : 100;

  private maxRetries = 30;
  private retryTimeout?: NodeJS.Timeout;
  private currentRetires = 0;
  constructor() {
    super({
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      rateLimits: process.env.BOTSTATUS,
      installDefaultMixins: true,
      maxChannelCountPerConnection: 200,
      connectionRateLimits: {
        parallelConnections: 5,
        releaseTime: 2000,
      },
    });

    this.use(new AlternateMessageModifier(this));
    this.use(new SlowModeRateLimiter(this));
    this.massTransportSockets = [];
    this.createTransportSockets();
  }

  @DebugLogger
  private createTransportSockets() {
    for (var i = 0; i < this.massTransportPoolSize; i++) {
      this.newMassTransportSocket();
    }
    this.on("close", () => {
      this.massTransportSockets.forEach((conn) => conn.close());
    });
  }

  @DebugLogger
  private newMassTransportSocket(): SingleConnection {
    if (this.massTransportSockets.length > this.massTransportPoolSize)
      return this.requireMassTransportSocket();
    const conn = new SingleConnection(this.configuration);

    for (const mixin of this.connectionMixins) {
      conn.use(mixin);
    }

    conn.on("connecting", () => this.emitConnecting());
    conn.on("connect", () => {
      this.emitConnected();
      Logger.log(LogLevel.WARN, "A new socket was connected");
    });
    conn.on("ready", () => this.emitReady());
    conn.on("error", (error) => this.emitError(error));
    conn.on("close", (hadError) => {
      Logger.log(LogLevel.ERROR, `Disconnected ${hadError}`);
      removeInPlace(this.massTransportSockets, conn);

      if (
        !this.closed &&
        this.massTransportSockets.length < this.massTransportPoolSize
      ) {
        this.activateRetryInterval();
        this.newMassTransportSocket();
      }
    });

    // forward commands issued by this client
    conn.on("rawCommmand", (cmd) => this.emit("rawCommmand", cmd));
    conn.connect();

    this.massTransportSockets.push(conn);
    return conn;
  }

  public async reconnect() {
    this.createTransportSockets();
    await this.connect();
  }

  public async privmsg(
    channelName: string,
    message: string,
    fast: boolean = false
  ): Promise<void> {
    if (!fast) return super.privmsg(channelName, message);
    channelName = correctChannelName(channelName);
    validateChannelName(channelName);
    return sendPrivmsg(this.requireMassTransportSocket(), channelName, message);
  }

  public async say(
    channelName: string,
    message: string,
    replyTo?: string,
    fast: boolean = false
  ): Promise<void> {
    if (!fast) return super.say(channelName, message, replyTo);
    channelName = correctChannelName(channelName);
    validateChannelName(channelName);
    await say(this.requireMassTransportSocket(), channelName, message, replyTo);
  }

  private requireMassTransportSocket(): SingleConnection {
    var con = this.massTransportSockets.shift();
    if (!con) return this.newMassTransportSocket();
    this.massTransportSockets.push(con);
    return con;
  }

  private activateRetryInterval() {
    if (this.retryTimeout) {
      this.currentRetires++;
      if (this.currentRetires === this.maxRetries) {
        Logger.log(
          LogLevel.ERROR,
          `Max retries reached. Disconnecting client.`
        );
        this.close();
      }
      return;
    }

    this.retryTimeout = setTimeout(this.clearInterval, 30000);
  }

  private clearInterval() {
    if (this.retryTimeout) clearTimeout(this.retryTimeout);
    this.retryTimeout = undefined;
  }
}
