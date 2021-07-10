import { RegisterModule } from "../decorators/RegisterModule";
import { Module } from "./Module";

@RegisterModule()
export class Notify extends Module {
  protected handleMessage(user: string, message: string): void {
    throw new Error("Method not implemented.");
  }
  private _notifs: Map<string, string>;

  constructor(channelId: number) {
    super(channelId);
    this._notifs = new Map();
  }

  get notifs() {
    return this._notifs;
  }
}
