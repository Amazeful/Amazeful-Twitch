import { MikroORM } from "@mikro-orm/core";
import { MongoDriver } from "@mikro-orm/mongodb";
import { singleton } from "tsyringe";

@singleton()
export class ORM extends MikroORM<MongoDriver> {
  constructor() {
    super({
      entities: ["./src/models/*.ts", "./src/models/embeddables/*.ts"],
      dbName: "Amazeful",
      type: "mongo",
      ensureIndexes: true,
      useBatchInserts: true,
      useBatchUpdates: true,

      driverOptions: {
        poolSize: 100,
        ssl: false,
      },
    });
  }
}
