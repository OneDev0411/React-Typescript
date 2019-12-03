import { getRecipientsFromRecipientsEntity } from 'components/EmailCompose/EditEmailDrawer/helpers/get-recipients-from-recipients-entity'
import { recipientToString } from 'components/EmailRecipientsChipsInput/helpers/recipient-to-string'

function fileToEmailAttachment(attachment: IFile): IEmailAttachment {
  return {
    url: attachment.url,
    id: '',
    cid: '',
    size: 0,
    isInline: false,
    contentType: attachment.mime,
    name: attachment.name
  }
}

export function emailCampaignToThread(
  campaign: IEmailCampaign<
    IEmailCampaignAssociation,
    IEmailCampaignRecipientAssociation
  >
): IEmailThread<'messages'> {
  const to = getRecipientsFromRecipientsEntity('To', campaign.recipients)
  const cc = getRecipientsFromRecipientsEntity('CC', campaign.recipients)
  const bcc = getRecipientsFromRecipientsEntity('BCC', campaign.recipients)

  const attachments = campaign.attachments

  return {
    message_count: 1,
    recipients: [...to, ...cc, ...bcc].map(recipientToString),
    subject: campaign.subject,
    brand: campaign.brand,
    first_message_date: campaign.due_at,
    last_message_date: campaign.due_at,
    google_credential: undefined,
    microsoft_credential: undefined,
    messages: [
      {
        /**
         * The following section are properties that doesn't have a correspondence
         * in email threads. Instead of setting them to empty strings, a better
         * approach is to add another type, say EmailThreadLike, which omits
         * these fields from IEmailThread from it and then use that type in
         * email thread components. But it's not done because we agreed to unify
         * email campaigns and email threads and probably any effort on this
         * stuff will be removed later and is a waste of time.
         */
        thread_id: '',
        message_id: '',
        internet_message_id: '',
        snippet: '',
        thread_key: '',
        id: '',
        unique_body: '',
        // ///////////////////////////////////////////////////////////////////////

        has_attachments: !!attachments && attachments.length > 0,
        attachments: (attachments || []).map(fileToEmailAttachment),
        html_body: campaign.html,
        subject: campaign.subject,
        in_bound: false,
        message_date: campaign.due_at,
        text_body: '',
        from: `${campaign.from.display_name} <${campaign.from.email}>`,
        to: to.map(recipientToString),
        cc: cc.map(recipientToString),
        bcc: bcc.map(recipientToString)
      }
    ]
  }
}
