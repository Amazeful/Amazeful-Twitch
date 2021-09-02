import { singleton } from "tsyringe";
import { AutoWired } from "../decorators/AutoWired";
import { User } from "../models/User";
import { ORM } from "./ORM";

@singleton()
export class Admin {
  @AutoWired private orm!: ORM;
  private admins: User[];

  constructor() {
    this.admins = [];
  }

  public async init(): Promise<void> {
    const repository = this.orm.em.getRepository(User);
    this.admins = await repository.find({ admin: true });
  }

  public isAdmin(username: string): boolean {
    return this.admins.some((u) => u.login === username);
  }
}
