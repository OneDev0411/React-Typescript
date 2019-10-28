import config from '../../../../../config/public'

/**
 * too roohet Saeed! :D It should be absolute url from the server.
 * we need to check if it's already absolute, because when we normalize
 * email campaigns into threads, the urls are absolute.
 * @param url
 */
export function convertToAbsoluteAttachmentUrl(url: string) {
  return url.indexOf('http') === 0 ? url : `${config.api_url}/${url}`
}
