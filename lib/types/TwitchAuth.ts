//TwitchData includes required twitch information
export interface TwitchData {
  botStatus: "default" | "knownBot" | "verifiedBot";
  username: string;
  password: string;
  clientID: string;
  clientSecret: string;
  accessToken: string;
  refreshToken: string;
}
