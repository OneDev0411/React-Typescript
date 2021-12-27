export default {
  app_name: process.env.APP_NAME!,
  api_url: process.env.RECHAT_API_URL!,
  client_id: process.env.RECHAT_CLIENT_ID!,
  client_secret: process.env.RECHAT_CLIENT_SECRET!,
  crypto_key: process.env.CRYPTO_KEY,
  crypto_iv: process.env.CRYPTO_IV,
  forms_url: process.env.RECHAT_FORMS_URL!,
  live_by_api_url: process.env.LIVE_BY_API_URL!,
  live_by_api_client_id: process.env.LIVE_BY_API_CLIENT_ID!,
  live_by_api_key: process.env.LIVE_BY_API_KEY!,
  my_marketing_matters_duns: process.env.MY_MARKETING_MATTERS_DUNS!,
  my_marketing_matters_shared_secret:
    process.env.MY_MARKETING_MATTERS_SHARED_SECRET!,
  prerender_token: process.env.PRERENDER_TOKEN!,
  prerender_service_url: process.env.PRERENDER_SERVICE_URL!
}
