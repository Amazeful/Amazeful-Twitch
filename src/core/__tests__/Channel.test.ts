import { Channel } from "../Channel";
import { Module } from "../../types/Module";

let channel: Channel;

beforeAll(async () => {
  await Channel.populateModuleContainer();
});
beforeEach(() => {
  channel = new Channel();
});

describe("./core/Channel", () => {
  test("registerModules(): should register all modules", async () => {
    channel.registerModules();
    expect(Object.keys(channel["modules"]).length).toBeGreaterThan(0);
    expect(Object.values(channel["modules"])[0]).toBeInstanceOf(Module);
  });

  test("registerHandlers(): should register all handlers", async () => {
    channel.registerModules();
    channel.registerHandlers();
    expect(Object.keys(channel["messageHandlers"]).length).toBeGreaterThan(0);
  });
});
