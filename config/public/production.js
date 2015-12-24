export default {
  app: {
    url: process.env.APP_URL
  },
  socket: {
    server: process.env.SOCKET_SERVER
  },
  cosmicjs: {
    bucket: {
      slug: process.env.COSMIC_BUCKET,
      read_key: process.env.COSMIC_KEY
    }
  }
}