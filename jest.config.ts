export default {
  preset: "ts-jest",
  modulePathIgnorePatterns: ["<rootDir>/bin", "<rootDir>/node_modules"],
  testEnvironment: "node",
  clearMocks: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.ts"],
  setupFilesAfterEnv: ["./jest.setup.ts"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.jest.json"
    }
  }
};
