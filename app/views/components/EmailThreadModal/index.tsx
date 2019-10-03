import React from 'react'

import { Box, Dialog } from '@material-ui/core'

import { DialogProps } from '@material-ui/core/Dialog'

import { EmailThread, EmailThreadLoader } from '../EmailThread'
import { DialogTitle } from '../DialogTitle'

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
  return (
    <Dialog
      disableEnforceFocus
      disableBackdropClick
      open={open}
      fullWidth
      maxWidth="md"
      {...otherProps}
    >
      <EmailThreadLoader threadKey={threadKey}>
        {({ thread, onEmailSent }) => (
          <>
            <DialogTitle
              onClose={event => {
                otherProps.onClose && otherProps.onClose(event, 'escapeKeyDown')
              }}
            >
              {(thread[0] && thread[0].subject) || 'No Subject'}
            </DialogTitle>
            <Box overflow="auto">
              <EmailThread
                thread={thread}
                onEmailSent={email => {
                  // Right now, outlook doesn't return the sent email. So
                  // we check if the email is undefined, we just close the
                  // thread dialog as it seems the most reasonable thing
                  // to do.
                  if (email) {
                    onEmailSent(email)
                  } else if (otherProps.onClose) {
                    otherProps.onClose({}, 'escapeKeyDown')
                  }
                }}
              />
            </Box>
          </>
        )}
      </EmailThreadLoader>
    </Dialog>
  )
}
