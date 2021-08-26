import { Embeddable, Property, Enum } from "@mikro-orm/core";
import { StreamStatus } from "../../types/StreamStatus";

@Embeddable()
export class Timer {
  @Property()
  enabled = false;

  @Property()
  minMessages = 10;

  @Property()
  interval = 3;

  @Enum(() => StreamStatus)
  streamStatus: StreamStatus = StreamStatus.ANY;
}
