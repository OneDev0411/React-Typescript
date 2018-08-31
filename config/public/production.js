// config/public/production.js
export default {
  app: {
    url: process.env.APP_URL,
    share_url: process.env.APP_SHARE_URL
  },
  api_url: process.env.RECHAT_API_URL,
  socket: {
    server: process.env.SOCKET_SERVER
  },
  store: {
    url: process.env.RECHAT_STORE_URL
  },
  forms: {
    url: process.env.RECHAT_FORMS_URL,
    files: process.env.RECHAT_FORMS_FILES
  },
  cosmicjs: {
    bucket: {
      slug: process.env.COSMIC_BUCKET,
      read_key: process.env.COSMIC_KEY
    }
  },
  images: {
    avatars: {
      cloudfront_url: process.env.CLOUDFRONT_URL, // https://d2j29n432zojb.cloudfront.net (production) or https://dzr6z49fv66hq.cloudfront.net (test)
      imgix_url: process.env.IMGIX_URL // https://avatars.imgix.net (production) or https://avatars-test.imgix.net (test)
    }
  },
  branch: {
    key: process.env.BRANCH_KEY
  },
  itunes_url: process.env.ITUNES_URL,
  google: {
    api_key: process.env.GOOGLE_API_KEY
  }
}
