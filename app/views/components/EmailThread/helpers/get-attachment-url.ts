import config from '../../../../../config/public'

export function getAttachmentUrl(attachment: IEmailAttachment) {
  return `${config.api_url}/${attachment.url}`
}
