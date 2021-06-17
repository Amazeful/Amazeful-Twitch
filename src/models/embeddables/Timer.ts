import { Embeddable, Property, Enum } from "@mikro-orm/core";
import { StreamStatus } from "../../types/StreamStatus";

@Embeddable()
export class Timer {
  @Property()
  enabled: boolean = false;

  @Property()
  minMessages: number = 10;

  @Property()
  interval: number = 3;

  @Enum(() => StreamStatus)
  streamStatus: StreamStatus = StreamStatus.ANY;
}
