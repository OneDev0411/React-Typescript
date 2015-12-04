// config/production.js
export default {
  api: {
    url: process.env.RECHAT_API_URL,
    client_id: process.env.RECHAT_CLIENT_ID,
    client_secret: process.env.RECHAT_CLIENT_SECRET
  },
  crypto: {
    key: process.env.RECHAT_CRYPTO_KEY,
    iv: process.env.RECHAT_CRYPTO_IV
  },
}