import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { MongoDriver } from "@mikro-orm/mongodb";

var orm: MikroORM<MongoDriver>;
var id = 0;
export async function setupORM() {
  orm = await MikroORM.init<MongoDriver>({
    entities: ["./src/models/*.ts", "./src/models/embeddables/*.ts"],
    dbName: "test",
    type: "mongo",
    ensureIndexes: true,
    useBatchInserts: true,
    useBatchUpdates: true,
    driverOptions: {
      poolSize: 5,
      ssl: false,
    },
  });

  var driver = orm.em.getDriver();

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
