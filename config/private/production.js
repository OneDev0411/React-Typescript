// config/private/production.js

export default {
  app_url: process.env.APP_URL,
  api_host_local: process.env.API_HOST_LOCAL,
  app_name: process.env.APP_NAME,
  api: {
    url: process.env.RECHAT_API_URL,
    client_id: process.env.RECHAT_CLIENT_ID,
    client_secret: process.env.RECHAT_CLIENT_SECRET
  },
  forms: {
    url: process.env.RECHAT_FORMS_URL
  },
  redis: {
    url: process.env.REDIS_URL
  },
  crypto: {
    key: process.env.CRYPTO_KEY,
    iv: process.env.CRYPTO_IV
  },
  cosmicjs: {
    bucket: {
      slug: process.env.COSMIC_BUCKET,
      read_key: process.env.COSMIC_KEY
    }
  },
  intercom: {
    app_id: process.env.INTERCOM_APP_ID,
    secret_key: process.env.INTERCOM_SECRET_KEY
  },
  sentry: {
    key: process.env.SENTRY_API_URL
  }
}
