import config from '../../../../../config/public'

export function convertToAbsoluteAttachmentUrl(url: string) {
  return `${config.api_url}/${url}`
}
