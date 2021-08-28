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
      Joi.string().lowercase().required().valid("ban")
    )
    .required()
    .label("timeout duration"),
  phrase: Joi.string().min(3).required(),
  regex: Joi.boolean().required(),
  modName: Joi.string().required(),
  continuous: Joi.boolean().required(),
  continuousTime: Joi.number()
    .integer()
    .min(10)
    .max(600)
    .required()
    .label("continuous time")
})
  .required()
  .label("Purge Options");
