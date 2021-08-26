import { Logger, LogLevel } from "../../utils/Logger";
import { DebugLogger } from "../DebugLogger";

class TestClass {
  @DebugLogger
  public test() {
    return "test";
  }
}
describe("./decorators/DebugLogger", () => {
  test("Should call the logger", () => {
    const mockLog = jest.fn();
    Logger.log = mockLog;

    const testClass = new TestClass();

    testClass.test();

    expect(mockLog).toBeCalled();
    expect(mockLog.mock.calls[0][0]).toBe(LogLevel.DEBUG);
    expect(mockLog.mock.calls[0][1]).toBe("test called with: <No Args>");
    expect(mockLog.mock.calls[0][2]).toBe("TestClass");
  });
});
