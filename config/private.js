// config/private.js
export default {
  api: {
    url: process.env.RECHAT_API_URL || "http://localhost:3078",
    client_id: process.env.RECHAT_CLIENT_ID || "bf0da47e-7226-11e4-905b-0024d71b10fc",
    client_secret: process.env.RECHAT_CLIENT_SECRET || "secret"
  },
  test: {
    user: {
      email: 'tony@rechat.co',
      password: 'testpass'
    }
  }
}