export default {
  app_url: process.env.APP_URL,
  api_url: process.env.API_URL,
  app_name: process.env.APP_NAME,
  api: {
    url: process.env.API_URL,
    client_id: process.env.API_CLIENT_ID,
    client_secret: process.env.API_CLIENT_SECRET
  },
  forms: {
    url: process.env.FORMS_URL
  },
  crypto: {
    key: process.env.CRYPTO_KEY,
    iv: process.env.CRYPTO_KEY
  },
  sentry: {
    url: process.env.SENTRY_URL
  },
  intercom: {
    app_id: process.env.INTERCOM_APP_ID,
    secret_key: process.env.INTERCOM_SECRET_KEY
  },
  mailgun: {
    api_key: process.env.MAILGUN_API_KEY,
    domain_url: process.env.MAILGUN_DOMAIN_URL
  }
}
