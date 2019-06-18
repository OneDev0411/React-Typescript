/* eslint-disable */
// config/private/development.js
export default {
  app_url: process.env.APP_URL || 'http://localhost:8080',
  api_url: process.env.API_URL || 'https://rechat-boer.herokuapp.com',
  app_name: process.env.APP_NAME || 'Rechat Web',
  api: {
    url: process.env.API_URL || 'https://rechat-boer.herokuapp.com',
    client_id: process.env.API_CLIENT_ID || 'dummy',
    client_secret: process.env.API_CLIENT_SECRET || 'secret'
  },
  forms: {
    url: process.env.FORMS_URL || 'https://rechat-forms.s3-us-west-2.amazonaws.com'
  },
  crypto: {
    key: process.env.CRYPTO_KEY || '',
    iv: process.env.CRYPTO_KEY || ''
  },
  sentry: {
    url: process.env.SENTRY_URL || ''
  },
  intercom: {
    app_id: process.env.INTERCOM_APP_ID || 'dummy',
    secret_key: process.env.INTERCOM_SECRET_KEY || 'dummy'
  },
  mailgun: {
    api_key: process.env.MAILGUN_API_KEY || 'dummy',
    domain_url: process.env.MAILGUN_DOMAIN_URL || 'rechat.com'
  }
}
