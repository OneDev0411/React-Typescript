import { useCallback, useEffect } from 'react'

import { useAsyncValue } from 'hooks/use-async-value'
import { getEmailCampaign } from 'models/email/get-email-campaign'
import { emailCampaignToThread } from 'models/email/helpers/email-campaign-to-thread'

/**
 * Loads an email campaign and normalizes it into an email thread
 */
export function useEmailCampaignThreadLoader(emailCampaignId) {
  const [setThreadsPromise, thread, loading, error] = useAsyncValue<
    IEmailThread
  >()

  const fetchThread = useCallback(() => {
    if (emailCampaignId) {
      setThreadsPromise(
        getEmailCampaign(emailCampaignId).then(emailCampaignToThread)
      )
    }
  }, [setThreadsPromise, emailCampaignId])

  useEffect(fetchThread, [fetchThread])

  return { thread, loading, error, fetchThread }
}
