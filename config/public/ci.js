export default {
  app: {
    url: process.env.APP_URL || 'http://localhost:8080'
  },
  api_url: process.env.API_URL || 'https://rechat-boer.herokuapp.com',
  socket: {
    server: process.env.SOCKET_SERVER || 'https://rechat-boer.herokuapp.com'
  },
  forms: {
    url:
      process.env.FORMS_URL || 'https://rechat-forms.s3-us-west-2.amazonaws.com'
  },
  store: {
    url: ''
  },
  images: {
    avatars: {
      cloudfront_url:
        process.env.IMAGES_AVATARS_CLOUDFRONT_URL ||
        'https://dzr6z49fv66hq.cloudfront.net',
      imgix_url:
        process.env.IMAGES_AVATARS_IMGIX_URL || 'https://rechat-test.imgix.net'
    }
  },
  branch: {
    key: process.env.BRANCH_KEY || 'dummy'
  },
  google: {
    api_key: process.env.GOOGLE_API_KEY || 'dummy'
  }
}
