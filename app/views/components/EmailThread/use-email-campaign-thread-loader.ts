import { useCallback, useEffect } from 'react'

import { useAsyncValue } from 'hooks/use-async-value'
import { getEmailCampaign } from 'models/email/get-email-campaign'
import { getEmailCampaignEmail } from 'models/email/helpers/get-email-campaign-email'

import { getRecipientsFromRecipientsEntity } from '../EmailCompose/EditEmailDrawer/helpers/get-recipients-from-recipients-entity'
import { recipientToString } from '../EmailRecipientsChipsInput/helpers/recipient-to-string'

/**
 * Loads an email campaign and normalizes it into an email thread
 */
export function useEmailCampaignThreadLoader(
  emailCampaignId: string | undefined,
  /**
   * contactId: if provided, the only EmailCampaignEmails that are associated
   * to this contact will be fetched under `emails`
   */
  contactId?: string
) {
  const [setThreadsPromise, thread, loading, error] = useAsyncValue<{
    messages: IEmail<'html' | 'text'>[]
    subject: string
  }>()

  const fetchThread = useCallback(() => {
    if (emailCampaignId) {
      setThreadsPromise(
        getEmailCampaign(emailCampaignId, {
          emailFields: ['text', 'html'],
          contactId
        }).then(emailCampaign => {
          const email = getEmailCampaignEmail(emailCampaign)

          return email
            ? {
                messages: email ? [email] : [],
                subject: (email && email.subject) || ''
              }
            : {
                messages: [createEmailFromEmailCampaign(emailCampaign)],
                subject: emailCampaign.subject
              }
        })
      )
    }
  }, [emailCampaignId, setThreadsPromise, contactId])

  useEffect(fetchThread, [fetchThread])

  return { thread, loading, error, fetchThread }
}

/**
 * This is just hack for when email_campgian.emails is not fetched for some
 * reason.
 * It's originally added for https://gitlab.com/rechat/server/issues/1465.
 * and if https://gitlab.com/rechat/server/issues/1465 is fixed, we can
 * remove it. However we don't have to!
 *
 * Note that converting campaign object to email is technically wrong and
 * the data here is subject to inaccuracy.
 */
export function createEmailFromEmailCampaign(
  campaign: IEmailCampaign<
    IEmailCampaignAssociation,
    IEmailCampaignRecipientAssociation
  >
): IEmail<'html' | 'text'> {
  const to = getRecipientsFromRecipientsEntity('To', campaign.recipients)
  const cc = getRecipientsFromRecipientsEntity('CC', campaign.recipients)
  const bcc = getRecipientsFromRecipientsEntity('BCC', campaign.recipients)

  const user = campaign.from

  const from =
    user && user.display_name
      ? `${user.display_name} <${user.email}>`
      : user.email

  return {
    id: campaign.id,
    headers: {},
    campaign: campaign.id,
    accepted: 0,
    clicked: 0,
    complained: 0,
    failed: 0,
    opened: 0,
    delivered: 0,
    rejected: 0,
    stored: 0,
    unsubscribed: 0,
    created_at: campaign.created_at,
    domain: 'Marketing',
    google_id: null,
    microsoft_id: null,
    mailgun_id: '',
    tracking_id: '',
    type: 'email',
    html: campaign.html,
    is_read: false,
    text: campaign.text,
    to: to.map(recipientToString),
    subject: campaign.subject,
    cc: cc.map(recipientToString),
    bcc: bcc.map(recipientToString),
    from: from || '',
    attachments: campaign.attachments
  }
}
