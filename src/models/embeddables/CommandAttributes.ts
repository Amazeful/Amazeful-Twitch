import { Embeddable, Property } from "@mikro-orm/core";

@Embeddable()
export class CommandAttributes {
  @Property()
  count = 0;
}
