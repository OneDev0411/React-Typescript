import config from '../../../../../config/public'

const origin2Slug = {
  outlook: 'microsoft',
  gmail: 'google'
}

// TODO: I talked with Saeed and we agreed that API should add a `download_url`
// or `url` to attachment objects instead of this
export function getAttachmentUrl(
  email: IEmailThreadEmail,
  attachment: IEmailAttachment
) {
  return `${config.api_url}/users/self/${origin2Slug[email.origin]}/${
    email.owner
  }/messages/${email.message_id}/attachments/${attachment.id}`
}
