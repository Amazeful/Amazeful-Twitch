//Constructor is a any class constructor function
export type Constructor<T> = {
  new (...args: any[]): T;
};

//Twitch Data is used to store Twitch creds
export interface TwitchData {
  username: string;
  password: string;
  clientID: string;
  clientSecret: string;
}
