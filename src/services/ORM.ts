import { MikroORM } from "@mikro-orm/core";
import { MongoDriver } from "@mikro-orm/mongodb";
import { singleton } from "tsyringe";

@singleton()
export class ORM extends MikroORM<MongoDriver> {
  constructor() {
    super({
      entities: ["./src/models/*.ts", "./src/models/embeddables/*.ts"],
      dbName:
        process.env.NODE_ENV === "production" ? "Amazeful" : "AmazefulDev",
      type: "mongo",
      ensureIndexes: process.env.NODE_ENV === "production",
      useBatchInserts: true,
      useBatchUpdates: true,

      driverOptions: {
        poolSize: process.env.NODE_ENV === "production" ? 100 : 5,
        ssl: process.env.NODE_ENV === "production",
      },
    });
  }
}
