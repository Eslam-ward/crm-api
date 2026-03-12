export default () => ({
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
  },

  database: {
    uri: process.env.MONGO_URI,
  },

  jwt: {
    secret: process.env.JWT_SECRET_KEY,
    expiresIn: process.env.JWT_EXPIRE_TIME,
  },

  refreshToken: {
    secret: process.env.JWT_REFRESH_SECRET_KEY,
    expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME,
  },

  rateLimit: {
    ttl: process.env.RATE_LIMIT_TTL
      ? parseInt(process.env.RATE_LIMIT_TTL, 10)
      : 60000,

    limit: process.env.RATE_LIMIT_LIMIT
      ? parseInt(process.env.RATE_LIMIT_LIMIT, 10)
      : 100,
  },

  authRateLimit: {
    ttl: process.env.AUTH_RATE_LIMIT_TTL
      ? parseInt(process.env.AUTH_RATE_LIMIT_TTL, 10)
      : 60000,

    limit: process.env.AUTH_RATE_LIMIT_LIMIT
      ? parseInt(process.env.AUTH_RATE_LIMIT_LIMIT, 10)
      : 5,
  },
});