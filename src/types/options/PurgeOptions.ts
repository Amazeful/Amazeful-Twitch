//Purge options to init a purge action
export interface PurgeOptions {
  lookbackTime: number; //Lookback time in seconds
  timeoutDuration: number | string;
  pattern: string; //pattern to lookfor
  regex: boolean; //Phrase is a regex?
  caseSensitive: boolean; //Prhase is case sensitive?
  modName: string; //name of the mod calling the command
  continuousTime?: number; //time to continue
}
