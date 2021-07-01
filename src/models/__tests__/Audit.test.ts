import { Audit } from "../Audit";
import { setupORM, getORM, getId } from "../../jest.setup";
import { AuditLogCategory } from "../../types/AuditLogCategory";
import { Roles } from "../../types/Roles";

beforeAll(async () => {
  return setupORM();
});

afterAll(async () => {
  var orm = await getORM();
  orm.close();
});

describe("./models/Audit", () => {
  test("create audit logs", async () => {
    var orm = await getORM();
    let repository = orm.em.getRepository(Audit);

    repository.persist(
      new Audit(
        AuditLogCategory.BOT,
        "silence",
        "Enabled silent mode",
        Roles.ADMIN,
        "amazeful"
      )
    );

    repository.persist(
      new Audit(
        AuditLogCategory.BOT,
        "unsilence",
        "Disabled silent mode",
        Roles.ADMIN,
        "amazeful"
      )
    );

    repository.persist(
      new Audit(
        AuditLogCategory.BOT,
        "join",
        "joined channel",
        Roles.BROADCASTER,
        "forsen"
      )
    );

    await repository.flush();

    orm.em.clear();
    var records = await repository.findAll();

    expect(records.length).toBe(3);
  });
});
