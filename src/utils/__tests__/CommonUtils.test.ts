import { CommonUtils } from "../CommonUtils";
describe("./utils/CommonUtils", () => {
  test("#isDefined(): should return false for undefined", () => {
    let value;

    expect(CommonUtils.isDefined(value)).toBe(false);
  });

  test("#isDefined(): should return false for null", () => {
    const value = null;

    expect(CommonUtils.isDefined(value)).toBe(false);
  });

  test("#isDefined(): should return true for any other value", () => {
    const value = 1;

    expect(CommonUtils.isDefined(value)).toBe(true);
  });

  test("#isNull(): should return true for null", () => {
    const value = null;

    expect(CommonUtils.isNull(value)).toBe(true);
  });

  test("#isNull(): should return false for undefined", () => {
    let value;

    expect(CommonUtils.isNull(value)).toBe(false);
  });

  test("#isNull(): should return false for any other value", () => {
    const value = 1;

    expect(CommonUtils.isNull(value)).toBe(false);
  });
});
