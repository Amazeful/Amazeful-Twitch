export default {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.ts"],
  setupFilesAfterEnv: ["jest.setup.ts"],
  globals: {
    "ts-jest": {
      tsConfig: "./tsconfig.jest.json",
    },
  },
};
