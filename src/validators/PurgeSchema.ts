import Joi from "joi";

export const PurgeSchema = Joi.object({
  lookbackTime: Joi.number()
    .integer()
    .min(10)
    .max(600)
    .required()
    .label("lookback time"),
  timeoutDuration: Joi.alternatives()
    .try(
      Joi.number().integer().min(1).max(1209600).required(),
      Joi.string().lowercase().required().valid("ban", "delete")
    )
    .required()
    .label("timeout duration"),
  pattern: Joi.string().min(3).required(),
  regex: Joi.boolean().required(),
  modName: Joi.string().required(),
  caseSensitive: Joi.boolean().default(false),
  continuousTime: Joi.number()
    .integer()
    .min(10)
    .max(600)
    .required()
    .label("continuous time")
})
  .required()
  .label("Purge Options");
