import { Logger, LogLevel } from "../../utils/Logger";
import { TryCatchLog } from "../TryCatchLog";

class TestClass {
  @TryCatchLog
  public test() {
    throw new Error("failed");
  }
}
describe("./decorators/TryCathLog", () => {
  test("Should call the logger twice", () => {
    const mockLog = jest.fn();
    Logger.log = mockLog;

    const testClass = new TestClass();

    //should NOT throw
    testClass.test();
    expect(mockLog).toHaveBeenCalledTimes(2);
    //Should debug log the function call data
    expect(mockLog.mock.calls[0][0]).toBe(LogLevel.DEBUG);
    expect(mockLog.mock.calls[0][1]).toBe("test called with: <No Args>");
    expect(mockLog.mock.calls[0][2]).toBe("TestClass");

    //Then it should catch and logs errors
    expect(mockLog.mock.calls[1][0]).toBe(LogLevel.ERROR);
    expect(mockLog.mock.calls[1][1]).toBe("test Error: failed");
    expect(mockLog.mock.calls[1][2]).toBe("TestClass");
  });
});
