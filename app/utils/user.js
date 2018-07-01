import config from '../../config/public'

export function getResizeAvatarUrl(full_size_url) {
  if (!full_size_url) {
    return ''
  }

  let image_replace = full_size_url.split('/').slice(-1)[0]
  const imgix_url = config.images.avatars.imgix_url + '/' + image_replace
  return imgix_url
}

export default {
  getResizeAvatarUrl
}

export function isOnline(user) {
  // Enums: ['Online', 'Background', 'Offline'] - P.S: Background also is

  if (user.online_state === 'Offline') {
    return false
  }

  return true
}