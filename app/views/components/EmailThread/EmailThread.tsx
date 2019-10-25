import React, { useEffect, useState } from 'react'
import { Box } from '@material-ui/core'

import { ModalProps } from '@material-ui/core/Modal'

import { DialogTitle } from '../DialogTitle'
import { EmailThreadEmails } from './EmailThreadEmails'

interface Props {
  thread: IEmailThread
  onClose?: ModalProps['onClose']
}

/**
 * A component to show an email thread, which is basically a title on top and
 * a list of email items.
 */
export function EmailThread(props: Props) {
  const [thread, setThread] = useState(props.thread)

  useEffect(() => {
    setThread(props.thread)
  }, [props.thread])

  return (
    <>
      <DialogTitle
        onClose={event => {
          props.onClose && props.onClose(event, 'escapeKeyDown')
        }}
      >
        {(thread[0] && thread[0].subject) || 'No Subject'}
      </DialogTitle>
      <Box overflow="auto">
        <EmailThreadEmails
          thread={thread}
          onEmailSent={email => {
            // Right now, outlook doesn't return the sent email. So
            // we check if the email is undefined, we just close the
            // thread dialog as it seems the most reasonable thing
            // to do.
            if (
              email &&
              email.thread_key === thread[thread.length - 1].thread_key
            ) {
              setThread([...thread, email])
            } else if (props.onClose) {
              props.onClose({}, 'escapeKeyDown')
            }
          }}
        />
      </Box>
    </>
  )
}
