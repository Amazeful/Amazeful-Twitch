import { singleton } from "tsyringe";
import { TwitchTokens } from "../types/TwitchTokens";
import { RefreshingAuthProvider } from "@twurple/auth";

@singleton()
export class TokenManager {
  private twitchTokens: TwitchTokens;
  private authProvider: RefreshingAuthProvider;
  constructor() {
    this.twitchTokens = {
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    };
  }
}
