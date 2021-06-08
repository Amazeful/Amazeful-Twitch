import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";
import { MongoDriver } from "@mikro-orm/mongodb";
import { Channel } from "../src/models/Channel";
import { User } from "../src/models/User";

var orm: MikroORM<IDatabaseDriver<Connection>>;
export async function dbSetUp() {
  orm = await MikroORM.init<MongoDriver>({
    entities: ["./src/models/**/*.ts"],
    dbName: "test",
    type: "mongo",
    driverOptions: {},
    useBatchInserts: true,
    useBatchUpdates: true,
    ensureIndexes: true,
  });
  var driver = orm.em.getDriver() as MongoDriver;
  await driver.dropCollections();
}

export async function getDatabase() {
  if (orm) {
    return orm;
  }
  await dbSetUp();
  return orm;
}
