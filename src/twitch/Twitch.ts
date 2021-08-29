import { AccessToken, RefreshingAuthProvider } from "@twurple/auth";
import { singleton } from "tsyringe";
import { ApiClient } from "@twurple/api";
import { TokenInfo } from "../models/TokenInfo";
import { AutoWired } from "../decorators/AutoWired";
import { ORM } from "../services/ORM";
import { DebugLogger } from "../decorators/DebugLogger";
import { TwitchData } from "../types/data/TwitchData";
@singleton()
export class Twitch {
  @AutoWired private orm!: ORM;
  private tokenInfo!: TokenInfo;
  private readonly twitchData: TwitchData;

  private authProvider!: RefreshingAuthProvider;
  private apiClient!: ApiClient;

  constructor() {
    this.twitchData = {
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET
    };
  }

  /**
   * Create a new Twitch Controller, checks that tokens and data are valid
   */
  @DebugLogger
  public async init(): Promise<void> {
    const repository = this.orm.em.getRepository(TokenInfo);
    let tokenInfo = await repository.findOne({
      shardID: process.env.SHARD_ID
    });

    if (!tokenInfo) {
      tokenInfo = new TokenInfo();
      tokenInfo.shardID = process.env.SHARD_ID;
      tokenInfo.accessToken = process.env.ACCESS_TOKEN;
      tokenInfo.refreshToken = process.env.REFRESH_TOKEN;
      tokenInfo.expirey = 0;
      tokenInfo.tokenObtainTime = new Date();
    }

    this.tokenInfo = tokenInfo;
    this.authProvider = new RefreshingAuthProvider(
      {
        clientId: this.twitchData.clientID,
        clientSecret: this.twitchData.clientSecret,
        onRefresh: (token: AccessToken) => this.onRefresh(token)
      },
      {
        accessToken: this.tokenInfo.accessToken,
        refreshToken: this.tokenInfo.refreshToken,
        expiresIn: this.tokenInfo.expirey,
        obtainmentTimestamp: this.tokenInfo.tokenObtainTime.valueOf()
      }
    );

    await repository.persistAndFlush(this.tokenInfo);

    await this.authProvider.getAccessToken();
    this.apiClient = new ApiClient({ authProvider: this.authProvider });
  }

  @DebugLogger
  private async onRefresh(token: AccessToken) {
    console.log(this.tokenInfo);
    this.tokenInfo.accessToken = token.accessToken;
    this.tokenInfo.refreshToken =
      token.refreshToken ?? this.tokenInfo.refreshToken;
    this.tokenInfo.expirey = token.expiresIn ?? 600;
    this.tokenInfo.tokenObtainTime = new Date();
    console.log(this.tokenInfo);

    const repository = this.orm.em.getRepository(TokenInfo);
    await repository.persistAndFlush(this.tokenInfo);
  }

  public get client(): ApiClient {
    return this.apiClient;
  }

  public get provider(): RefreshingAuthProvider {
    return this.authProvider;
  }

  public get data(): TwitchData {
    return this.twitchData;
  }
}
