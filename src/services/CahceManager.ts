import Redis, { KeyType } from "ioredis";
import { singleton } from "tsyringe";
import { CacheSetOptions } from "../types/Options";

@singleton()
export class CacheManager extends Redis {
  private _totalCalled = 0;
  private _totalHit = 0;
  private _totalMiss = 0;

  public cache(data: CacheSetOptions): Promise<"OK" | null> {
    return super.set(data.key, data.value, "PX", data.expiry);
  }

  public override async get(key: KeyType): Promise<string | null> {
    this._totalCalled++;
    const result = await super.get(key);
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
