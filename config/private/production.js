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
  intercom: {
    app_id: process.env.INTERCOM_APP_ID,
    secret_key: process.env.INTERCOM_SECRET_KEY
  },
  fb: {
    app_id: process.env.FB_APP_ID
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
    token: process.env.PRERENDER_TOKEN
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
