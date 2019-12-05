import { useCallback, useEffect } from 'react'

import { useAsyncValue } from 'hooks/use-async-value'
import { getEmailCampaign } from 'models/email/get-email-campaign'
import { getEmailCampaignEmail } from 'models/email/helpers/get-email-campaign-email'

/**
 * Loads an email campaign and normalizes it into an email thread
 */
export function useEmailCampaignThreadLoader(
  emailCampaignId: string | undefined
) {
  const [setThreadsPromise, thread, loading, error] = useAsyncValue<{
    messages: IEmail<'html' | 'text'>[]
    subject: string
  }>()

  const fetchThread = useCallback(() => {
    if (emailCampaignId) {
      setThreadsPromise(
        getEmailCampaign(emailCampaignId, undefined, undefined, undefined, [
          'text',
          'html'
        ]).then(emailCampaign => {
          const email = getEmailCampaignEmail(emailCampaign)

          return {
            messages: email ? [email] : [],
            subject: (email && email.subject) || ''
          }
        })
      )
    }
  }, [setThreadsPromise, emailCampaignId])

  useEffect(fetchThread, [fetchThread])

  return { thread, loading, error, fetchThread }
}
