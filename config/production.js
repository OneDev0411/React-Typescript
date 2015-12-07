// config/production.js
export default {
  api: {
    url: process.env.RECHAT_API_URL,
    client_id: process.env.RECHAT_CLIENT_ID,
    client_secret: process.env.RECHAT_CLIENT_SECRET
  },
  crypto: {
    key: process.env.CRYPTO_KEY,
    iv: process.env.CRYPTO_IV
  },
}