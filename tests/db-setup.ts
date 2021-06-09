import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";
import { MongoDriver } from "@mikro-orm/mongodb";

var orm: MikroORM<IDatabaseDriver<Connection>>;
export async function dbSetUp() {
  orm = await MikroORM.init<MongoDriver>({
    entities: ["./src/models/**/*.ts"],
    dbName: "test",
    type: "mongo",
    ensureIndexes: true,
    useBatchInserts: true,
    useBatchUpdates: true,
  });
  var driver = orm.em.getDriver() as MongoDriver;
  await driver.dropCollections();
  await driver.ensureIndexes();
}

export async function getDatabase() {
  if (orm) {
    return orm;
  }
  await dbSetUp();
  return orm;
}
