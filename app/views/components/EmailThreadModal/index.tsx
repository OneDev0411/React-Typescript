import React, { ReactNode, useEffect } from 'react'

import { Dialog } from '@material-ui/core'

import { DialogProps } from '@material-ui/core/Dialog'

import { getEmailThread } from 'models/email/get-email-thread'
import { useAsyncValue } from 'hooks/use-async-value'

import LoadingContainer from '../LoadingContainer'
import { EmailThread } from '../EmailThread'

interface Props extends DialogProps {
  /**
   * thread key is credential_id + thread_id
   */
  threadKey: string | null
}

/**
 * A modal for showing emails of an email threa. I't now assumed
 * that we always have the thread key so we moved the thread fetching to
 * this component. We can add support for directly passing thread emails
 * with a few lines of code though.
 */
export function EmailThreadModal({ open, threadKey, ...otherProps }: Props) {
  const [setThreadsPromise, thread, loading, error] = useAsyncValue<
    IEmailThread
  >()

  useEffect(() => {
    if (open && threadKey) {
      setThreadsPromise(getEmailThread(threadKey))
    }
  }, [setThreadsPromise, open, threadKey])

  let content: ReactNode = null

  if (loading) {
    content = <LoadingContainer style={{ minHeight: '15rem' }} />
  } else if (thread) {
    content = <EmailThread thread={thread} />
  } else if (error) {
    // TODO: error view
    content = ''
  }

  return (
    <Dialog open={open} fullWidth maxWidth="md" {...otherProps}>
      {content}
    </Dialog>
  )
}
