export class CommonUtils {
  public static isDefined<T>(val: T | undefined | null): val is T {
    return val !== undefined && val !== null;
  }

  public static isNull<T>(val: T | null): val is null {
    return val === null;
  }
}
