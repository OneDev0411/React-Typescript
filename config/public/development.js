//** WARNING: This config will be publicly available in the browser **//
export default {
  app: {
    url: 'http://localhost:3000' // set to http://chappar.d.rechat.co
  },
  socket: {
    server: 'http://alpine.d.rechat.co:80' // this must match config.api.url
  },
  cosmicjs: {
    bucket: {
      slug: 'rechat',
      read_key: '1ocTAAAu6vpgLGfHTtVRRj0cno0feyveTJgJrrB7kuw0KcxOhA'
    }
  }
}