import { Channel as ChannelData } from "../models/Channel";

/**
 * ChannelBot is a bot instance for an individual channel.
 * All channel modules are initialized in this class
 */
export class ChannelBot {
  private _data: ChannelData;

  constructor(data: ChannelData) {
    this._data = data;
  }
}
