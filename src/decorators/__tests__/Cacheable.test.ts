import { mocked } from "ts-jest/utils";

import { CacheManager } from "../../services/CahceManager";
import { Cacheable } from "../Cacheable";
import { CacheSetConfig } from "../../types/CacheSetConfig";
import { ORM } from "../../services/ORM";
import { User } from "../../models/User";
import { getORM } from "../../jest.setup";
import { container } from "tsyringe";

jest.mock("../../services/CahceManager");
beforeAll(async () => {
  var orm = await getORM();
  container.registerInstance(ORM, orm);
});

afterAll(async () => {
  var orm = await getORM();
  await orm.close();
});
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
        last: lastName,
      },

      age: age,
    };
  }

  @Cacheable({ expiry: 100, entity: User })
  async cacheableEntity(id: number): Promise<User> {
    var user = new User({
      userID: id,
      login: "amazeful",
      displayName: "Amazeful",
      type: "",
      broadcasterType: "",
      description: "",
      profileImageURL: "",
      offlineImageURL: "",
      viewCount: 100,
    });

    var orm = await getORM();
    await orm.em.getRepository(User).persistAndFlush(user);
    orm.em.clear();
    return user;
  }

  @Cacheable({ expiry: 100 })
  async cacheableWithError(): Promise<string> {
    return "test";
  }
}

describe("./decorators/Cacheable", () => {
  test("should cache the result correctly before returning value", async () => {
    var test = new Test();
    const mockedCache = jest.fn();
    CacheManager.prototype.cache = mockedCache;
    const expected: CacheSetConfig = {
      key: "cacheableMethod/",
      value: JSON.stringify("test"),
      expiry: 100,
    };
    var result = await test.cacheableMethod();

    expect(mockedCache).toBeCalledTimes(1);
    expect(mockedCache.mock.calls[0][0]).toEqual(expected);
    expect(result).toBe("test");
  });

  test("should return the value from cache", async () => {
    var test = new Test();
    const mockedGet = jest.fn();
    mockedGet
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(JSON.stringify("test"));
    CacheManager.prototype.get = mockedGet;
    var result = await test.cacheableMethod();
    result = await test.cacheableMethod();
    expect(mockedGet).toBeCalledTimes(2);
    expect(mockedGet.mock.calls[0][0]).toBe("cacheableMethod/");
    expect(mockedGet.mock.calls[1][0]).toBe("cacheableMethod/");
    expect(mockedGet.mock.results[0].value).toBe(null);
    expect(mockedGet.mock.results[1].value).toBe(JSON.stringify("test"));
    expect(result).toBe("test");
  });

  test("should return the object value from cache", async () => {
    var test = new Test();
    const mockedGet = jest.fn();

    const expected = {
      name: {
        first: "John",
        last: "Doe",
      },

      age: 20,
    };

    mockedGet
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(JSON.stringify(expected));
    CacheManager.prototype.get = mockedGet;
    var result = await test.cacheableObject("John", "Doe", 20);
    result = await test.cacheableObject("John", "Doe", 20);
    expect(mockedGet).toBeCalledTimes(2);
    expect(mockedGet.mock.calls[0][0]).toBe("cacheableObject/John:Doe:20");
    expect(mockedGet.mock.calls[1][0]).toBe("cacheableObject/John:Doe:20");
    expect(mockedGet.mock.results[0].value).toBe(null);
    expect(mockedGet.mock.results[1].value).toBe(JSON.stringify(expected));
    expect(result).toEqual(expected);
  });

  test("should return the entity value from cache", async () => {
    var test = new Test();
    const mockedGet = jest.fn();
    CacheManager.prototype.get = mockedGet;
    mockedGet.mockResolvedValueOnce(null);
    var result = await test.cacheableEntity(100);
    mockedGet.mockResolvedValueOnce(JSON.stringify(result));
    var result2 = await test.cacheableEntity(100);
    expect(result2.id).toBe(result.id);
    expect(result2.testFunc()).toBe(1000);
  });

  test("should still return value if cache fails", async () => {
    var test = new Test();
    const mockedGet = jest.fn();
    CacheManager.prototype.get = mockedGet;
    mockedGet.mockRejectedValueOnce("Sadly cache failed :(");
    var result = await test.cacheableWithError();
    expect(result).toBe("test");
  });
});
