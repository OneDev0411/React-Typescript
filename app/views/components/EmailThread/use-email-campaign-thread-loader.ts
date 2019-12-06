import { useCallback, useEffect } from 'react'

import { useAsyncValue } from 'hooks/use-async-value'
import { getEmailCampaign } from 'models/email/get-email-campaign'
import { getEmailCampaignEmail } from 'models/email/helpers/get-email-campaign-email'

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

          return {
            messages: email ? [email] : [],
            subject: (email && email.subject) || ''
          }
        })
      )
    }
  }, [emailCampaignId, setThreadsPromise, contactId])

  useEffect(fetchThread, [fetchThread])

  return { thread, loading, error, fetchThread }
}
