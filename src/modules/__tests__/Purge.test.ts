import { Channel } from "../../models/Channel";
import { Purge } from "../Purge";
describe("./modules/Purge", () => {
  test("should throw with invalid options", () => {
    let purge = new Purge(new Channel());
    purge.purge({
      lookbackTime: 10,
      timeoutDuration: "nam",
      phrase: "nam",
      modName: "amazeful",
      regex: false,
      continuous: false,
      continuousTime: 10,
    });
  });
});
