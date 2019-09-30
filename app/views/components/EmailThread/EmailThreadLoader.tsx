import React, { ReactNode, useEffect } from 'react'

import { useAsyncValue } from 'hooks/use-async-value'
import { getEmailThread } from 'models/email/get-email-thread'

import LoadingContainer from '../LoadingContainer'
import { ServerError } from '../ServerError'

interface Props {
  /**
   * thread key is credential_id + thread_id
   */
  threadKey: string | null
  children: (thread: IEmailThread) => ReactNode
}

/**
 * Loads an email thread, handles UI for loading and error states and
 * delegates thread rendering to outside via children props
 */
export function EmailThreadLoader({ threadKey, children }: Props) {
  const [setThreadsPromise, thread, loading, error] = useAsyncValue<
    IEmailThread
  >()

  useEffect(() => {
    if (threadKey) {
      setThreadsPromise(getEmailThread(threadKey))
    }
  }, [setThreadsPromise, threadKey])

  if (loading) {
    return <LoadingContainer style={{ minHeight: '15rem' }} />
  }

  if (thread) {
    return <>{children(thread)}</>
  }

  if (error) {
    return (
      <ServerError
        error={error}
        onRetry={() =>
          threadKey && setThreadsPromise(getEmailThread(threadKey))
        }
      />
    )
  }

  return null
}
