

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
    expiresIn: process.env.JWT_EXPIRE_TIME, // example: '1d'
  },

  refreshToken: {
    secret: process.env.JWT_REFRESH_SECRET_KEY,
    expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME, // example: '7d'
  },

//   mail: {
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT
//       ? parseInt(process.env.SMTP_PORT, 10)
//       : undefined,
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },

//   rateLimit: {
//     ttl: process.env.RATE_LIMIT_TTL
//       ? parseInt(process.env.RATE_LIMIT_TTL, 10)
//       : 60,
//     limit: process.env.RATE_LIMIT_MAX
//       ? parseInt(process.env.RATE_LIMIT_MAX, 10)
//       : 10,
//   },
});
