import React, { ReactNode, useEffect } from 'react'

import { Box, createStyles, Dialog, makeStyles, Theme } from '@material-ui/core'

import { DialogProps } from '@material-ui/core/Dialog'

import { getEmailThread } from 'models/email/get-email-thread'
import { useAsyncValue } from 'hooks/use-async-value'

import LoadingContainer from '../LoadingContainer'
import { EmailThread } from '../EmailThread'
import { DialogTitle } from '../DialogTitle'

interface Props extends DialogProps {
  /**
   * thread key is credential_id + thread_id
   */
  threadKey: string | null
}

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      dialogPaper: {
        // without this,  weird scroll behavior is observed when reply is open
        overflow: 'hidden'
      }
    }),
  { name: 'EmailThreadModal' }
)
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

  const classes = useStyles()

  useEffect(() => {
    if (open && threadKey) {
      setThreadsPromise(getEmailThread(threadKey))
    }
  }, [setThreadsPromise, open, threadKey])

  let content: ReactNode = null

  if (loading) {
    content = <LoadingContainer style={{ minHeight: '15rem' }} />
  } else if (thread) {
    content = (
      <>
        <DialogTitle
          onClose={event => {
            otherProps.onClose && otherProps.onClose(event, 'escapeKeyDown')
          }}
        >
          {thread[0] && thread[0].subject}
        </DialogTitle>
        <Box overflow="auto">
          <EmailThread thread={thread} />
        </Box>
      </>
    )
  } else if (error) {
    // TODO: error view
    content = 'Could not load emails'
  }

  return (
    <Dialog
      open={open}
      fullWidth
      classes={{ paper: classes.dialogPaper }}
      maxWidth="md"
      {...otherProps}
    >
      {content}
    </Dialog>
  )
}
