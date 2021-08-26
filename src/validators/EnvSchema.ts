import Joi from "joi";

export const EnvSchema = Joi.object({
  NODE_ENV: Joi.string()
    .default("development")
    .valid("production", "development"),
  BOTSTATUS: Joi.string()
    .default("default")
    .valid("default", "knownBot", "verifiedBot"),
  USERNAME: Joi.string().required(),
  PASSWORD: Joi.string().required(),
  CLIENT_ID: Joi.string().required(),
  CLIENT_SECRET: Joi.string().required(),
  ACCESS_TOKEN: Joi.string().required(),
  REFRESH_TOKEN: Joi.string().required(),
  SHARD_ID: Joi.number().integer().default(0)
})
  .required()
  .label(".env file");
