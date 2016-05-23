import config from '../../config/public'
export default {
  getResizeAvatarUrl(full_size_url) {
    if (!full_size_url)
      return ''
    let image_replace = full_size_url.replace(config.images.avatars.cloudfront_url + '/','')
    const imgix_url = config.images.avatars.imgix_url + '/' + image_replace
    return imgix_url
  }
}