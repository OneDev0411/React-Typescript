//** WARNING: This config will be publicly available in the browser **//
export default {
  app: {
    url: process.env.APP_URL // set to http://chappar.d.rechat.co
  },
  socket: {
    server: process.env.SOCKET_SERVER // this must match config.api.url
  }
}