import { RateLimitsConfig } from "dank-twitch-irc";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      SHARD_ID: number;
      BOTSTATUS: RateLimitsConfig;
      USERNAME: string;
      PASSWORD: string;
      CLIENT_ID: string;
      CLIENT_SECRET: string;
      ACCESS_TOKEN: string;
      REFRESH_TOKEN: string;
    }
  }
}
