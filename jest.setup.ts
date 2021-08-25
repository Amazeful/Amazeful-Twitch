import "reflect-metadata";
jest.mock("./src/twitch/Twitch.ts");
jest.mock("./src/twitch/ChatClient.ts");
jest.mock("./src/services/Agenda.ts");
jest.mock("./src/services/ORM.ts");
jest.mock("./src/services/CahceManager.ts");
