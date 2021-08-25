export interface PurgeOptions {
  lookbackTime: number; //Lookback time in seconds
  timeoutDuration: number | string;
  phrase: string; //phrase to ban
  regex: boolean; //Phrase is a regex?
  modName: string; //name of the mod calling the command
  continuous: boolean; //continue timing out this phrase
  continuousTime: number; //time to continue
}
