import { mocked } from "ts-jest/utils";

import { CacheManager } from "../../services/CahceManager";
import { Cacheable } from "../Cacheable";
import { CacheSetOptions } from "../../types/Options";

jest.mock("../../services/CahceManager");

beforeEach(() => {
  mocked(CacheManager).mockClear();
});

class Test {
  @Cacheable({ expiry: 100 })
  async cacheableMethod() {
    return "test";
  }

  @Cacheable({ expiry: 200 })
  async cacheableObject(firstName: string, lastName: string, age: number) {
    return {
      name: {
        first: firstName,
        last: lastName
      },

      age: age
    };
  }

  @Cacheable({ expiry: 100 })
  async cacheableWithError(): Promise<string> {
    return "test";
  }
}

describe("./decorators/Cacheable", () => {
  test("should cache the result correctly before returning value", async () => {
    const test = new Test();
    const mockedCache = jest.fn();
    CacheManager.prototype.cache = mockedCache;
    const expected: CacheSetOptions = {
      key: "Test/cacheableMethod/",
      value: JSON.stringify("test"),
      expiry: 100
    };
    const result = await test.cacheableMethod();

    expect(mockedCache).toHaveBeenCalledTimes(1);
    expect(mockedCache.mock.calls[0][0]).toEqual(expected);
    expect(result).toBe("test");
  });

  test("should return the value from cache", async () => {
    const test = new Test();
    const mockedGet = jest.fn();
    mockedGet
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(JSON.stringify("test"));
    CacheManager.prototype.get = mockedGet;
    let result = await test.cacheableMethod();
    result = await test.cacheableMethod();
    expect(mockedGet).toHaveBeenCalledTimes(2);
    expect(mockedGet.mock.calls[0][0]).toBe("Test/cacheableMethod/");
    expect(mockedGet.mock.calls[1][0]).toBe("Test/cacheableMethod/");
    expect(mockedGet.mock.results[0].value).toBeNull();
    expect(mockedGet.mock.results[1].value).toBe(JSON.stringify("test"));
    expect(result).toBe("test");
  });

  test("should return the object value from cache", async () => {
    const test = new Test();
    const mockedGet = jest.fn();

    const expected = {
      name: {
        first: "John",
        last: "Doe"
      },

      age: 20
    };

    mockedGet
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(JSON.stringify(expected));
    CacheManager.prototype.get = mockedGet;
    let result = await test.cacheableObject("John", "Doe", 20);
    result = await test.cacheableObject("John", "Doe", 20);
    expect(mockedGet).toHaveBeenCalledTimes(2);
    expect(mockedGet.mock.calls[0][0]).toBe("Test/cacheableObject/John:Doe:20");
    expect(mockedGet.mock.calls[1][0]).toBe("Test/cacheableObject/John:Doe:20");
    expect(mockedGet.mock.results[0].value).toBeNull();
    expect(mockedGet.mock.results[1].value).toBe(JSON.stringify(expected));
    expect(result).toEqual(expected);
  });

  test("should still return value if cache fails", async () => {
    const test = new Test();
    const mockedGet = jest.fn();
    CacheManager.prototype.get = mockedGet;
    mockedGet.mockRejectedValueOnce(
      "Cache Fail Test: If you are seeing this error in your tests, don't worry. This is expected."
    );
    const result = await test.cacheableWithError();
    expect(result).toBe("test");
  });
});
