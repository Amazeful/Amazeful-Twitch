import { ValidationError } from "joi";
import { Channel } from "../../models/Channel";
import { PurgeConfig } from "../../models/PurgeConfig";
import { Purge } from "../Purge";
describe("./modules/Purge", () => {
  test("should throw with invalid options", () => {
    const purge = new Purge(new Channel());

    purge["config"] = new PurgeConfig();
    expect(() =>
      purge.purge({
        lookbackTime: 10,
        timeoutDuration: "nam",
        phrase: "nam",
        modName: "amazeful",
        regex: false,
        continuous: false,
        continuousTime: 10
      })
    ).toThrowError(ValidationError);
  });
});
