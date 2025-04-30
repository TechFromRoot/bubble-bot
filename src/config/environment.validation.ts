import * as Joi from "joi";

export default Joi.object({
    NODE_ENV: Joi.string().valid("development", "test", "production", "staging")
        .default("development"),
    PORT: Joi.number().port().default(3000),
    TELEGRAM_BOT_TOKEN: Joi.string().required()
});