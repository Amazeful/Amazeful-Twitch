import { ChannelBot } from "../ChannelBot";
import { Module } from "../../types/Module";
import { Channel } from "../../models/Channel";

let channel: ChannelBot;

beforeAll(async () => {
  await ChannelBot.populateModuleContainer();
});
beforeEach(() => {
  channel = new ChannelBot(new Channel());
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
