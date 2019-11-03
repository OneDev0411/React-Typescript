import { useCallback, useEffect } from 'react'

import { useAsyncValue } from 'hooks/use-async-value'
import { getEmailThread } from 'models/email/get-email-thread'

/**
 * loads an email thread by threadKey
 */
export function useEmailThreadLoader(threadKey) {
  const [setThreadsPromise, thread, loading, error] = useAsyncValue<
    IEmailThread
  >()

  const fetchThread = useCallback(() => {
    if (threadKey) {
      setThreadsPromise(getEmailThread(threadKey))
    }
  }, [setThreadsPromise, threadKey])

  useEffect(fetchThread, [fetchThread])

  return { thread, loading, error, fetchThread }
}
