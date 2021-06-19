import { Channel as ChannelData } from "../models/Channel";
export class Channel {
  private _data: ChannelData;

  constructor(data: ChannelData) {
    this._data = data;
  }
}
