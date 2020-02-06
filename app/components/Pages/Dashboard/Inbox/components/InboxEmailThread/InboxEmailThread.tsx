import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { WithRouterProps } from 'react-router'
import { useDispatch } from 'react-redux'
import { Box, IconButton, Typography } from '@material-ui/core'
import { addNotification } from 'reapop'

import { getEmailThread } from 'models/email/get-email-thread'

import Loading from 'partials/Loading'
import Avatar from 'components/Avatar'
import { normalizeThreadMessageToThreadEmail } from 'components/EmailThread/helpers/normalize-to-email-thread-email'
import { EmailThreadEmails } from 'components/EmailThread'
import CloseIcon from 'components/SvgIcons/Close/CloseIcon'

import NoContentMessage from '../NoContentMessage'
import setSelectedEmailThreadId from '../../helpers/set-selected-email-thread-id'
import markEmailThreadAsRead from '../../helpers/mark-email-thread-as-read'

interface Props {}

export default function InboxEmailThread({ params }: Props & WithRouterProps) {
  const selectedEmailThreadId: UUID | undefined = params.emailThreadId

  const [status, setStatus] = useState<
    'empty' | 'fetching' | 'error' | 'fetched'
  >('empty')
  const [emailThread, setEmailThread] = useState<IEmailThread<
    'messages' | 'contacts'
  > | null>(null)

  const dispatch = useDispatch()

  const fetchEmailThread = useCallback(async () => {
    if (selectedEmailThreadId) {
      setStatus('fetching')

      try {
        const emailThread = await getEmailThread(selectedEmailThreadId)

        setEmailThread(emailThread)
        setStatus('fetched')

        try {
          await markEmailThreadAsRead(emailThread)
        } catch (reason) {
          console.error(reason)
          dispatch(
            addNotification({
              status: 'error',
              message:
                'Something went wrong while marking the email as read. Please reload the page.'
            })
          )
        }
      } catch (reason) {
        console.error(reason)
        dispatch(
          addNotification({
            status: 'error',
            message:
              'Something went wrong while opening the email. Please, reload the page.'
          })
        )
        setStatus('error')
      }
    } else {
      setStatus('empty')
    }
  }, [dispatch, selectedEmailThreadId])

  useEffect(() => {
    fetchEmailThread()
  }, [fetchEmailThread])

  const emails = useMemo(
    () =>
      emailThread
        ? emailThread.messages.map(normalizeThreadMessageToThreadEmail)
        : [],
    [emailThread]
  )

  if (
    status === 'fetching' &&
    (!emailThread || emailThread.id !== selectedEmailThreadId)
  ) {
    return (
      <Box paddingTop={2}>
        <Loading />
      </Box>
    )
  }

  if (status === 'error') {
    return <NoContentMessage error>Error Opening Conversation</NoContentMessage>
  }

  if (status === 'empty' || !emailThread) {
    return <NoContentMessage>No Conversation Selected</NoContentMessage>
  }

  return (
    <Box padding="20px" paddingTop="20px">
      <Box display="flex" padding="12px 20px">
        <Box flexGrow={1}>
          <Typography variant="h6" noWrap>
            {emailThread.subject || '(No Subject)'}
          </Typography>
        </Box>
        {!!emailThread.contacts && emailThread.contacts.length > 0 && (
          <Box marginRight={3}>
            {emailThread.contacts.map(c => (
              <Box key={c.id} display="inline-block" marginLeft={0.5}>
                <Avatar
                  size={32}
                  image={c.profile_image_url}
                  title={
                    c.display_name === c.email
                      ? c.display_name
                      : `${c.display_name}\n${c.email}`
                  }
                />
              </Box>
            ))}
          </Box>
        )}
        <IconButton
          size="small"
          onClick={() => {
            setSelectedEmailThreadId(undefined)
            setEmailThread(null)
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box overflow="auto">
        <EmailThreadEmails emails={emails} />
      </Box>
    </Box>
  )
}
