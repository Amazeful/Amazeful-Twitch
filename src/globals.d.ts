declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      BOTSTATUS: "default" | "knownBot" | "verifiedBot";
      USERNAME: string;
      PASSWORD: string;
    }
  }
}
