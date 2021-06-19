import Joi from "joi";

export const EnvSchema = Joi.object({
  NODE_ENV: Joi.string()
    .default("production")
    .valid("production", "development"),
  BOTSTATUS: Joi.string()
    .default("default")
    .valid("default", "knownBot", "verifiedBot"),
  USERNAME: Joi.string().required(),
  PASSWORD: Joi.string().required(),
})
  .required()
  .label("env file");
