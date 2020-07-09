import React, { useMemo } from 'react'
import { Box } from '@material-ui/core'

import { ModalProps } from '@material-ui/core/Modal'

import { DialogTitle } from '../DialogTitle'
import { EmailThreadEmails } from './EmailThreadEmails'
import { normalizeThreadMessageToThreadEmail } from './helpers/normalize-to-email-thread-email'

interface Props {
  messages: IEmailThreadMessage[]
  subject: string
  onClose?: ModalProps['onClose']
  hideBottomButtons?: boolean
}

/**
 * A component to show an email thread, which is basically a title on top and
 * a list of email items.
 */
export function EmailThread({
  messages,
  subject,
  onClose,
  hideBottomButtons
}: Props) {
  const emails = useMemo(
    () => messages.map(normalizeThreadMessageToThreadEmail),
    [messages]
  )

  return (
    <>
      <DialogTitle
        onClose={event => {
          onClose && onClose(event, 'escapeKeyDown')
        }}
      >
        {subject || 'No Subject'}
      </DialogTitle>
      <Box overflow="auto">
        <EmailThreadEmails
          emails={emails}
          onEmailSent={() => {
            // we can't append the email to the thread anymore because
            // the result of sending email is an email campaign now.
            // We can fetch the thread again and update it if we decided
            // it's necessary to append the new email to the thread instead
            // of closing th thread
            if (onClose) {
              onClose({}, 'escapeKeyDown')
            }
          }}
          hideBottomButtons={hideBottomButtons}
        />
      </Box>
    </>
  )
}
