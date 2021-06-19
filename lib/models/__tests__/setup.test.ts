import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";
import { MongoDriver } from "@mikro-orm/mongodb";

var orm: MikroORM<IDatabaseDriver<Connection>>;
var id = 0;
export async function setupORM() {
  orm = await MikroORM.init<MongoDriver>({
    entities: ["./lib/models/*.ts", "./lib/models/embeddables/*.ts"],
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

export async function getORM() {
  if (orm) {
    return orm;
  }
  await setupORM();
  return orm;
}

export function getId(): number {
  id++;
  return id;
}
