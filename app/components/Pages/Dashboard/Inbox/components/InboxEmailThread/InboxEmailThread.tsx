import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, IconButton, Typography } from '@material-ui/core'
import { addNotification } from 'reapop'

import { IAppState } from 'reducers'

import { getEmailThread } from 'models/email/get-email-thread'

import LoadingContainer from 'components/LoadingContainer'
import Avatar from 'components/Avatar'
import { normalizeThreadMessageToThreadEmail } from 'components/EmailThread/helpers/normalize-to-email-thread-email'
import { EmailThreadEmails } from 'components/EmailThread'
import CloseIcon from 'components/SvgIcons/Close/CloseIcon'

import markEmailThreadAsRead from '../../helpers/mark-email-thread-as-read'
import getContactInfoFromEmailThread from '../../helpers/get-contact-info-from-email-thread'
import useEmailThreadEvents from '../../helpers/use-email-thread-events'
import NoContentMessage from '../NoContentMessage'

interface Props {
  emailThreadId?: UUID
  onClose: () => void
}

export default function InboxEmailThread({ emailThreadId, onClose }: Props) {
  const [status, setStatus] = useState<
    'empty' | 'fetching' | 'error' | 'fetched'
  >('empty')
  const [emailThread, setEmailThread] = useState<IEmailThread<
    'messages' | 'contacts'
  > | null>(null)

  const dispatch = useDispatch()
  const user = useSelector<IAppState, IUser>(({ user }) => user)

  const contactInfo = useMemo(
    () => emailThread && getContactInfoFromEmailThread(user, emailThread),
    [user, emailThread]
  )

  contactInfo && console.log('contactInfo', contactInfo) // TODO: Remove this line.

  const fetchEmailThread = useCallback(async () => {
    if (emailThreadId) {
      setStatus('fetching')

      try {
        const emailThread = await getEmailThread(emailThreadId)

        setEmailThread(emailThread)
        setStatus('fetched')

        if (!emailThread.is_read) {
          try {
            await markEmailThreadAsRead(emailThread)
          } catch (reason) {
            console.error(reason)
            dispatch(
              addNotification({
                status: 'error',
                message:
                  'Something went wrong while marking the email as read.' +
                  ' Please reload the page.'
              })
            )
          }
        }
      } catch (reason) {
        console.error(reason)
        dispatch(
          addNotification({
            status: 'error',
            message:
              'Something went wrong while fetching the email.' +
              ' Please reload the page.'
          })
        )
        setStatus('error')
      }
    } else {
      setStatus('empty')
    }
  }, [dispatch, emailThreadId])

  useEffect(() => {
    fetchEmailThread()
  }, [fetchEmailThread])

  const handleUpdateEmailThreads = useCallback(
    (updatedEmailThreadIds: UUID[]) => {
      if (emailThreadId && updatedEmailThreadIds.includes(emailThreadId)) {
        fetchEmailThread()
      }
    },
    [emailThreadId, fetchEmailThread]
  )
  const handleDeleteEmailThreads = useCallback(
    (deletedEmailThreadIds: UUID[]) => {
      if (emailThreadId && deletedEmailThreadIds.includes(emailThreadId)) {
        onClose()
      }

      if (emailThread && deletedEmailThreadIds.includes(emailThread.id)) {
        setEmailThread(null)
        setStatus('empty')
      }
    },
    [emailThread, emailThreadId, onClose]
  )

  useEmailThreadEvents(handleUpdateEmailThreads, handleDeleteEmailThreads)

  const emails = useMemo(
    () =>
      emailThread
        ? emailThread.messages.map(normalizeThreadMessageToThreadEmail)
        : [],
    [emailThread]
  )

  if (
    status === 'fetching' &&
    (!emailThread || emailThread.id !== emailThreadId)
  ) {
    return (
      <Box paddingTop={10}>
        <LoadingContainer style={{}} />
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
    <Box padding={2.5} paddingTop={2.5}>
      <Box display="flex" padding={2.5}>
        <Box flexGrow={1}>
          <Typography variant="h6" noWrap>
            {emailThread.subject || '(No Subject)'}
          </Typography>
        </Box>
        {!!emailThread.contacts && emailThread.contacts.length > 0 && (
          <Box marginRight={3} display="flex">
            {emailThread.contacts.map(c => (
              <Box key={c.id} marginLeft={0.5}>
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
            setEmailThread(null)
            setStatus('empty')
            onClose()
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
