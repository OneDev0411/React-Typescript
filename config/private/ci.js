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
  },
  my_marketing_matters: {
    duns: process.env.MY_MARKETING_MATTERS_DUNS,
    shared_secret: process.env.MY_MARKETING_MATTERS_SHARED_SECRET
  },
  prerender: {
    shared_secret: process.env.PRERENDER_TOKEN
  },
  live_by: {
    api_url: process.env.LIVE_BY_API_URL,
    api_client_id: process.env.LIVE_BY_API_CLIENT_ID,
    api_key: process.env.LIVE_BY_API_KEY
  },
  stripe: {
    public_key: process.env.STRIPE_PUBLIC_KEY
  },
  mapbox: {
    access_token: process.env.MAPBOX_ACCESS_TOKEN
  },
  showing: {
    booking_url: process.env.SHOWING_BOOKING_URL
  },
  aws: {
    access_key_id: process.env.AWS_ACCESS_KEY_ID,
    secret_access_key: process.env.AWS_SECRET_ACCESS_KEY
  },
  videobolt: {
    key: process.env.VIDEOBOLT_KEY
  }
}
