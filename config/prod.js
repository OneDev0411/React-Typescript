// config/private.js
export default {
  api: {
    url: process.env.RECHAT_API_URL,
    client_id: process.env.RECHAT_CLIENT_ID,
    client_secret: process.env.RECHAT_CLIENT_SECRET
  },
  crypto: {
    pw_reset_key: process.env.RECHAT_CRYPTO_KEY,
    pw_reset_iv: process.env.RECHAT_CRYPTO_IV
  },
}