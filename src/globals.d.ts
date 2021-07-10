import { RateLimitsConfig } from "dank-twitch-irc";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      BOTSTATUS: RateLimitsConfig;
      USERNAME: string;
      PASSWORD: string;
    }
  }
}
