//TwitchAuth defines the structure for required Twitch tokens
export interface TwitchAuth {
  clientID: string;
  clientSecret: string;
  accessToken: string;
  refreshToken: string;
}
