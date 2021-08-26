import { MikroORM } from "@mikro-orm/core";
import { MongoDriver, MongoEntityManager } from "@mikro-orm/mongodb";
import { singleton } from "tsyringe";
import { DebugLogger } from "../decorators/DebugLogger";

@singleton()
export class ORM {
  private mikroORM!: MikroORM<MongoDriver>;

  @DebugLogger
  public async init(): Promise<void> {
    this.mikroORM = await MikroORM.init({
      entities: ["./src/models/*.ts", "./src/models/embeddables/*.ts"],
      dbName: "Amazeful",
      type: "mongo",
      ensureIndexes: true,
      useBatchInserts: true,
      useBatchUpdates: true,

      driverOptions: {
        poolSize: process.env.NODE_ENV === "production" ? 100 : 5,
        ssl: process.env.NODE_ENV === "production"
      }
    });
  }

  public get em(): MongoEntityManager<MongoDriver> {
    return this.mikroORM.em;
  }

  public async close(): Promise<void> {
    return await this.mikroORM.close();
  }
}
