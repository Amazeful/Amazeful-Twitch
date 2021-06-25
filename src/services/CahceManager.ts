import Redis from "ioredis";
import { singleton } from "tsyringe";

@singleton()
export class CacheManager extends Redis {
  private _totalCalled: number = 0;
  private _totalHit: number = 0;
  private _totalMiss: number = 0;

  public get totalCalled(): number {
    return this._totalCalled;
  }

  public get totalHit(): number {
    return this._totalHit;
  }

  public get totalMiss(): number {
    return this._totalMiss;
  }
}
