import { Embeddable, Property } from "@mikro-orm/core";

@Embeddable()
export class CommandAttributes {
  @Property()
  count: number = 0;
}
