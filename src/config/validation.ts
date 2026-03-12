import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').required(),

  PORT: Joi.number().required(),

  MONGO_URI: Joi.string().required(),

  JWT_SECRET_KEY: Joi.string().required(),

  JWT_EXPIRE_TIME: Joi.string().required(),

  // Global Rate Limiter
  RATE_LIMIT_TTL: Joi.number().default(60000),
  RATE_LIMIT_LIMIT: Joi.number().default(60),

  // Auth Rate Limiter
  AUTH_RATE_LIMIT_TTL: Joi.number().default(60000),
  AUTH_RATE_LIMIT_LIMIT: Joi.number().default(5),

  // Upload Rate Limiter
  UPLOAD_RATE_LIMIT_TTL: Joi.number().default(60000),
  UPLOAD_RATE_LIMIT_LIMIT: Joi.number().default(6),
});