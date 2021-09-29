import { MikroORM, AnyEntity, FilterQuery, EntityName } from "@mikro-orm/core";
import { MongoDriver, MongoEntityManager } from "@mikro-orm/mongodb";
import { singleton } from "tsyringe";
import { DebugLogger } from "../decorators/DebugLogger";
import { CommonUtils } from "../utils/CommonUtils";

@singleton()
export class ORM {
  private mikroORM!: MikroORM<MongoDriver>;

  @DebugLogger
  public async init(): Promise<void> {
    this.mikroORM = await MikroORM.init({
      entitiesTs: ["./src/models/*.ts", "./src/models/embeddables/*.ts"],
      entities: ["./bin/models/*.ts", "./bin/models/embeddables/*.ts"],
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
    return this.mikroORM.close();
  }

  /**
   * Finds one from db, if it doesn't exist, it creates one
   * @param entity
   * @param query
   * @param newEntity
   */
  public async findOneOrCreate<Entity extends AnyEntity>(
    entity: EntityName<Entity>,
    query: FilterQuery<Entity>,
    newEntity: Entity
  ): Promise<Entity> {
    let data: Entity | null = await this.em.findOne(entity, query);

    if (!CommonUtils.isDefined(data)) {
      data = newEntity;
      await this.em.persistAndFlush(data);
    }

    return data;
  }
}
