import Redis, { KeyType } from "ioredis";
import { singleton } from "tsyringe";
import { CacheSetConfig } from "../types/CacheSetConfig";

@singleton()
export class CacheManager extends Redis {
  private _totalCalled: number = 0;
  private _totalHit: number = 0;
  private _totalMiss: number = 0;

  public cache(data: CacheSetConfig): Promise<"OK" | null> {
    return super.set(data.key, data.value, "PX", data.expiry);
  }

  public async get(key: KeyType): Promise<string | null> {
    this._totalCalled++;
    var result = await super.get(key);
    if (!result) this._totalMiss++;
    else this._totalHit++;
    return result;
  }

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
