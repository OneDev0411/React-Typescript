export default {
  app: {
    url: process.env.APP_URL
  },
  api_url: process.env.API_URL,
  socket: {
    server: process.env.SOCKET_SERVER
  },
  forms: {
    url: process.env.FORMS_URL
  },
  store: {
    url: ''
  },
  images: {
    avatars: {
      cloudfront_url: process.env.IMAGES_AVATARS_CLOUDFRONT_URL,
      imgix_url: process.env.IMAGES_AVATARS_IMGIX_URL
    }
  },
  branch: {
    key: process.env.BRANCH_KEY
  },
  google: {
    api_key: process.env.GOOGLE_API_KEY
  },
  tenor: {
    api_key: process.env.TENOR_API_KEY
  },
  unsplash: {
    api_key: process.env.UNSPLASH_API_KEY
  },
  dropbox: {
    api_key: process.env.DROPBOX_APP_KEY
  },
  stripe: {
    public_key: process.env.STRIPE_PUBLIC_KEY
  }
}
